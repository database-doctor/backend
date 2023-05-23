import { User } from "@generated/type-graphql";
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
import { IsEmail, MinLength, MaxLength } from "class-validator";

@ArgsType()
class IntId {
  @Field(() => Int)
  id!: number;
}

@InputType()
class CreateUserInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @MinLength(1)
  @MaxLength(255)
  name?: string;
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  async user(@Args() { id }: IntId, @Ctx() ctx: Context): Promise<User | null> {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  }

  @Mutation(() => User)
  async createUser(
    @Arg("newUser") newUser: CreateUserInput,
    @Ctx() ctx: Context
  ): Promise<User> {
    const user = await ctx.prisma.user.create({
      data: {
        ...newUser,
      },
    });
    return user;
  }
}
