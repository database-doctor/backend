import { Table } from "@generated/type-graphql";
import { Context } from "../context";
import {
  Field,
  Int,
  Arg,
  Ctx,
  InputType,
  Resolver,
  Query,
  ObjectType,
} from "type-graphql";
import { MinLength, MaxLength } from "class-validator";
import { Prisma } from "prisma";

@ObjectType()
class TableSnapshot {
  @Field(() => Date)
  atTime!: Date;

  @Field(() => Int)
  rowCount!: number;

  @Field(() => Int)
  sizeBytes!: number;

  @Field(() => Int)
  queryCount!: number;

  constructor(
    atTime: Date,
    rowCount: number,
    sizeBytes: number,
    queryCount: number
  ) {
    this.atTime = atTime;
    this.rowCount = rowCount;
    this.sizeBytes = sizeBytes;
    this.queryCount = queryCount;
  }
}

@InputType()
class QueryTableSnapshotInput {
  @Field(() => Int)
  tableId!: number;

  @Field(() => String)
  fromTime!: string;

  @Field(() => String)
  toTime!: string;
}

@Resolver(() => TableSnapshot)
export class TableSnapshotResolver {
  @Query(() => [TableSnapshot])
  async tableSnapshots(
    @Arg("table") table: QueryTableSnapshotInput,
    @Ctx() ctx: Context
  ): Promise<TableSnapshot[]> {
    const rawSnapshots = await ctx.prisma.$queryRawUnsafe(`
      SELECT
          date_trunc('hour', T."createdAt") AS "atTime",
          T."rowCount",
          T."sizeBytes",
          COUNT(Q."atHour") AS "queryCount"
      FROM
          "TableStorageSnapshot" T
      LEFT JOIN
          "QueryTableAccess" TA
      ON
          T."tableId" = TA."tableId"
      LEFT JOIN
          (SELECT
              Q1."queryId",
              date_trunc('hour', Q1."issuedAt") AS "atHour"
          FROM
              "SqlQuery" Q1) Q
      ON
          TA."queryId" = Q."queryId" AND date_trunc('hour', T."createdAt") = Q."atHour"
      WHERE
          T."tableId" = ${table.tableId} AND
          '${table.fromTime}'::date <= T."createdAt" AND
          T."createdAt" <= '${table.toTime}'::date
      GROUP BY
          T."tableId", T."createdAt";
    `);

    const snapshots: TableSnapshot[] = (rawSnapshots as any[]).map(
      (rawSnapshot: any): TableSnapshot => {
        return new TableSnapshot(
          rawSnapshot!.atTime,
          rawSnapshot!.rowCount,
          rawSnapshot!.sizeBytes,
          Number(rawSnapshot!.queryCount)
        );
      }
    );

    return snapshots;
  }
}
