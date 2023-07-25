import { Client } from "pg";
import { JobType } from "@generated/type-graphql";
import { Parser, AST } from "node-sql-parser";
import { prisma } from "../../config";
import { QueryResult, OptimizationType, Select, handleFrom, handleWhere, getPredicate } from "./handleSql";

export interface QueryRequest {
  accessToken: string;
  query: string;
}

export interface QueryResponse {
  hasError: boolean;
  errors: string[];
  result: any;
}

// export const scheduleAlert = async (alertDate: Date): Promise<QueryResponse> => {
  
// }

export const processQuery = async (accessToken: string) => {
  const errors: string[] = [];
  let result: any = [];

  // 1) Validate the request body.
  if (!accessToken) {
    errors.push("Missing accessToken in request body.");
  }

  if (errors.length > 0) {
    return {
      hasError: true,
      errors,
      result,
    };
  }

  // 2) Get the most commonly queried statements, which will be the target queries
  // this optimization sequence will attempt to optimize. We assume that the commonly
  // queried statements are significantly more common for now.
  

  // 2) Given a list of sql queries, we convert them into abtstract syntax trees 
  // for easier parsing of the query strings
  const sqlParser = new Parser();
  const { tableList, columnList, ast } = sqlParser.parse(request.query);
  let sqlAsts = ast as AST[];

  // Iterate through each sql query to determine possible optimizations that can
  // be performed and add to output
  for (const sqlAst of sqlAsts) {
    const output: QueryResult = {
      [OptimizationType.ExplicitColumns]: [], 
      [OptimizationType.ExtractNested]: [], 
      [OptimizationType.ClusteredIndex]: [], 
      [OptimizationType.NonClusteredIndex]: [], 
      [OptimizationType.RemoveDistinct]: [], 
    };

    // 3) Suggest explicit column selection rather than using wildcard (*)
    await explicitColumn(sqlAst, output);
  
    // 4) Attempt to extract nested subqueries using WITH clause
    await extractSubQuery(sqlAst, output, true);

    // 5) Suggest valid indexes -> NOTE: if already exists a clustered index, need to tell user
    //   a) Attributes used in join predicate -> used for index only plan
    //   b) Range queries and multi-attribute search keys
    await findIndex(sqlAst, output);    
    
    // 6) Remove DISTINCT checks if not necessary
    await removeDistinct(sqlAst, output);
    
    console.log(output);
  }
}

// Optimization 1: Suggest explicit column selection rather than wilcard selection (*)
const explicitColumn = async (sqlAst: AST, output: QueryResult) => {
  if (sqlAst.type == "select") {
    let selectStatement = sqlAst as Select;
    
    // if the current statement contains a wildcard query, exit 
    // and add {OptimizationType.ExplicitColumn : {sqlQuery}} to output
    // remove WITH query details to declutter query information
    if (selectStatement.columns == "*") {
      selectStatement.with = null;
      const parser = new Parser();
      const sqlQuery = parser.sqlify(selectStatement);
      output[OptimizationType.ExplicitColumns].push(sqlQuery);
    }

    // check if there is wildcard column query in FROM clause
    if (selectStatement.from) {
      handleFrom(selectStatement.from, output, explicitColumn);
    }
    
    // check if there is wildcard column query in WHERE clause
    if (selectStatement.where) {
      handleWhere(selectStatement.where, output, explicitColumn);
    }

    // binary set/bag operations such as UNION, UNION ALL
    if (selectStatement._next) {
      explicitColumn(selectStatement._next, output);
    }
  }
}

// Optimization 2: Extract nested subqueries and suggest use of WITH statement
const extractSubQuery = async (sqlAst: AST, output: QueryResult, root: boolean = false) => {
  // console.log(sqlAst);
  if (sqlAst.type == "select") {
    let selectStatement = sqlAst as Select;

    if (!root) {
      const parser = new Parser();
      const sqlQuery = parser.sqlify(selectStatement);
      output[OptimizationType.ExtractNested].push(sqlQuery);
    }

    // check if there is wildcard column query in FROM clause
    if (selectStatement.from) {
      handleFrom(selectStatement.from, output, extractSubQuery);
    }
    
    // check if there is wildcard column query in WHERE clause
    if (selectStatement.where) {
      handleWhere(selectStatement.where, output, extractSubQuery);
    }

    // binary set/bag operations such as UNION, UNION ALL
    if (selectStatement._next) {
      extractSubQuery(selectStatement._next, output);
    }
  }
}

