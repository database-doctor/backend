import { Client } from "pg";
import { JobType } from "@generated/type-graphql";
import { Parser } from "node-sql-parser";
import { prisma } from "../../config";
import { QueryResult, OptimizationType, optimizeQuery } from "./queryOptimizer";

interface QueryRequest {
  accessToken: string;
  query: string;
}

interface QueryResponse {
  hasError: boolean;
  errors: string[];
  result: any;
}

// processQuery: QueryRequest -> QueryResponse
// Processes a query as outlined in routes.ts.
export const processQuery = async (rawRequest: any): Promise<QueryResponse> => {
  const request = rawRequest as QueryRequest;

  const errors: string[] = [];
  let result: any = [];

  // 1) Validate the request body.
  if (!request.accessToken) {
    errors.push("Missing accessToken in request body.");
  }

  if (!request.query) {
    errors.push("Missing query in request body.");
  }

  if (errors.length > 0) {
    return {
      hasError: true,
      errors,
      result,
    };
  }

  // 2) Validate the access token, and get table and column information.
  const userProjectToken = await prisma.userProjectToken.findUnique({
    where: {
      token: request.accessToken,
    },
    select: {
      project: {
        select: {
          pid: true,
          dbUrl: true,
          schemas: {
            select: {
              sid: true,
              tables: {
                select: {
                  tid: true,
                  name: true,
                  columns: {
                    select: {
                      cid: true,
                      name: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      },
      user: {
        select: {
          uid: true,
        },
      },
    },
  });

  if (!userProjectToken) {
    errors.push("Invalid accessToken.");
  }

  if (errors.length > 0) {
    return {
      hasError: true,
      errors,
      result,
    };
  }

  const project = userProjectToken!.project;
  const tables = project.schemas[0].tables;

  // 3) Match the query against the tables and columns for the project to
  // create a list of tables and columns queries.

  // let ast;
  let tableList;
  let columnList;

  try {
    const sqlParser = new Parser();
    const parseResult = sqlParser.parse(request.query);

    // ast = parseResult.ast;
    tableList = parseResult.tableList;
    columnList = parseResult.columnList;
  } catch (err: any) {
    errors.push("Failed to parse query. See next error for details.");
    errors.push(JSON.stringify(err));

    return {
      hasError: true,
      errors,
      result,
    };
  }

  // Now, tableList contains the list of tables in the query, and columnList
  // contains the list of columns in the query.

  // For the lack of a better solution, we use a simple heuristic to find the
  // list of affected tables and columns. tableList contains a string of
  // referenced tables of the form "opType::dbName::tableName". For our
  // purposes, we can safely ignore the opType and dbName, and only use the
  // tableName. We filter the tableList by matching tableNames, since we assume
  // that only columns from these tables are used.
  //
  // Similarly, columnList contains a string of referenced columns of the form
  // "opType::tableName::columnName". tableName can be null here, so we need to
  // manually match the tableName from tableList if the table from tableList
  // has columnName as one of its listed columns. As a heuristic, we match the
  // first table from tableList where the above criteria is satisfied.

  const parsedTables = tableList.map((table) => table.split("::")[2]);

  // Accessed tables are the tables that are referenced in the query.
  const accessedTables = tables.filter((table) =>
    parsedTables.includes(table.name),
  );

  const parsedColumns = columnList.map((column) => {
    const parts = column.split("::");
    return {
      tableName: parts[1],
      columnName: parts[2],
    };
  });

  const accessedColumns: Set<{
    cid: number;
    name: string;
  }> = new Set();

  parsedColumns.forEach((curCol) => {
    const table = accessedTables.find(
      (table) => table.name === curCol.tableName,
    );

    if (table) {
      if (curCol!.columnName === "(.*)") {
        table.columns.forEach((tableCol) => {
          accessedColumns.add(tableCol);
        });
        return;
      }

      const searchCol = table.columns.find(
        (tableCol) => tableCol.name === curCol.columnName,
      );
      if (searchCol) {
        accessedColumns.add(searchCol);
      }
    } else {
      if (curCol!.columnName == "(.*)") {
        if (accessedTables.length == 1) {
          accessedTables[0].columns.forEach((tableCol) => {
            accessedColumns.add(tableCol);
          });
        }
        return;
      }

      // If we cannot find the table, try to match the column name with a
      // column name from any of the tables.
      accessedTables.forEach((table) => {
        const searchCol = table.columns.find(
          (tableCol) => tableCol.name === curCol.columnName,
        );

        if (searchCol) {
          accessedColumns.add(searchCol);
        }
      });
    }
  });

  // 4) Determine if query has already been optimized
  const pastJob = await prisma.job.findFirst({ where: { statement: request.query } });

  // 5) Create the entry for the query in the database.
  const uid = userProjectToken!.user.uid;
  if (!uid) {
    errors.push("Invalid accessToken.");
    return {
      hasError: true,
      errors,
      result,
    };
  }

  const job = await prisma.job.create({
    data: {
      statement: request.query,
      issuedById: userProjectToken!.user.uid,
      pid: project.pid,
      type: JobType.SELECT,
    },
  });

  // const jobTableAccess =
  await prisma.jobTableAccess.createMany({
    data: accessedTables.map((table) => {
      return {
        jid: job.jid,
        tid: table.tid,
      };
    }),
  });

  // const jobColumnAccess =
  await prisma.jobColumnAccess.createMany({
    data: Array.from(accessedColumns).map((col) => {
      return {
        jid: job.jid,
        cid: col.cid,
      };
    }),
  });

  // 6) Increment accessed table count in ...
  Array.from(accessedTables).map((table) => {
    prisma.tableAccessFreq.upsert({
      where: { tid: table.tid }, 
      update: {
        frequency: { increment: 1 }, 
      }, 
      create: { tid: table.tid }, 
    })
  });
  
  // 7) Find possible query optimizations
  if (!pastJob?.optimized) {
    // Output is formatted as follows
    // key: enum of OptimizationType
    // value: a list of strings representing queries/subqueries that can be optimized
    // based on the OptimizationType
    const output: QueryResult = {
      [OptimizationType.ExplicitColumns]: [], 
      [OptimizationType.ExtractNested]: [], 
      [OptimizationType.ClusteredIndex]: [], 
      [OptimizationType.NonClusteredIndex]: [], 
      [OptimizationType.RemoveDistinct]: [], 
    };

    // NEXT STEP -> Trigger email alert to admin that belong to project
    optimizeQuery(request.query, output); 
    const curJob = await prisma.job.findFirst({ where: { statement: request.query } });
    if (curJob) {
      await prisma.job.update({
        where: { jid: curJob.jid }, 
        data: { optimized: true, }, 
      });
    }
  }

  // 8) Execute the query in the database.
  const client = new Client({
    connectionString: project.dbUrl,
  });

  try {
    await client.connect();
  } catch (err: any) {
    errors.push("Failed to connect to database. See next error for details.");
    errors.push(JSON.stringify(err));
    return {
      hasError: true,
      errors,
      result,
    };
  }

  let queryResult;
  try {
    queryResult = await client.query(request.query);
  } catch (err: any) {
    queryResult = err;
    await prisma.job.update({
      where: {
        jid: job.jid,
      },
      data: {
        error: JSON.stringify(err),
      },
    });
  } finally {
    result = queryResult;
    await prisma.job.update({
      where: {
        jid: job.jid,
      },
      data: {
        finishedAt: new Date(),
      },
    });
  }

  try {
    await client.end();
  } catch (err: any) {
    errors.push(
      "Failed to end connection to database. See next error for details.",
    );
    errors.push(JSON.stringify(err));
    return {
      hasError: true,
      errors,
      result,
    };
  }

  return {
    hasError: false,
    errors,
    result,
  };
};
