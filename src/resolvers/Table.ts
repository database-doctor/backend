import { Table } from "@generated/type-graphql";
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
class CreateTableInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  tableName!: string;

  @Field(() => Int)
  schemaId!: number;
}

@Resolver(() => Table)
export class TableResolver {
  @Query(() => [Table])
  async allTables(@Ctx() ctx: Context): Promise<Table[]> {
    return ctx.prisma.table.findMany();
  }

  @Query(() => Table)
  async table(
    @Args() { id }: IntId,
    @Ctx() ctx: Context
  ): Promise<Table | null> {
    const table = ctx.prisma.table.findUnique({
      where: {
        tableId: id,
      },
    });
    return table;
  }

  @Mutation(() => Table)
  async createTable(
    @Arg("newTable") newTable: CreateTableInput,
    @Ctx() ctx: Context
  ): Promise<Table> {
    const project = await ctx.prisma.table.create({
      data: {
        ...newTable,
      },
    });
    return project;
  }
}
