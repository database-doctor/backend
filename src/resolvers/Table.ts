import { Table } from "@generated/type-graphql";
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
class TableId {
  @Field(() => Int)
  tid!: number;
}

@InputType()
class CreateTableInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Field(() => Int)
  sid!: number;
}

@Resolver(() => Table)
export class TableResolver {
  @Query(() => Table)
  async table(
    @Args() { tid }: TableId,
    @Ctx() ctx: Context,
  ): Promise<Table | null> {
    const table = await ctx.prisma.table.findUnique({ where: { tid } });

    return table;
  }

  @Mutation(() => Table)
  async createTable(
    @Arg("newTable") newTable: CreateTableInput,
    @Ctx() ctx: Context,
  ): Promise<Table> {
    const table = await ctx.prisma.table.create({
      data: {
        ...newTable,
      },
    });

    return table;
  }
}
