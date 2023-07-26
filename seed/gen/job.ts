import { Table } from "./table";
import { User } from "./user";
import { client } from "../util";
import { faker } from "@faker-js/faker";

export type JobConfig = {
  count: number;
  generateStatement: (params: any) => string;
  generateParams: () => any;
  type: string;
  duration: () => number;
  errorRatio: number;
  botRatio: number;
  accessed: {
    table: string;
    columns: string[];
  }[];
};

const accessTable = async (jid: number, tid: number) => {
  const query = `
    INSERT INTO "JobTableAccess" ("jid", "tid")
    VALUES ($1, $2);
  `;

  await client.query(query, [jid, tid]);
};

const accessColumn = async (jid: number, cid: number) => {
  const query = `
    INSERT INTO "JobColumnAccess" ("jid", "cid")
    VALUES ($1, $2);
  `;

  await client.query(query, [jid, cid]);
};

const generateJob = async (
  statement: string,
  type: string,
  duration: number,
  hasError: boolean,
  issuedById: number,
  pid: number,
  tables: number[],
  columns: number[]
) => {
  const query = `
    INSERT INTO "Job" ("statement", "type", "issuedAt", "finishedAt", "error", "issuedById", "pid")
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING "jid";
  `;

  const issuedAt = faker.date.between({
    from: "2023-04-01",
    to: "2023-05-31",
  });
  const finishedAt = new Date(issuedAt.getTime() + duration * 1000);
  const error = hasError ? faker.lorem.sentence() : null;

  const res = await client.query(query, [
    statement,
    type,
    issuedAt,
    finishedAt,
    error,
    issuedById,
    pid,
  ]);
  const jid = res.rows[0].jid;

  for (const tid of tables) {
    await accessTable(jid, tid);
  }

  for (const cid of columns) {
    await accessColumn(jid, cid);
  }
};

export const generateJobs = async (
  jobConfig: JobConfig,
  pid: number,
  allUsers: User[],
  allBots: User[],
  allTables: Table[]
) => {
  const {
    count,
    generateStatement,
    generateParams,
    type,
    duration,
    errorRatio,
    botRatio,
    accessed,
  } = jobConfig;

  const botCount = botRatio * count;

  const tidMap = new Map(allTables.map((table) => [table.name, table]));

  const accessedTables: number[] = [];
  const accessedColumns: number[] = [];

  for (const { table: tableName, columns } of accessed) {
    const table = tidMap.get(tableName);
    if (!table) {
      throw new Error(`table ${tableName} does not exist`);
    }
    accessedTables.push(table.tid);

    const cidMap = new Map(
      table.columns.map((column) => [column.name, column.cid])
    );

    columns.map((column) => {
      const cid = cidMap.get(column);
      if (!cid) {
        throw new Error(
          `column ${column} does not exist in table ${tableName}`
        );
      }
      accessedColumns.push(cid);
    });
  }

  for (let i = 0; i < count; i++) {
    const params = generateParams();
    const statement = generateStatement(params);
    const jobDuration = Math.round(duration() * 1000) / 1000;
    const hasError = faker.number.float() < errorRatio;
    const issuedById =
      i < botCount
        ? allBots[faker.number.int({ min: 0, max: allBots.length - 1 })].uid
        : allUsers[faker.number.int({ min: 0, max: allUsers.length - 1 })].uid;

    await generateJob(
      statement,
      type,
      jobDuration,
      hasError,
      issuedById,
      pid,
      accessedTables as number[],
      accessedColumns as number[]
    );
  }
};
