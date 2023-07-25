import { Job, Project, User } from "@generated/type-graphql";
import { Context } from "../middleware";
import {
  Field,
  Query,
  InputType,
  Resolver,
  Ctx,
  Arg,
  Mutation,
  Int,
  ObjectType,
  Root, 
  FieldResolver,
} from "type-graphql";
import { MinLength, MaxLength } from "class-validator";

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

@Resolver(() => Job)
export class JobResolver {
  @FieldResolver(() => User)
  async issuedByUser(@Root() job: Job, @Ctx() ctx: Context) {
    return await ctx.prisma.user.findFirst({
      where: {
        uid: job.issuedById,
      },
    });
  }

  @FieldResolver(() => Project)
  async project(@Root() job: Job, @Ctx() ctx: Context) {
    return await ctx.prisma.project.findFirst({
      where: {
        pid: job.pid,
      },
    });
  }

  @Query(() => [Job])
  async allJobs(
    @Arg("pid", () => Int) pid: number,
    @Ctx() ctx: Context
  ): Promise<Job[]> {
    const jobs = await ctx.prisma.$queryRaw<Job[]>`
      SELECT "User"."username", "Project"."name", "J"."statement" AS "queryStatement", 
        "J"."type" AS "queryType", "J"."issuedAt", "J"."finishedAt", "J"."error"
      FROM "Job" "J"
      JOIN "User" ON "J"."issuedById" = "User"."uid"
      JOIN "Project" ON "J"."pid" = "Project"."pid"
      WHERE "Project"."pid" = ${pid};
    `;
    return jobs;
  }

  @Query(() => Job)
  async job(
    @Arg("jid", () => Int) jid: number,
    @Arg("pid", () => Int) pid: number,
    @Ctx() ctx: Context
  ): Promise<Job | null> {
    const job = await ctx.prisma.$queryRaw<Job | null>`
      SELECT "User"."username", "Project"."name", "J"."statement" AS "queryStatement", 
        "J"."type" AS "queryType", "J"."issuedAt", "J"."finishedAt", "J"."error"
      FROM "Job" "J"
      JOIN "User" ON "J"."issuedById" = "User"."uid"
      JOIN "Project" ON "J"."pid" = "Project"."pid"
      WHERE "J"."jid" = ${jid} AND "Project"."pid" = ${pid};
    `;
    return job;
  }

  @Query(() => [Job])
  async jobsByType(
    @Arg("type") type: string,
    @Arg("pid", () => Int) pid: number,
    @Ctx() ctx: Context
  ): Promise<Job[]> {
    const jobs = await ctx.prisma.$queryRaw<Job[]>`
      SELECT "User"."username", "Project"."name", "J"."statement" AS "queryStatement", 
        "J"."type" AS "queryType", "J"."issuedAt", "J"."finishedAt", "J"."error"
      FROM "Job" "J"
      JOIN "User" ON "J"."issuedById" = "User"."uid"
      JOIN "Project" ON "J"."pid" = "Project"."pid"
      WHERE "Project"."pid" = ${pid} AND "J"."type" = '${type}';
    `;
    return jobs;
  }

  @Query(() => [Job])
  async commonSqlQueries(
    @Arg("pid", () => Int) pid: number,
    @Ctx() ctx: Context
  ): Promise<Job[]> {
    const commonJobs = await ctx.prisma.$queryRaw<Job[]>`
      WITH "QueryCount" AS 
        (SELECT "statement", COUNT(*) AS "queryCount" 
        FROM "Job"
        GROUP BY "statement")
      SELECT DISTINCT "Project"."name", "J"."statement" AS "queryStatement", 
        "J"."type" AS "queryType", "J"."issuedAt", "J"."finishedAt", "J"."error"
      FROM "Job" "J"
      JOIN "Project" ON "J"."pid" = "Project"."pid"
      WHERE "J"."statement" IN 
        (SELECT "statement" 
        FROM "QueryCount" 
        WHERE "queryCount" >= (SELECT AVG("queryCount") FROM "QueryCount")) AND "Project"."pid" = ${pid}
      LIMIT 10;
    `;
    return commonJobs;
  }
}