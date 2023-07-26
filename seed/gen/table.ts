import { Column, ColumnConfig, generateColumns } from "./column";

import { client } from "../util";

export type SnapshotConfig = {
  initialRowCount: number;
  nextRowCount: (prevRowCount: number) => number;
  sizeBytesFactor: number;
};

export type TableConfig = {
  name: string;
  columns: ColumnConfig[];
  snapshot: SnapshotConfig;
};

export type Table = {
  tid: number;
  name: string;
  sid: number;
  columns: Column[];
};

const generateSnapshot = async (
  tid: number,
  createdAt: Date,
  rowCount: number,
  sizeBytes: number
) => {
  const query = `
    INSERT INTO "TableSnapshot" ("tid", "createdAt", "rowCount", "sizeBytes")
    VALUES ($1, $2, $3, $4);
  `;

  await client.query(query, [tid, createdAt, rowCount, sizeBytes]);
};

const generateTable = async (
  { name, columns, snapshot }: TableConfig,
  sid: number
): Promise<Table> => {
  const query = `
    INSERT INTO "Table" ("name", "sid")
    VALUES ($1, $2) RETURNING "tid";
  `;

  const res = await client.query(query, [name, sid]);
  const tid = res.rows[0].tid;

  const generatedColumns = await generateColumns(columns, tid);

  const cur = new Date(2023, 4, 1);
  const end = new Date(2023, 5, 31);
  let rowCount = snapshot.initialRowCount;

  while (cur <= end) {
    await generateSnapshot(
      tid,
      cur,
      rowCount,
      rowCount * snapshot.sizeBytesFactor
    );
    cur.setTime(cur.getTime() + 60 * 60 * 1000);
    rowCount = snapshot.nextRowCount(rowCount);
  }

  return { tid, name, sid, columns: generatedColumns };
};

export const generateTables = async (
  tables: TableConfig[],
  sid: number
): Promise<Table[]> => {
  const generatedTables: Table[] = [];

  for (const table of tables) {
    const generatedTable = await generateTable(table, sid);
    generatedTables.push(generatedTable);
  }

  return generatedTables;
};
