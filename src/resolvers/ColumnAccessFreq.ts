import { ColumnAccessFreq, Column } from "@generated/type-graphql";
import { Context } from "../middleware";
import {
  Field,
  Ctx,
  Args,
  ArgsType,
  Int,
  Resolver,
  Query,
  FieldResolver,
  Root,
} from "type-graphql";

@ArgsType()
class ProjectId {
  @Field(() => Int)
  pid!: number;
}

@Resolver(() => ColumnAccessFreq)
export class ColumnFreqResolver {
  @FieldResolver(() => Column)
  async column(@Root() rootColumn: Column, @Ctx() ctx: Context): Promise<Column | null> {
    const column = await ctx.prisma.column.findFirst({where: { tid: rootColumn.tid }});
    return column;
  }

  @Query(() => [ColumnAccessFreq])
  async columnFrequency(
    @Args() { pid }: ProjectId,
    @Ctx() ctx: Context
  ): Promise<ColumnAccessFreq[]> {
    const schema = await ctx.prisma.schema.findFirst({ where: { pid }});
    if (!schema) {
      return [];
    }

    const tables = await ctx.prisma.table.findMany({ where: { sid: schema.sid }})
    if (!tables) {
      return [];
    }

    const columns = await ctx.prisma.column.findMany({
      where: { tid: { in : tables.map((table) => table.tid) } }
    });
    if (!columns) {
      return [];
    }
  
    return ctx.prisma.columnAccessFreq.findMany({ 
      where: { cid: { in : columns.map((column) => column.cid) } }
    });
  }
}
