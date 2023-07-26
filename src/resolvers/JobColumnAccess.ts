import { Context } from "../middleware";
import {
  Field,
  Query,
  Resolver,
  Ctx,
  ArgsType,
  Args,
  Int,
  ObjectType,
} from "type-graphql";
import { MinLength, MaxLength } from "class-validator";

@ArgsType()
class ProjectId {
  @Field(() => Int)
  pid!: number;
}

@ObjectType()
class JobColumnDetail {
  @Field(() => Int)
  cid!: number;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  columnName!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  columnType!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  tableName!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  schemaName!: string;
}

@Resolver(() => JobColumnDetail)
export class JobColumnDetailResolver {
  @Query(() => [JobColumnDetail])
  async commonColumnQueries(
    @Args() { pid }: ProjectId,
    @Ctx() ctx: Context,
  ): Promise<JobColumnDetail[]> {
    const rawSqlQueries = await ctx.prisma.$queryRawUnsafe(`
      WITH "QueryCount" AS 
        (SELECT JCA."cid", COUNT(*) AS "queryCount" 
        FROM "JobColumnAccess" JCA
        GROUP BY JCA."cid")
      SELECT DISTINCT "Column"."cid", "Column"."name" as "columnName", "Column"."type" as "columnType", "Table"."name" as "tableName", "Schema"."name" as "schemaName"
      FROM "JobColumnAccess"
      JOIN "Column" ON "JobColumnAccess"."cid" = "Column"."cid"
      JOIN "Table" ON "Column"."tid" = "Table"."tid"
      JOIN "Schema" ON "Table"."sid" = "Schema"."sid"
      WHERE "Schema"."pid" = ${pid} AND "JobColumnAccess"."cid" IN 
        (SELECT "cid" 
        FROM "QueryCount" 
        WHERE "queryCount" >= (SELECT AVG("queryCount") FROM "QueryCount"))
      LIMIT 10;
    `);
    if (!rawSqlQueries) {
      return [];
    }
    return rawSqlQueries as JobColumnDetail[];
  }
}
