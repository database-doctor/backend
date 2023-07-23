import { Schema } from "@generated/type-graphql";
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
} from "type-graphql";
import { MinLength, MaxLength } from "class-validator";

@ArgsType()
class SchemaId {
  @Field(() => Int)
  sid!: number;
}

@InputType()
class CreateSchemaInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Field(() => Int)
  pid!: number;
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

    return await ctx.prisma.schema.findMany({ where: { createdById } });
  }

  @Query(() => Schema)
  async schema(
    @Args() { sid }: SchemaId,
    @Ctx() ctx: Context,
  ): Promise<Schema | null> {
    const schema = ctx.prisma.schema.findUnique({ where: { sid } });
    return schema;
  }

  @Mutation(() => Schema)
  async createSchema(
    @Arg("newSchema") newSchema: CreateSchemaInput,
    @Ctx() ctx: Context,
  ): Promise<Schema> {
    const createdById = ctx.user?.uid;
    if (!createdById) {
      throw new Error("User not found");
    }

    const project = await ctx.prisma.schema.create({
      data: {
        ...newSchema,
        createdById,
      },
    });

    return project;
  }
}
