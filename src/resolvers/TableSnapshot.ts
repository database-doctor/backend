import { Context } from "../middleware";
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

@InputType()
class TableSnapshotInput {
  @Field(() => Int)
  tid!: number;

  @Field(() => String)
  fromTime!: string;

  @Field(() => String)
  toTime!: string;
}

@ObjectType()
class TableSnapshotOutput {
  @Field(() => Date)
  atTime!: Date;

  @Field(() => Int)
  rowCount!: number;

  @Field(() => Int)
  sizeBytes!: number;

  @Field(() => Int)
  queryCount!: number;
}

@Resolver(() => TableSnapshotOutput)
export class TableSnapshotResolver {
  @Query(() => [TableSnapshotOutput])
  async tableSnapshots(
    @Arg("table") table: TableSnapshotInput,
    @Ctx() ctx: Context
  ): Promise<TableSnapshotOutput[]> {
    const rawSnapshots = await ctx.prisma.$queryRawUnsafe(`
      SELECT
          date_trunc('hour', "TS"."createdAt") AS "atTime",
          MAX("TS"."rowCount") AS "rowCount",
          MAX("TS"."sizeBytes") AS "sizeBytes",
          COUNT("J"."atHour") AS "queryCount"
      FROM
          "TableSnapshot" "TS"
      LEFT JOIN
          "JobTableAccess" "JTA"
      ON
          "TS"."tid" = "JTA"."tid"
      LEFT JOIN
          (SELECT
              "J1"."jid",
              date_trunc('hour', "J1"."issuedAt") AS "atHour"
          FROM
              "Job" "J1") "J"
      ON
          "JTA"."jid" = "J"."jid" AND date_trunc('hour', "TS"."createdAt") = "J"."atHour"
      WHERE
          "TS"."tid" = '${table.tid}' AND
          '${table.fromTime}'::date <= "TS"."createdAt" AND
          "TS"."createdAt" <= '${table.toTime}'::date
      GROUP BY
          date_trunc('hour', "TS"."createdAt")
      ORDER BY
        date_trunc('hour', "TS"."createdAt") ASC;
    `);

    const snapshots = (rawSnapshots as any[]).map((rawSnapshot) => ({
      atTime: rawSnapshot.atTime,
      rowCount: Number(rawSnapshot.rowCount),
      sizeBytes: Number(rawSnapshot.sizeBytes),
      queryCount: Number(rawSnapshot.queryCount),
    }));

    return snapshots as TableSnapshotOutput[];
  }
}
