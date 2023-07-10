import { Column } from "@generated/type-graphql";
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
class CreateColumnInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  columnName!: string;

  @Field(() => Int)
  tableId!: number;

  @Field(() => Int)
  columnTypeId!: number;
}

@Resolver(() => Column)
export class ColumnResolver {
  @Query(() => [Column])
  async allColumns(@Ctx() ctx: Context): Promise<Column[]> {
    return ctx.prisma.column.findMany();
  }

  @Query(() => Column)
  async column(
    @Args() { id }: IntId,
    @Ctx() ctx: Context
  ): Promise<Column | null> {
    const column = ctx.prisma.column.findUnique({
      where: {
        columnId: id,
      },
    });
    return column;
  }

  @Mutation(() => Column)
  async createColumn(
    @Arg("newColumn") newColumn: CreateColumnInput,
    @Ctx() ctx: Context
  ): Promise<Column> {
    const column = await ctx.prisma.column.create({
      data: {
        ...newColumn,
      },
    });
    return column;
  }
}
