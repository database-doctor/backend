import { client } from "../util";

export type ColumnConfig = {
  name: string;
  type: string;
};

export type Column = {
  cid: number;
  name: string;
  type: string;
  tid: number;
};

const generateColumn = async (
  { name, type }: ColumnConfig,
  tid: number
): Promise<Column> => {
  const query = `
    INSERT INTO "Column" ("name", "type", "tid")
    VALUES ($1, $2, $3) RETURNING "cid";
  `;

  const res = await client.query(query, [name, type, tid]);
  const cid = res.rows[0].cid;

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
