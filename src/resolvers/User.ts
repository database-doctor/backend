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

  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  passwordHash!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  passwordSalt!: string;

  @Field()
  @MinLength(1)
  @MaxLength(255)
  username!: string;
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  async allUsers(@Ctx() ctx: Context): Promise<User[]> {
    const users = await ctx.prisma.user.findMany({});
    return users;
  }

  @Query(() => User)
  async user(@Args() { id }: IntId, @Ctx() ctx: Context): Promise<User | null> {
    const user = await ctx.prisma.user.findUnique({
      where: {
        userId: id,
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