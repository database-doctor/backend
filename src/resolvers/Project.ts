import { Project, UserProjectToken, User } from "@generated/type-graphql";
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
  FieldResolver,
  Root,
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
      WHERE "User"."uid" = ${uid};
    `);

    return rawProjects as ProjectDetail[];
  }

  // @Authorized() // TODO : UNCOMMENT THIS
  @Query(() => ProjectDetail, { nullable: true })
  async project(
    @Args() { pid }: ProjectId,
    @Ctx() ctx: Context
  ): Promise<ProjectDetail | null> {
    const uid = ctx.user?.uid;

    // TODO : CHECK THAT USER CAN ACTUALLY ACCESS THIS PROJECT

    const rawProjects = await ctx.prisma.$queryRawUnsafe(`
      SELECT "Project"."pid", "Project"."name", "Project"."dbUrl", "Project"."createdAt", "User"."username" AS "createdBy"
      FROM "Project"
      LEFT JOIN "User" ON "User"."uid" = "Project"."createdById"
      WHERE "Project"."pid" = ${pid};
    `);

    const projects = rawProjects as ProjectDetail[];

    if (projects.length == 0) {
      throw new Error("Project not found");
    }

    return projects[0];
  }

  // @Authorized() // TODO : UNCOMMENT THIS
  @FieldResolver(() => [User])
  async users(@Root() project: Project, @Ctx() ctx: Context) {
    // TODO : CHECK THAT THE USER MAKING THIS QUERY HAS THE CORRECT ROLE TO MANAGE USERS

    const uids_with_access = await ctx.prisma.userProjectToken.findMany({
      where: {
        pid: project.pid,
      },
    });

    return await ctx.prisma.user.findMany({
      where: {
        uid: { in: uids_with_access.map((x) => x.uid) },
      },
    });
  }
}

@Resolver(() => Project)
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg("newProject") newProject: CreateProjectInput,
    @Ctx() ctx: Context
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
