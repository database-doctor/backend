import { Project } from "@generated/type-graphql";
import { Context } from "../middleware";
import {
  Field,
  Query,
  InputType,
  Authorized,
  Resolver,
  Ctx,
  Arg,
  Args,
  ArgsType,
  Mutation,
  Int,
  ObjectType,
} from "type-graphql";
import { MinLength, MaxLength } from "class-validator";

@ObjectType()
class ProjectDetail {
  @Field(() => Int)
  pid!: number;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Field()
  @MinLength(1)
  @MaxLength(511)
  dbUrl!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  createdBy!: string;
}

@ArgsType()
class ProjectId {
  @Field(() => Int)
  pid!: number;
}

@InputType()
class CreateProjectInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Field()
  @MinLength(1)
  @MaxLength(511)
  dbUrl!: string;
}

@Resolver(() => ProjectDetail)
export class ProjectDetailResolver {
  @Authorized()
  @Query(() => [ProjectDetail])
  async allProjects(@Ctx() ctx: Context): Promise<ProjectDetail[]> {
    const uid = ctx.user?.uid;

    const rawProjects = await ctx.prisma.$queryRawUnsafe(`
      SELECT "Project"."pid", "Project"."name", "Project"."dbUrl", "Project"."createdAt", "User"."username" AS "createdBy"
      FROM "Project"
      JOIN "UserProjectToken" ON "Project"."pid" = "UserProjectToken"."pid"
      JOIN "User" ON "UserProjectToken"."uid" = "User"."uid"
      WHERE "User"."userId" = ${uid};
    `);

    return rawProjects as ProjectDetail[];
  }

  @Authorized()
  @Query(() => ProjectDetail, { nullable: true })
  async project(
    @Args() { pid }: ProjectId,
    @Ctx() ctx: Context,
  ): Promise<ProjectDetail | null> {
    const uid = ctx.user?.uid;

    const rawProjects = await ctx.prisma.$queryRawUnsafe(`
      SELECT "Project"."pid", "Project"."name", "Project"."dbUrl", "Project"."createdAt", "User"."username" AS "createdBy"
      FROM "Project"
      JOIN "UserProjectToken" ON "Project"."projectId" = "UserProjectToken"."projectId"
      JOIN "User" ON "UserProjectToken"."userId" = "User"."userId"
      WHERE "User"."userId" = ${uid} AND "Project"."projectId" = ${pid};
    `);

    const projects = rawProjects as ProjectDetail[];

    if (projects.length == 0) {
      throw new Error("Project not found");
    }

    return projects[0];
  }
}

@Resolver(() => Project)
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg("newProject") newProject: CreateProjectInput,
    @Ctx() ctx: Context,
  ): Promise<Project> {
    const uid = ctx.user?.uid;
    if (!uid) {
      throw new Error("User not found");
    }

    const project = await ctx.prisma.project.create({
      data: {
        ...newProject,
        createdById: uid,
      },
    });

    return project;
  }
}
