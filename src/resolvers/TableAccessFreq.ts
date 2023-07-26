import { TableAccessFreq, Table } from "@generated/type-graphql";
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

@Resolver(() => TableAccessFreq)
export class TableFreqResolver {
  @FieldResolver(() => Table)
  async table(@Root() rootTable: Table, @Ctx() ctx: Context): Promise<Table | null> {
    const table = await ctx.prisma.table.findFirst({where: { tid: rootTable.tid }});
    return table;
  }

  @Query(() => [TableAccessFreq])
  async tableFrequency(
    @Args() { pid }: ProjectId,
    @Ctx() ctx: Context
  ): Promise<TableAccessFreq[]> {
    const schema = await ctx.prisma.schema.findFirst({ where: { pid }});
    if (!schema) {
      return [];
    }

    const tables = await ctx.prisma.table.findMany({ where: { sid: schema.sid }})
    if (!tables) {
      return [];
    }
    
    return ctx.prisma.tableAccessFreq.findMany({ 
      where: { tid: { in : tables.map((table) => table.tid) } }
    });
  }
}
