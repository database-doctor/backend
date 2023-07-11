// create project
// query project by project id
import { Project } from "@generated/type-graphql";
import { Context } from "../context";
import {
  Field,
  Query,
  InputType,
  Resolver,
  Ctx,
  Arg,
  Args,
  ArgsType,
  Mutation,
  Int,
  ObjectType
} from "type-graphql";
import { MinLength, MaxLength, Max } from "class-validator";
import { raw } from "@prisma/client/runtime";

@ObjectType()
class ProjectDetail { 
  @Field(() => Int)
  projectId!: number;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  projectName!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  projectUrl!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  createdBy!: string;

  constructor (
    projectId: number, 
    projectName: string,
    projectUrl: string,
    createdAt: Date,
    createdBy: string
  ) {
    this.projectId = projectId;
    this.projectName = projectName;
    this.projectUrl = projectUrl;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }
}

@ArgsType()
class IntId {
  @Field(() => Int)
  userId!: number;
}

@InputType()
class CreateProjectInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  projectName!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  connUrl!: string;

  @Field(() => Int)
  @MinLength(1)
  @MaxLength(255)
  createdById!: number;
}

@Resolver(() => ProjectDetail)
export class ProjectDetailResolver {
    @Query(() => [ProjectDetail])
    async allProjects(
      @Args() { userId } : IntId, 
      @Ctx() ctx: Context
    ): Promise<ProjectDetail[]> {
      const rawProjects = await ctx.prisma.$queryRawUnsafe(`
        SELECT "Project"."projectId", "projectName", "connUrl" AS "projectUrl", "Project"."createdAt", "username" AS "createdBy"
        FROM "Project"
        JOIN "UserProjectToken" ON "Project"."projectId" = "UserProjectToken"."projectId"
        JOIN "User" ON "UserProjectToken"."userId" = "User"."userId"
        WHERE "User"."userId" = ${userId};
      `);

      const projects: ProjectDetail[] = (rawProjects as any[]).map(
        (rawProject: any): ProjectDetail => {
          return new ProjectDetail(
            rawProject.projectId, 
            rawProject.projectName, 
            rawProject.projectUrl, 
            rawProject.createdAt, 
            rawProject.createdAt
          )
        }
      )
      return projects;
    }

    @Query(() => ProjectDetail, {nullable: true})
    async project(
      @Arg('uid', () => Int) uid: number,  
      @Arg('pid', () => Int) pid: number, 
      @Ctx() ctx: Context
    ): Promise<ProjectDetail | null> {
        const rawProjects = await ctx.prisma.$queryRawUnsafe(`
          SELECT "Project"."projectId", projectName", "connUrl" AS "projectUrl", "Project"."createdAt", "username" AS "createdBy"
          FROM "Project"
          JOIN "UserProjectToken" ON "Project"."projectId" = "UserProjectToken"."projectId"
          JOIN "User" ON "UserProjectToken"."userId" = "User"."userId"
          WHERE "User"."userId" = ${uid} AND "Project"."projectId" = ${pid};
        `);
        const projects: ProjectDetail[] = (rawProjects as any[]).map(
          (rawProject: any): ProjectDetail => {
            return new ProjectDetail(
              rawProject.projectId, 
              rawProject.projectName, 
              rawProject.projectUrl, 
              rawProject.createdAt, 
              rawProject.createdAt
            )
          }
        )
        return projects[0];
    }
}

@Resolver(() => Project)
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg('newProject') newProject: CreateProjectInput,
    @Ctx() ctx: Context,
  ): Promise<Project> {
    const project = await ctx.prisma.project.create({
        data: {
            ...newProject,
        }, 
    });
    return project;
  }
}