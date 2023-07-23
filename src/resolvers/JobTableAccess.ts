import { Context } from "../middleware";
import {
  Field,
  Query,
  Resolver,
  Ctx,
  Args,
  ArgsType,
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
class JobTableDetail {
  @Field(() => Int)
  tid!: number;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  tableName!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  schemaName!: string;
}

@Resolver(() => JobTableDetail)
export class JobTableDetailResolver {
  @Query(() => [JobTableDetail])
  async commonTableQueries(
    @Args() { pid }: ProjectId,
    @Ctx() ctx: Context,
  ): Promise<JobTableDetail[]> {
    const rawSqlQueries = await ctx.prisma.$queryRawUnsafe(`
      WITH "QueryCount" AS 
        (SELECT "tid", COUNT(*) AS "queryCount" 
        FROM "JobTableAccess" JTA
        GROUP BY JTA."tid")
      SELECT DISTINCT "Table"."tid", "Table"."name" as "tableName", "Schema"."name" as "schemaName"
      FROM "JobTableAccess" JTA
      JOIN "Table" ON JTA."tid" = "Table"."tid"
      JOIN "Schema" ON "Table"."sid" = "Schema"."sid"
      WHERE "Schema"."pid" = ${pid} AND JTA."tid" IN 
        (SELECT "tid" 
        FROM "QueryCount" 
        WHERE "queryCount" >= (SELECT AVG("queryCount") FROM "QueryCount"))
      LIMIT 10;
    `);

    return rawSqlQueries as JobTableDetail[];
  }
}
