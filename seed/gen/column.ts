import { client } from "../util";

export type ColumnConfig = {
  name: string;
  type: string;
  frequency?: number;
};

export type Column = {
  cid: number;
  name: string;
  type: string;
  tid: number;
};

const generateColumnFrequency = async (cid: number, frequency: number) => {
  const query = `
    INSERT INTO "ColumnAccessFreq" ("cid", "frequency")
    VALUES ($1, $2);
  `;

  await client.query(query, [cid, frequency]);
};

const generateColumn = async (
  { name, type, frequency }: ColumnConfig,
  tid: number
): Promise<Column> => {
  const query = `
    INSERT INTO "Column" ("name", "type", "tid")
    VALUES ($1, $2, $3) RETURNING "cid";
  `;

  const res = await client.query(query, [name, type, tid]);
  const cid = res.rows[0].cid;

  if (frequency) await generateColumnFrequency(cid, frequency);

  return { cid, name, type, tid };
};

export const generateColumns = async (
  columns: ColumnConfig[],
  tid: number
): Promise<Column[]> => {
  const generatedColumns: Column[] = [];

  for (const column of columns) {
    const generatedColumn = await generateColumn(column, tid);
    generatedColumns.push(generatedColumn);
  }

  return generatedColumns;
};
