import { prisma } from "../context";

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
export const processQuery = (rawRequest: any): QueryResponse => {
  const request = rawRequest as QueryRequest;

  let errors = [];
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

  // 2) Validate the access token.
  const userProjectToken = prisma.userProjectToken.findUnique({
    where: {
      accessToken: request.accessToken,
    },
    select: {
      project: {
        select: {
          projectId: true,
        },
      },
      user: {
        select: {
          userId: true,
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

  // const user = userProjectToken.user;
  // const project = userProjectToken.project;

  console.log(userProjectToken);

  // 3) Get the list of tables and associated columns in the project.
  // const tables = prisma.table.findMany({
  //   where: {
  //     schema: {
  //       projectId: project.projectId,
  //     },
  //   },
  //   include: {
  //     columns: true,
  //   },
  // });

  return {
    hasError: false,
    errors,
    result,
  };
};
