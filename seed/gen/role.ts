import { Permission } from "./permission";
import { client } from "../util";

export type RoleConfig = {
  name: string;
  permissions: string[];
};

export type Role = {
  rid: number;
  name: string;
  pid: number;
};

const generateRole = async (
  { name, permissions }: RoleConfig,
  projectId: number,
  allPermissions: Permission[]
): Promise<Role> => {
  const query = `
    INSERT INTO "Role" ("name", "pid")
    VALUES ($1, $2) RETURNING "rid";
  `;

  const res = await client.query(query, [name, projectId]);
  const rid = res.rows[0].rid;

  const permissionQuery = `
    INSERT INTO "RolePermissionMap" ("rid", "pid")
    VALUES ($1, $2);
  `;

  for (let i = 0; i < permissions.length; i++) {
    const permission = allPermissions.find((p) => p.name == permissions[i]);
    if (!permission) {
      throw new Error(`permission ${permissions[i]} not found`);
    }

    await client.query(permissionQuery, [rid, permission.pid]);
  }

  return { rid, name, pid: projectId };
};

export const assignRole = async (
  role: string,
  userId: number,
  allRoles: Role[]
) => {
  const roleObj = allRoles.find((r) => r.name == role);
  if (!roleObj) {
    throw new Error(`role ${role} not found`);
  }

  const query = `
    INSERT INTO "UserRoleMap" ("uid", "rid")
    VALUES ($1, $2);
  `;

  await client.query(query, [userId, roleObj.rid]);
};
