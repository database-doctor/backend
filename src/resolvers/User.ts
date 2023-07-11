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

@ArgsType()
class StringEmail {
  @Field(() => String)
  email!: string;
}
@ArgsType()
class StringUsername {
  @Field(() => String)
  username!: string;
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

  @Query(() => User)
  async userByEmail(
    @Args() { email }: StringEmail,
    @Ctx() ctx: Context
  ): Promise<User | null> {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  @Query(() => [User], {nullable: true})
  async commonUserQueries(
    @Args() { id }: IntId,
    @Ctx() ctx: Context
  ): Promise<User[]> {
    const user = await ctx.prisma.$queryRaw<User[]>
      `WITH "UserQueries" AS 
        (SELECT "userId", COUNT(*) AS "queryCount" 
        FROM "SqlQuery" 
        GROUP BY "userId")    
      SELECT DISTINCT *
      FROM "User"
      JOIN "UserProjectToken" ON "User"."userId" = "UserProjectToken"."userId"
      JOIN "Project" ON "UserProjectToken"."projectId" = "Project"."projectId"
      WHERE "Project"."projectId" = ${id} AND "User"."userId" IN 
        (SELECT "userId"
        FROM "UserQueries"
        WHERE "queryCount" >= (SELECT AVG("queryCount") FROM "UserQueries"));`;
    return user;
  }

  @Query(() => User)
  async userByUsername(
    @Args() { username }: StringUsername,
    @Ctx() ctx: Context
  ): Promise<User | null> {
    const user = await ctx.prisma.user.findFirst({
      where: {
        username: username,
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