// Optimization 3: Suggest valid indexes for index only plans
//   NOTE: Users will be alerted if a clustering index already exists
const findIndex = async (sqlAst: AST, output: QueryResult) => {
  const tableAliases: {[key: string]: string} = {}
  if (sqlAst.type == "select") {
    let selectStatement = sqlAst as Select;

    // check for joins -> create index only plan for join predicates
    if (selectStatement.from) {
      const fromClauseAst = selectStatement.from;
      for (const fromClause of fromClauseAst) {
        if (fromClause.as) {
          tableAliases[fromClause.as] = fromClause.table;
        } else {
          tableAliases[fromClause.table] = fromClause.table;
        }
        if (fromClause.join && fromClause.on) {
          const leftPredicate = await getPredicate(fromClause.on.left);
          const rightPredicate = await getPredicate(fromClause.on.right);
          if (leftPredicate) {
            const tableName = tableAliases[leftPredicate.table];
            output[OptimizationType.NonClusteredIndex].push(tableName + "." + leftPredicate.column);
          }
          if (rightPredicate) {
            const tableName = tableAliases[rightPredicate.table];
            output[OptimizationType.NonClusteredIndex].push(tableName + "." + rightPredicate.column);
          }
        }
      }
    }
    
    // check for order by -> create clustered index
    if (selectStatement.orderby) {
      console.log(selectStatement.orderby);
      for (const orderNode of selectStatement.orderby) {
        const orderPredicate = await getPredicate(orderNode.expr);
        if (orderPredicate) {
          const tableName = tableAliases[orderPredicate.table];
          output[OptimizationType.ClusteredIndex].push(tableName + "." + orderPredicate.column);
        }
      }
    }
  }
}

// Optimization 4: Remove DISTINCT checks if not necessary
const removeDistinct = async (sqlAst: AST, output: QueryResult) => {
  if (sqlAst.type == "select") {
    let selectStatement = sqlAst as Select;
    
    // if the current statement contains DISTINCT query, exit 
    // and add {OptimizationType.RemoveDistinct : {sqlQuery}} to output
    // remove the WITH query details to declutter query information
    if (selectStatement.distinct == "DISTINCT") {
      selectStatement.with = null;
      const parser = new Parser();
      const sqlQuery = parser.sqlify(selectStatement);
      output[OptimizationType.RemoveDistinct].push(sqlQuery);
    }

    // check if there is DISTINCT query in subqueries of FROM clause
    if (selectStatement.from) {
      handleFrom(selectStatement.from, output, removeDistinct);
    }
    
    // check if there is DISTINCT query in subqueries of WHERE clause
    if (selectStatement.where) {
      handleWhere(selectStatement.where, output, removeDistinct);
    }

    // check if there is DISTINCT query in binary operations such as UNION, UNION ALL
    if (selectStatement._next) {
      explicitColumn(selectStatement._next, output);
    }
  }
}


const main = async () => {
  // The seed is set manually to ensure that the same data is generated every
  // time the production data is generated.
  // faker.seed(0);

  const rawRequest = "SELECT pid FROM Project JOIN User WHERE test > 10 ORDER BY User.age;"
  const rawUnionRequest = "SELECT pid FROM PROJECT UNION ALL SELECT uid FROM USER HAVING uid > 10;"
  const rawWhereRequest = "SELECT pid FROM Project where pid = uid AND test != this;"
  const test = `WITH QueryCount AS 
	(SELECT statement, COUNT(*) AS queryCount 
	 FROM SqlQuery 
	 GROUP BY statement)
SELECT DISTINCT *
FROM SqlQuery Q
JOIN QueryType ON Q.queryTypeId = QueryType.queryTypeId
JOIN Project ON Q.projectId = Project.projectId
WHERE Q.statement IN 
	(SELECT * 
	 FROM QueryCount 
	 WHERE queryCount >= (SELECT AVG(queryCount) FROM QueryCount)) AND Project.projectId IN (SELECT * FROM Test)
ORDER BY Q.age;`
  processQuery(rawUnionRequest);
};

main()