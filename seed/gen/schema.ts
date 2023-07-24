import { Table, TableConfig, generateTables } from "./table";

import { client } from "../util";
import { faker } from "@faker-js/faker";

export type SchemaConfig = {
  name: string;
  tables: TableConfig[];
};

export type Schema = {
  sid: number;
  name: string;
  pid: number;
  createdById: number;
  tables: Table[];
};

export const generateSchema = async (
  { name, tables }: SchemaConfig,
  pid: number,
  createdById: number
): Promise<Schema> => {
  const query = `
    INSERT INTO "Schema" ("name", "createdAt", "pid", "createdById")
    VALUES ($1, $2, $3, $4) RETURNING "sid";
  `;

  const createdAt = faker.date.between({
    from: "2023-02-01",
    to: "2023-02-31",
  });

  const res = await client.query(query, [name, createdAt, pid, createdById]);
  const sid = res.rows[0].sid;

  const generatedTables = await generateTables(tables, sid);

  return { sid, name, pid, createdById, tables: generatedTables };
};
