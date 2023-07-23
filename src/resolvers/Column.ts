import { Column, ColumnType } from "@generated/type-graphql";
import { Context } from "../middleware";
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
class ColumnId {
  @Field(() => Int)
  cid!: number;
}

@InputType()
class CreateColumnInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Field(() => Int)
  tid!: number;

  @Field(() => String)
  type!: ColumnType;
}

@Resolver(() => Column)
export class ColumnResolver {
  @Query(() => Column)
  async column(
    @Args() { cid }: ColumnId,
    @Ctx() ctx: Context,
  ): Promise<Column | null> {
    const column = await ctx.prisma.column.findUnique({ where: { cid } });

    return column;
  }

  @Mutation(() => Column)
  async createColumn(
    @Arg("newColumn") newColumn: CreateColumnInput,
    @Ctx() ctx: Context,
  ): Promise<Column> {
    const column = await ctx.prisma.column.create({
      data: {
        ...newColumn,
      },
    });

    return column;
  }
}
