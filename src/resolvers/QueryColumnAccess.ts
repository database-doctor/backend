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
class QueryColumnDetail {
  @Field(() => Int)
  columnId: number;
  
  @Field()
  @MinLength(1)
  @MaxLength(255)
  columnName: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  columnTypeName: string;
  
  @Field()
  @MinLength(1)
  @MaxLength(255)
  tableName: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  schemaName: string;

  constructor (
    columnId: number, 
    columnName: string,
    columnTypeName: string, 
    tableName: string, 
    schemaName: string, 
  ) {
    this.columnId = columnId;
    this.columnName = columnName;
    this.columnTypeName = columnTypeName;
    this.tableName = tableName;
    this.schemaName = schemaName;
  }
}

@Resolver(() => QueryColumnDetail)
export class QueryColumnDetailResolver {
  async processRawQuery(rawSqlQueries: any[]): Promise<QueryColumnDetail[]> {
    const sqlQueries: QueryColumnDetail[] = (rawSqlQueries).map(
      (sqlQuery: any): QueryColumnDetail => {
        return new QueryColumnDetail(
          sqlQuery.columnId,
          sqlQuery.columnName, 
          sqlQuery.columnTypeName, 
          sqlQuery.tableName, 
          sqlQuery.schemaName
        )
      }
    )
    return sqlQueries;
  }

  @Query(() => [QueryColumnDetail])
  async commonColumnQueries(
    @Arg('projectId', () => Int) projectid: number, 
    @Ctx() ctx: Context
  ): Promise<QueryColumnDetail[]> {
    const rawSqlQueries = await ctx.prisma.$queryRawUnsafe(`
      WITH "QueryCount" AS 
        (SELECT "columnId", COUNT(*) AS "queryCount" 
        FROM "QueryColumnAccess" 
        GROUP BY "columnId")
      SELECT DISTINCT "Column"."columnId", "Column"."columnName", "ColumnType"."columnTypeName","Table"."tableName", "Schema"."schemaName"
      FROM "QueryColumnAccess"
      JOIN "Column" ON "QueryColumnAccess"."columnId" = "Column"."columnId"
      JOIN "ColumnType" ON "Column"."columnTypeId" = "ColumnType"."columnTypeId"
      JOIN "Table" ON "Column"."tableId" = "Table"."tableId"
      JOIN "Schema" ON "Table"."schemaId" = "Schema"."schemaId"
      WHERE "Schema"."projectId" = ${projectid} AND "QueryColumnAccess"."columnId" IN 
        (SELECT "columnId" 
        FROM "QueryCount" 
        WHERE "queryCount" >= (SELECT AVG("queryCount") FROM "QueryCount"));
    `);
    return this.processRawQuery(rawSqlQueries as any[]);
  }
}