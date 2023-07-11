import { UserProjectToken } from "@generated/type-graphql";
import { Context } from "../context";
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
class IntId {
  @Field(() => Int)
  id!: number;
}

@InputType()
class CreateUserProjectTokenInput {
  @Field(() => Int)
  userId!: number;
  
  @Field(() => Int)
  projectId!: number;
  
  @Field()
  @MinLength(1)
  @MaxLength(255)
  accessToken!: string;
}

@Resolver(() => UserProjectToken)
export class UserProjectTokenResolver {
  @Query(() => [UserProjectToken])
  async allUserProjectTokens(@Ctx() ctx: Context): Promise<UserProjectToken[]> {
    return ctx.prisma.userProjectToken.findMany();
  }

  @Query(() => UserProjectToken)
  async userProjectToken(
    @Arg('uid', () => Int) uid: number,  
    @Arg('pid', () => Int) pid: number, 
    @Ctx() ctx: Context
  ): Promise<UserProjectToken | null> {
    const token = ctx.prisma.userProjectToken.findUnique({
      where: {
        userId_projectId: {
            projectId: pid,
            userId: uid, 
        }
      },
    });
    return token;
  }

  @Mutation(() => UserProjectToken)
  async createUserProjectToken(
    @Arg("newUserProjectToken") newUserProjectToken: CreateUserProjectTokenInput,
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
