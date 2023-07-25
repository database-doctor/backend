import { Client } from "pg";
import { JobType } from "@generated/type-graphql";
import { Parser, AST, Column, ColumnRef, Dual, From, Limit, OrderBy, With } from "node-sql-parser";
import { prisma } from "../../config";

export type QueryResult = {[key in OptimizationType]: string[]};

export enum OptimizationType {
  ExplicitColumns = 0, 
  ExtractNested,
  ClusteredIndex, 
  NonClusteredIndex, 
  RemoveDistinct, 
}

export interface JoinPredicate {
  table: string, 
  column: string, 
}

export interface QueryRequest {
  accessToken: string;
  query: string;
}

export interface QueryResponse {
  hasError: boolean;
  errors: string[];
  result: any;
}

interface Select {
  with: With | null;
  type: "select";
  options: any[] | null;
  distinct: "DISTINCT" | null;
  columns: any[] | Column[] | "*";
  from: Array<From | Dual | any> | null;
  where: any;
  groupby: ColumnRef[] | null;
  having: any[] | null;
  orderby: OrderBy[] | null;
  limit: Limit | null;
  _orderby?: OrderBy[] | null;
  _limit?: Limit | null;
  parentheses_symbol?: boolean;
  _parentheses?: boolean;
  _next?: AST;
}

// Column Optimization: Suggest valid indexes for index only plans
//   a) Attributes used in join predicate -> used for index only plan
//   b) Range queries and multi-attribute search keys
export const findIndex = async (output: QueryResult) => {
  // Find the most queried table
  const filterTables = await prisma.tableAccessFreq.findMany({
    take: 2, 
    orderBy: {
      frequency: 'desc', 
    }, 
  })

  for (const table of filterTables) {
    // Find all queries that accessed the current table
    const jobTableAccesses = await prisma.jobTableAccess.findMany({
      where: { tid: table.tid }, 
      include: {
        Job: true, 
      }, 
    })

    for (const jobTableAccess of jobTableAccesses) {
      // parse the query statement corresponding to the jobTableAccess tuple
      const sqlParser = new Parser();
      const { tableList, columnList, ast } = sqlParser.parse(jobTableAccess.Job.statement);
      const sqlAsts = ast as AST[];

      // Iterate through the abstract syntax trees to determine possible indexes
      for (const sqlAst of sqlAsts) {
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
    }
  }
}

export const optimizeQuery = async (query: string, output: QueryResult) => {
  // 1) Given a sql queries, we convert them into abtstract syntax trees 
  // for easier parsing of the query strings
  const sqlParser = new Parser();
  const { tableList, columnList, ast } = sqlParser.parse(query);
  let sqlAsts = ast as AST[];

  // Iterate through each sql query to determine possible optimizations that can
  // be performed and add to output
  for (const sqlAst of sqlAsts) {
    // 2) Suggest explicit column selection rather than using wildcard (*)
    await explicitColumn(sqlAst, output);
  
    // 3) Attempt to extract nested subqueries using WITH clause
    await extractSubQuery(sqlAst, output, true);
    
    // 4) Remove DISTINCT checks if not necessary
    await removeDistinct(sqlAst, output);
    
    console.log(output);
  }
}

// Query Optimization 1: Suggest explicit column selection rather than wilcard selection (*)
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

// Query Optimization 2: Extract nested subqueries and suggest use of WITH statement
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

// Query Optimization 3: Remove DISTINCT checks if not necessary
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

// Helper functions to handle SQL clauses and predicates

const handleFrom = async (fromClause: any, output: QueryResult, callback: (ast: AST, output: QueryResult) => void) => {
  for (const node of fromClause) {
    if (node.expr) {
      callback(node.expr.ast, output);
    }
  }
}

const handleWhere = async (whereClause: any, output: QueryResult, callback: (ast: AST, output: QueryResult) => void) => {
  const leftNode = whereClause.left;
  const rightNode = whereClause.right;
  if (leftNode.type == "expr_list") {
    for (const leftClause of leftNode.value) {
      callback(leftClause.ast, output);
    }
  }
  if (rightNode.type == "expr_list") {
    for (const rightClause of rightNode.value) {
      callback(rightClause.ast, output);
    }
  }

  if (leftNode.type == "binary_expr") {
    handleWhere(leftNode, output, callback);
  }
  if (rightNode.type == "binary_expr") {
    handleWhere(rightNode, output, callback);
  }
}

const getPredicate = async (joinNode: any): Promise<JoinPredicate | null> => {
  if (joinNode && joinNode.type == "column_ref") {
    return {
      "table": joinNode.table, 
      "column": joinNode.column, 
    };
  }
  return null;
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

const output: QueryResult = {
  [OptimizationType.ExplicitColumns]: [], 
  [OptimizationType.ExtractNested]: [], 
  [OptimizationType.ClusteredIndex]: [], 
  [OptimizationType.NonClusteredIndex]: [], 
  [OptimizationType.RemoveDistinct]: [], 
};
  findIndex(output);
};

main()