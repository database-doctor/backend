import { Schema } from "@generated/type-graphql";
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
class CreateSchemaInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  schemaName!: string;

  @Field(() => Int)
  projectId!: number;

  @Field(() => Int)
  createdById!: number;
}

@Resolver(() => Schema)
export class SchemaResolver {
  @Query(() => [Schema])
  async allSchemas(@Ctx() ctx: Context): Promise<Schema[]> {
    return ctx.prisma.schema.findMany();
  }

  @Query(() => Schema)
  async schema(
    @Args() { id }: IntId,
    @Ctx() ctx: Context
  ): Promise<Schema | null> {
    const schema = ctx.prisma.schema.findUnique({
      where: {
        schemaId: id,
      },
    });
    return schema;
  }

  @Mutation(() => Schema)
  async createSchema(
    @Arg("newSchema") newSchema: CreateSchemaInput,
    @Ctx() ctx: Context
  ): Promise<Schema> {
    const project = await ctx.prisma.schema.create({
      data: {
        ...newSchema,
      },
    });
    return project;
  }
}
