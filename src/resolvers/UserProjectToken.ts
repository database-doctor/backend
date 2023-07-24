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
}
