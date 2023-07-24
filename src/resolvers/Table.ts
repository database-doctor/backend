import { Table, Column } from "@generated/type-graphql";
import { Context } from "../middleware";
import {
  Field,
  Int,
  Args,
  ArgsType,
  Ctx,
  Resolver,
  Query,
  FieldResolver,
  Root,
  Authorized,
} from "type-graphql";

@ArgsType()
class TableId {
  @Field(() => Int)
  tid!: number;
}

@Resolver(() => Table)
export class TableResolver {
  @Authorized()
  @Query(() => Table)
  async table(
    @Args() { tid }: TableId,
    @Ctx() ctx: Context
  ): Promise<Table | null> {
    const table = await ctx.prisma.table.findUnique({ where: { tid } });

    return table;
  }

  @FieldResolver(() => [Column])
  async columns(@Root() table: Table, @Ctx() ctx: Context): Promise<Column[]> {
    const columns = await ctx.prisma.column.findMany({
      where: { tid: table.tid },
    });

    return columns;
  }
}
