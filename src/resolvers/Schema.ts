import { Schema, User, Table, ColumnType } from "@generated/type-graphql";
import { Context } from "../middleware";
import {
  Authorized,
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
  FieldResolver,
  Root,
} from "type-graphql";
import { MinLength, MaxLength } from "class-validator";

@ArgsType()
class SchemaId {
  @Field(() => Int)
  sid!: number;
}

@ArgsType()
class ProjectId {
  @Field(() => Int)
  pid!: number;
}

@InputType()
class CreateSchemaColumnInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Field()
  type!: ColumnType;
}

@InputType()
class CreateSchemaTableInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Field(() => [CreateSchemaColumnInput])
  columns!: CreateSchemaColumnInput[];
}

@InputType()
class CreateSchemaInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Field(() => Int)
  pid!: number;

  @Field(() => [CreateSchemaTableInput])
  tables!: CreateSchemaTableInput[];
}

@Resolver(() => Schema)
export class SchemaResolver {
  @Authorized()
  @Query(() => [Schema])
  async allSchemas(@Ctx() ctx: Context): Promise<Schema[]> {
    const createdById = ctx.user?.uid;
    if (!createdById) {
      throw new Error("User not found");
    }

    const schemas = await ctx.prisma.schema.findMany({
      where: { createdById },
    });

    return schemas;
  }

  @Authorized()
  @Query(() => Schema)
  async schema(
    @Args() { sid }: SchemaId,
    @Ctx() ctx: Context
  ): Promise<Schema | null> {
    const schema = await ctx.prisma.schema.findUnique({ where: { sid } });

    if (!schema) {
      throw new Error("Schema not found");
    }

    return schema;
  }

  @Authorized()
  @Query(() => Schema)
  async latestSchema(
    @Args() { pid }: ProjectId,
    @Ctx() ctx: Context
  ): Promise<Schema> {
    const schema = await ctx.prisma.schema.findMany({
      where: { pid },
      orderBy: { sid: "desc" },
      take: 1,
    });

    if (!schema || schema.length == 0) {
      throw new Error("Schema not found");
    }

    return schema[0];
  }

  @FieldResolver(() => User)
  async createdBy(@Root() schema: Schema, @Ctx() ctx: Context) {
    const user = await ctx.prisma.user.findUnique({
      where: { uid: schema.createdById },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  @FieldResolver(() => [Table])
  async tables(@Root() schema: Schema, @Ctx() ctx: Context) {
    const tables = await ctx.prisma.table.findMany({
      where: { sid: schema.sid },
    });

    return tables;
  }

  @Authorized()
  @Mutation(() => Schema)
  async createSchema(
    @Arg("newSchema") { name, pid, tables }: CreateSchemaInput,
    @Ctx() ctx: Context
  ): Promise<Schema> {
    ctx.logger.info("createSchema", name, pid, tables);

    const createdById = ctx.user?.uid;
    if (!createdById) {
      throw new Error("User not found");
    }

    const schema = await ctx.prisma.schema.create({
      data: {
        name,
        pid,
        createdById,
      },
    });

    for (const table of tables) {
      const newTable = await ctx.prisma.table.create({
        data: {
          name: table.name,
          sid: schema.sid,
        },
      });

      for (const column of table.columns) {
        await ctx.prisma.column.create({
          data: {
            name: column.name,
            type: column.type,
            tid: newTable.tid,
          },
        });
      }
    }

    return schema;
  }
}
