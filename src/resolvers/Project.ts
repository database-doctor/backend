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
} from "type-graphql";
import { MinLength, MaxLength } from "class-validator";


@ArgsType()
class IntId {
  @Field(() => Int)
  id!: number;
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

@Resolver(() => Project)
export class ProjectResolver {
    @Query(() => [Project])
    async allProjects(@Args() { id }: IntId, @Ctx() ctx: Context): Promise<Project[]> {
        const project = await ctx.prisma.$queryRaw<Project[]>
        `SELECT "projectName", "connUrl" AS "projectUrl", "Project"."createdAt", "username" AS "createdBy"
        FROM "Project"
        JOIN "UserProjectToken" ON "Project"."projectId" = "UserProjectToken"."projectId"
        JOIN "User" ON "UserProjectToken"."userId" = "User"."userId"
        WHERE "User"."userId" = ${id};`;
        return project;
    }

    @Query(() => Project)
    async project(@Arg('uid') uid: number, @Arg('pid') pid: number, @Ctx() ctx: Context): Promise<Project | null> {
        const project = await ctx.prisma.$queryRaw<Project[]>
        `SELECT "projectName", "connUrl" AS "projectUrl", "Project"."createdAt", "username" AS "createdBy"
        FROM "Project"
        JOIN "UserProjectToken" ON "Project"."projectId" = "UserProjectToken"."projectId"
        JOIN "User" ON "UserProjectToken"."userId" = "User"."userId"
        WHERE "User"."userId" = ${uid} AND "Project"."projectId" = ${pid};`;
        return project[0];
    }

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