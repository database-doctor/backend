import { SqlQuery } from "@generated/type-graphql";
import { Context } from "../context";
import {
  Field,
  Query,
  InputType,
  Resolver,
  Ctx,
  Arg,
  Args,
  ArgsType,
  Mutation,
  Int,
} from "type-graphql";
import { MinLength, MaxLength } from "class-validator";


@ArgsType()
class IntId {
  @Field(() => Int)
  id!: number;
}

@InputType()
class CreateQueryInput {
    @Field()
    @MinLength(1)
    @MaxLength(255)
    statement!: string;

    @Field(() => Int)
    userId!: number;

    @Field(() => Int)
    projectId!: number;

    @Field(() => Int)
    queryTypeId!: number;
}

@Resolver(() => SqlQuery)
export class SqlQueryResolver {
    @Query(() => [SqlQuery])
    async allSqlQueries(@Ctx() ctx: Context): Promise<SqlQuery[]> {
        return ctx.prisma.sqlQuery.findMany();
    }

    @Query(() => SqlQuery)
    async sqlQuery(@Args() { id } : IntId, @Ctx() ctx: Context): Promise<SqlQuery | null> {
        const sqlQuery = ctx.prisma.sqlQuery.findUnique({
            where: {
                queryId: id
            },
        });
        return sqlQuery;
    }

    @Mutation(() => SqlQuery)
    async createSqlQuery(
        @Arg('newSqlQuery') newSqlQuery: CreateQueryInput,
        @Ctx() ctx: Context
    ): Promise<SqlQuery> {
        const sqlQuery = await ctx.prisma.sqlQuery.create({
            data: {
                ...newSqlQuery,
            },
        });
        return sqlQuery;
    }
}