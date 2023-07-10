import { ColumnType } from "@generated/type-graphql";
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
class CreateColumnTypeInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  columnTypeName!: string;
}

@Resolver(() => ColumnType)
export class ColumnTypeResolver {
  @Query(() => [ColumnType])
  async allColumnTypes(@Ctx() ctx: Context): Promise<ColumnType[]> {
    return ctx.prisma.columnType.findMany();
  }

  @Query(() => ColumnType)
  async columnType(
    @Args() { id }: IntId,
    @Ctx() ctx: Context
  ): Promise<ColumnType | null> {
    const column = ctx.prisma.columnType.findUnique({
      where: {
        columnTypeId: id,
      },
    });
    return column;
  }

  @Mutation(() => ColumnType)
  async createColumnType(
    @Arg("newColumnType") newColumnType: CreateColumnTypeInput,
    @Ctx() ctx: Context
  ): Promise<ColumnType> {
    const columnType = await ctx.prisma.columnType.create({
      data: {
        ...newColumnType,
      },
    });
    return columnType;
  }
}
