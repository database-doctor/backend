import { SqlQuery } from "@generated/type-graphql";
import { Context } from "../context";
import {
  Field,
  Query,
  InputType,
  Resolver,
  Ctx,
  Arg,
  Mutation,
  Int,
  ObjectType
} from "type-graphql";
import { MinLength, MaxLength } from "class-validator";

@ObjectType()
class SqlQueryDetail {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  username!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  projectName!: string;

  @Field()
  @MinLength(1)
  @MaxLength(65525)
  queryStatement!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  queryType!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  issuedAt!: string;

  @Field(() => Date, {nullable: true})
  finishedAt: Date;

  @Field(() => Boolean)
  hasError!: boolean;

  @Field({nullable: true})
  @MaxLength(255)
  errorMessage: string;

  constructor (
    username: string, 
    projectName: string,
    queryStatement: string,
    queryType: string,
    issuedAt: string, 
    finishedAt: Date, 
    hasError: boolean, 
    errorMessage: string
  ) {
    this.username = username;
    this.projectName = projectName;
    this.queryStatement = queryStatement;
    this.queryType = queryType;
    this.issuedAt = issuedAt;
    this.finishedAt = finishedAt;
    this.hasError = hasError;
    this.errorMessage = errorMessage;
  }
}

@InputType()
class CreateQueryInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  statement!: string;

  @Field(() => Int)
  userId!: number;

  @Field(() => Int)
  projectId!: number;

  @Field(() => Int)
  queryTypeId!: number;
}

@Resolver(() => SqlQueryDetail)
export class SqlQueryDetailResolver {
  async processRawQuery(rawSqlQueries: any[]): Promise<SqlQueryDetail[]> {
    const sqlQueries: SqlQueryDetail[] = (rawSqlQueries).map(
      (sqlQuery: any): SqlQueryDetail => {
        return new SqlQueryDetail(
          sqlQuery.username, 
          sqlQuery.projectName, 
          sqlQuery.queryStatement, 
          sqlQuery.queryType, 
          sqlQuery.issuedAt, 
          sqlQuery.finishedAt, 
          sqlQuery.hasError, 
          sqlQuery.errorMessage, 
        )
      }
    )
    return sqlQueries;
  }

  @Query(() => [SqlQueryDetail])
  async allSqlQueries(
    @Arg('projectId', () => Int) projectId: number, 
    @Ctx() ctx: Context
  ): Promise<SqlQueryDetail[]> {
    const rawSqlQueries = await ctx.prisma.$queryRawUnsafe(`
      SELECT "User"."username", "Project"."projectName", "Q"."statement" AS "queryStatement", 
        "QueryType"."queryTypeName" AS "queryType", "Q"."issuedAt", "Q"."finishedAt", "Q"."hasError", "Q"."errorMessage"
      FROM "SqlQuery" "Q"
      JOIN "QueryType" ON "Q"."queryTypeId" = "QueryType"."queryTypeId"
      JOIN "User" ON "Q"."userId" = "User"."userId"
      JOIN "Project" ON "Q"."projectId" = "Project"."projectId"
      WHERE "Project"."projectId" = ${ projectId };
    `);
    const sqlQueries: SqlQueryDetail[] = await this.processRawQuery(rawSqlQueries as any[]);
    return sqlQueries;
  }

  @Query(() => SqlQueryDetail)
  async sqlQuery(
    @Arg('queryId', () => Int) queryId: number, 
    @Arg('projectId', () => Int) projectId: number, 
    @Ctx() ctx: Context
  ): Promise<SqlQueryDetail | null> {
    const rawSqlQueries = await ctx.prisma.$queryRawUnsafe(`
      SELECT "User"."username", "Project"."projectName", "Q"."statement" AS "queryStatement", 
        "QueryType"."queryTypeName" AS "queryType", "Q"."issuedAt", "Q"."finishedAt", "Q"."hasError", "Q"."errorMessage"
      FROM "SqlQuery" "Q"
      JOIN "QueryType" ON "Q"."queryTypeId" = "QueryType"."queryTypeId"
      JOIN "User" ON "Q"."userId" = "User"."userId"
      JOIN "Project" ON "Q"."projectId" = "Project"."projectId"
      WHERE "Query"."queryId" = ${ queryId } AND "Project"."projectId" = ${ projectId };
    `);
    const sqlQueries: SqlQueryDetail[] = await this.processRawQuery(rawSqlQueries as any[]);
    return sqlQueries[0];
  }

  @Query(() => [SqlQueryDetail])
  async sqlQueriesByType(
    @Arg('queryType') queryType: string, 
    @Arg('projectId', () => Int) projectid: number, 
    @Ctx() ctx: Context
  ): Promise<SqlQueryDetail[]> {
    console.log(queryType);
    const rawSqlQueries = await ctx.prisma.$queryRawUnsafe(`
      SELECT "User"."username", "Project"."projectName", "Q"."statement" AS "queryStatement", 
        "QueryType"."queryTypeName" AS "queryType", "Q"."issuedAt", "Q"."finishedAt", "Q"."hasError", "Q"."errorMessage"
      FROM "SqlQuery" "Q"
      JOIN "QueryType" ON "Q"."queryTypeId" = "QueryType"."queryTypeId"
      JOIN "User" ON "Q"."userId" = "User"."userId"
      JOIN "Project" ON "Q"."projectId" = "Project"."projectId"
      WHERE "Project"."projectId" = ${ projectid } AND "QueryType"."queryTypeName" = $1;
    `, queryType);
    return this.processRawQuery(rawSqlQueries as any[]);
  }

  @Query(() => [SqlQueryDetail])
  async commonSqlQueries(
    @Arg('projectId', () => Int) projectid: number, 
    @Ctx() ctx: Context
  ): Promise<SqlQueryDetail[]> {
    const rawSqlQueries = await ctx.prisma.$queryRawUnsafe(`
      WITH "QueryCount" AS 
        (SELECT "statement", COUNT(*) AS "queryCount" 
        FROM "SqlQuery" 
        GROUP BY "statement")
      SELECT DISTINCT "User"."username", "Project"."projectName", "Q"."statement" AS "queryStatement", 
        "QueryType"."queryTypeName" AS "queryType", "Q"."issuedAt", "Q"."finishedAt", "Q"."hasError", "Q"."errorMessage"
      FROM "SqlQuery" "Q"
      JOIN "QueryType" ON "Q"."queryTypeId" = "QueryType"."queryTypeId"
      JOIN "User" ON "Q"."userId" = "User"."userId"
      JOIN "Project" ON "Q"."projectId" = "Project"."projectId"
      WHERE "Q"."statement" IN 
        (SELECT "statement" 
        FROM "QueryCount" 
        WHERE "queryCount" >= (SELECT AVG("queryCount") FROM "QueryCount")) AND "Project"."projectId" = ${projectid};
    `);
    return this.processRawQuery(rawSqlQueries as any[]);
  }
}

@Resolver(() => SqlQuery)
export class SqlQueryResolver {
  @Mutation(() => SqlQuery)
  async createSqlQuery(
      @Arg('newSqlQuery') newSqlQuery: CreateQueryInput,
      @Ctx() ctx: Context
  ): Promise<SqlQuery> {
      const sqlQuery = await ctx.prisma.sqlQuery.create({
          data: {
              ...newSqlQuery,
          },
      });
      return sqlQuery;
  }
}