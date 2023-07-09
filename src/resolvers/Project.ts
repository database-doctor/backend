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
    async allProjects(@Ctx() ctx: Context): Promise<Project[]> {
        return ctx.prisma.project.findMany();
    }

    @Query(() => Project)
    async project(@Args() { id } : IntId, @Ctx() ctx: Context): Promise<Project | null> {
        const project = ctx.prisma.project.findUnique({
            where: {
                projectId: id
            },
        });
        return project;
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