import { client } from "../util";
import { logger } from "../../src/util";

export type Permission = {
  pid: number;
  name: string;
};

const generatePermission = async (name: string): Promise<Permission> => {
  const query = `
    INSERT INTO "Permission" ("name")
    VALUES ('${name}') RETURNING "pid";
  `;

  const res = await client.query(query, [name]);
  const pid = res.rows[0].pid;
  return { pid, name };
};

export const generatePermissions = async () => {
  const names: string[] = [
    "admin:manage_users",
    "admin:create_service_account",
    "analytics:view",
    "settings:view",
    "settings:edit",

    // From @Malav
    "project:read",
    "project:share",
    "schema:read",
    "schema:update",
    "job:read",
    "job:create",
    "job:update",
    "snapshot:read",
    "alert:create",
    "alert:read",
    "alert:update",
    "alert:delete",
  ];

  const permissions: Permission[] = [];
  for (let i = 0; i < names.length; i++) {
    permissions.push(await generatePermission(names[i]));
  }

  logger.info(`generated ${names.length} permissions`);
  return permissions;
};
