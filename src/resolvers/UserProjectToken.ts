import {
  UserProjectToken,
  UserProjectTokenUidPidCompoundUniqueInput,
} from "@generated/type-graphql";
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
}

@InputType()
class AddUserToProjectInput {
  @Field(() => String)
  email!: string;

  @Field(() => Int)
  pid!: number;

  @Field(() => [Int])
  roles?: number[];
}

@InputType()
class RemoveUserFromProjectInput {
  @Field(() => Int)
  uid!: number;
  @Field(() => Int)
  pid!: number;
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

    // TODO : assert that user is not already added to project

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

  @Mutation(() => UserProjectToken)
  async removeUserFromProject(
    @Arg("removeUserFromProjectInput")
    removeUserFromProjectInput: RemoveUserFromProjectInput,
    @Ctx() ctx: Context
  ): Promise<UserProjectToken> {
    const uid = removeUserFromProjectInput.uid;
    const pid = removeUserFromProjectInput.pid;

    const project = await ctx.prisma.project.findFirstOrThrow({
      where: { pid },
    });

    if (project.createdById === uid) {
      throw new Error("Cannot revoke access from the owner of the project!");
    }

    const projectRoles = (
      await ctx.prisma.role.findMany({
        where: { pid },
      })
    ).map((r) => r.rid);

    await ctx.prisma.userRoleMap.deleteMany({
      where: { uid, rid: { in: projectRoles } },
    });

    const removed = await ctx.prisma.userProjectToken.delete({
      where: {
        uid_pid: {
          uid,
          pid,
        },
      },
    });

    return removed;
  }
}
