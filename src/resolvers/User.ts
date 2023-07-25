import {
  ArgsType,
  Arg,
  Field,
  Authorized,
  InputType,
  Int,
  ObjectType,
  Resolver,
  Mutation,
  Query,
  Args,
  Ctx,
  Root,
  FieldResolver,
} from "type-graphql";
import { IsEmail, MaxLength, MinLength } from "class-validator";

import { Context } from "../middleware";
import { User, Project, Role } from "@generated/type-graphql";
import { createAuthToken, hashPassword, verifyPassword } from "../auth";

@ArgsType()
class UserId {
  @Field(() => Int)
  uid!: number;
}

@ArgsType()
class UserEmail {
  @Field(() => String)
  email!: string;
}

@ArgsType()
class UserUsername {
  @Field(() => String)
  username!: string;
}

@ArgsType()
class ProjectId {
  @Field(() => Int)
  pid!: number;
}

@InputType()
class RegisterUserInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Field()
  @MinLength(1)
  @MaxLength(32)
  username!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(8)
  @MaxLength(64)
  password!: string;
}

@ObjectType()
class RegisterUserOutput {
  @Field()
  token!: string;
}

@InputType()
class LoginUserInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
class LoginUserOutput {
  @Field()
  token!: string;
}

@Resolver(() => User)
export class UserResolver {
  @Authorized()
  @Query(() => User)
  async user(@Ctx() ctx: Context): Promise<User | null> {
    if (!ctx.user || !ctx.user.uid) {
      ctx.logger.error(`no uid specified for get user request`);
      return null;
    }

    const user = await ctx.prisma.user.findUnique({
      where: { uid: ctx.user.uid },
    });

    if (!user) {
      ctx.logger.error(`user not found with uid: ${ctx.user.uid}`);
      return null;
    }

    if (user && user.uid !== ctx.user?.uid) {
      user.password = "";
    }

    return user;
  }

  @Authorized()
  @Query(() => User)
  async userByEmail(
    @Args() { email }: UserEmail,
    @Ctx() ctx: Context
  ): Promise<User | null> {
    const user = await ctx.prisma.user.findUnique({ where: { email } });

    if (!user) {
      ctx.logger.error(`user not found with email: ${email}`);
      return null;
    }

    if (user && user.uid !== ctx.user?.uid) {
      user.password = "";
    }

    return user;
  }

  @Authorized()
  @Query(() => User)
  async userByUsername(
    @Args() { username }: UserUsername,
    @Ctx() ctx: Context
  ): Promise<User | null> {
    const user = await ctx.prisma.user.findUnique({ where: { username } });

    if (!user) {
      ctx.logger.error(`user not found with username: ${username}`);
      return null;
    }

    if (user && user.uid !== ctx.user?.uid) {
      user.password = "";
    }

    return user;
  }

  @Mutation(() => RegisterUserOutput)
  async registerUser(
    @Arg("newUser") newUser: RegisterUserInput,
    @Ctx() ctx: Context
  ): Promise<RegisterUserOutput> {
    const { name, username, email, password } = newUser;

    const existingUserEmail = await ctx.prisma.user.findUnique({
      where: { email },
    });
    if (existingUserEmail) {
      ctx.logger.error(`user already exists for email: ${email}`);
      throw new Error("Email already exists.");
    }

    const existingUserUsername = await ctx.prisma.user.findUnique({
      where: { username },
    });
    if (existingUserUsername) {
      ctx.logger.error(`user already exists for username: ${username}`);
      throw new Error("Username already exists.");
    }

    const user = await ctx.prisma.user.create({
      data: { name, username, email, password: hashPassword(password) },
    });

    ctx.logger.info(`created user: ${user.uid} ${user.email}`);
    return { token: createAuthToken(user.uid) };
  }

  @Mutation(() => LoginUserOutput)
  async loginUser(
    @Arg("userCreds") userCreds: LoginUserInput,
    @Ctx() ctx: Context
  ): Promise<LoginUserOutput> {
    const { email, password } = userCreds;

    const user = await ctx.prisma.user.findUnique({ where: { email } });
    if (!user) {
      ctx.logger.error(`user not found for email: ${email}`);
      throw new Error("Invalid email or password.");
    }

    if (!verifyPassword(password, user.password)) {
      ctx.logger.error(`invalid password for email: ${email}`);
      throw new Error("Invalid email or password.");
    }

    ctx.logger.info(`logged in user: ${user.uid} ${user.email}`);
    return { token: createAuthToken(user.uid) };
  }

  @Authorized()
  @FieldResolver(() => [Project])
  async projects(@Root() user: User, @Ctx() ctx: Context) {
    return await ctx.prisma.project.findMany({
      where: {
        createdById: user.uid,
      },
    });
  }

  @Authorized()
  @Query(() => [User], { nullable: true })
  async commonUserQueries(
    @Args() { uid }: UserId,
    @Ctx() ctx: Context
  ): Promise<User[]> {
    const user = await ctx.prisma.$queryRaw<User[]>`
      WITH "UserQueries" AS 
        (SELECT "Job"."issuedById", COUNT(*) AS "queryCount" 
        FROM "Job" 
        GROUP BY "Job"."issuedById")
      SELECT DISTINCT *
      FROM "User"
      JOIN "UserProjectToken" ON "User"."uid" = "UserProjectToken"."uid"
      JOIN "Project" ON "UserProjectToken"."pid" = "Project"."pid"
      WHERE "Project"."pid" = ${uid} AND "User"."uid" IN 
        (SELECT "UQ"."issuedById"
        FROM "UserQueries" "UQ"
        WHERE "UQ"."queryCount" >= (SELECT AVG("queryCount") FROM "UserQueries"))
      LIMIT 10;
    `;
    return user;
  }

  @FieldResolver(() => [Role])
  async userRoles(
    @Root() user: User,
    @Args() { pid }: ProjectId,
    @Ctx() ctx: Context
  ): Promise<Role[]> {
    const userRoles = await ctx.prisma.userRoleMap.findMany({
      where: {
        uid: user.uid,
      },
    });

    const projectRoles = await ctx.prisma.role.findMany({
      where: {
        pid,
        rid: { in: userRoles.map((u) => u.rid) },
      },
    });

    return projectRoles;
  }
}
