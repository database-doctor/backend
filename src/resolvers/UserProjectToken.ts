import { UserProjectToken } from "@generated/type-graphql";
import { Context } from "../middleware";
import {
  Field,
  Int,
  Args,
  Arg,
  ArgsType,
  Ctx,
  InputType,
  Resolver,
  Query,
  Mutation,
} from "type-graphql";
import { MinLength, MaxLength } from "class-validator";

@ArgsType()
class UserId {
  @Field(() => Int)
  uid!: number;
}

@ArgsType()
class ProjectId {
  @Field(() => Int)
  pid!: number;
}

@InputType()
class CreateUserProjectTokenInput {
  @Field(() => Int)
  uid!: number;

  @Field(() => Int)
  pid!: number;

  // @Field()
  // @MinLength(1)
  // @MaxLength(255)
  // token!: string;
}

@InputType()
class AddUserToProjectInput {
  @Field(() => Int)
  email!: string;

  @Field(() => Int)
  pid!: number;

  @Field(() => [Number])
  roles?: number[];
}

@Resolver(() => UserProjectToken)
export class UserProjectTokenResolver {
  @Query(() => UserProjectToken)
  async userProjectToken(
    @Args() { uid }: UserId,
    @Args() { pid }: ProjectId,
    @Ctx() ctx: Context
  ): Promise<UserProjectToken | null> {
    const token = await ctx.prisma.userProjectToken.findUnique({
      where: {
        uid_pid: {
          uid,
          pid,
        },
      },
    });

    return token;
  }

  @Mutation(() => UserProjectToken)
  async createUserProjectToken(
    @Arg("newUserProjectToken")
    newUserProjectToken: CreateUserProjectTokenInput,
    @Ctx() ctx: Context
  ): Promise<UserProjectToken> {
    const token = await ctx.prisma.userProjectToken.create({
      data: {
        ...newUserProjectToken,
      },
    });

    return token;
  }

  @Mutation(() => UserProjectToken)
  async addUserToProject(
    @Arg("addUserInput") addUserInput: AddUserToProjectInput,
    @Ctx() ctx: Context
  ): Promise<UserProjectToken> {
    const user = await ctx.prisma.user.findFirstOrThrow({
      where: {
        email: addUserInput.email,
      },
    });

    const token = await ctx.prisma.userProjectToken.create({
      data: {
        uid: user.uid,
        pid: addUserInput.pid,
      },
    });

    const newUserRoleMappings = addUserInput.roles?.map((r) => ({
      rid: r,
      uid: user.uid,
    }));

    await ctx.prisma.userRoleMap.createMany({
      data: newUserRoleMappings || [],
    });

    return token;
  }
}
