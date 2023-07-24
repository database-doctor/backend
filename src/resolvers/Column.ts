import { Column, Table } from "@generated/type-graphql";
import { Context } from "../middleware";
import {
  Resolver,
  ArgsType,
  Args,
  Field,
  Int,
  Authorized,
  Ctx,
  Query,
  FieldResolver,
  Root,
} from "type-graphql";

@ArgsType()
class ColumnId {
  @Field(() => Int)
  cid!: number;
}

@Resolver(() => Column)
export class ColumnResolver {
  @Authorized()
  @Query(() => Column)
  async column(@Args() { cid }: ColumnId, @Ctx() ctx: Context) {
    const column = await ctx.prisma.column.findUnique({
      where: { cid },
    });

    return column;
  }

  @FieldResolver(() => Table)
  async table(@Root() column: Column, @Ctx() ctx: Context) {
    const table = await ctx.prisma.table.findUnique({
      where: { tid: column.tid },
    });

    return table;
  }
}
