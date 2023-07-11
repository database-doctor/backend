import { Context } from "../context";
import {
  Field,
  Query,
  InputType,
  Resolver,
  Ctx,
  Arg,
  Int,
  ObjectType
} from "type-graphql";
import { MinLength, MaxLength } from "class-validator";

@ObjectType()
class QueryTableDetail {
  @Field(() => Int)
  tableId: number;
  
  @Field()
  @MinLength(1)
  @MaxLength(255)
  tableName: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  schemaName: string;

  constructor (
    tableId: number, 
    tableName: string, 
    schemaName: string, 
  ) {
    this.tableId = tableId;
    this.tableName = tableName;
    this.schemaName = schemaName;
  }
}

@Resolver(() => QueryTableDetail)
export class QueryTableDetailResolver {
  async processRawQuery(rawSqlQueries: any[]): Promise<QueryTableDetail[]> {
    const sqlQueries: QueryTableDetail[] = (rawSqlQueries).map(
      (sqlQuery: any): QueryTableDetail => {
        return new QueryTableDetail(
          sqlQuery.tableId,
          sqlQuery.tableName, 
          sqlQuery.schemaName
        )
      }
    )
    return sqlQueries;
  }

  @Query(() => [QueryTableDetail])
  async commonTableQueries(
    @Arg('projectId', () => Int) projectid: number, 
    @Ctx() ctx: Context
  ): Promise<QueryTableDetail[]> {
    const rawSqlQueries = await ctx.prisma.$queryRawUnsafe(`
      WITH "QueryCount" AS 
        (SELECT "tableId", COUNT(*) AS "queryCount" 
        FROM "QueryTableAccess" 
        GROUP BY "tableId")
      SELECT DISTINCT "Table"."tableId", "Table"."tableName", "Schema"."schemaName"
      FROM "QueryTableAccess"
      JOIN "Table" ON "QueryTableAccess"."tableId" = "Table"."tableId"
      JOIN "Schema" ON "Table"."schemaId" = "Schema"."schemaId"
      WHERE "Schema"."projectId" = ${projectid} AND "QueryTableAccess"."tableId" IN 
        (SELECT "tableId" 
        FROM "QueryCount" 
        WHERE "queryCount" >= (SELECT AVG("queryCount") FROM "QueryCount"));
    `);
    return this.processRawQuery(rawSqlQueries as any[]);
  }
}