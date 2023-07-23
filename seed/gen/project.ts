import { Role, RoleConfig, assignRole, generateRole } from "./role";
import { client, sample } from "../util";

import { Permission } from "./permission";
import { User } from "./user";
import { faker } from "@faker-js/faker";
import { logger } from "../../src/util";

export type ProjectConfig = {
  name: string;
  roles: RoleConfig[];
  users: {
    roles: string[];
  }[];
  bots: {
    roles: string[];
  }[];
};

const assignUserToken = async (uid: number, pid: number) => {
  const query = `
    INSERT INTO "UserProjectToken" ("token", "uid", "pid")
    VALUES ($1, $2, $3);
  `;

  const token = faker.string.alphanumeric(32);

  await client.query(query, [token, uid, pid]);
};

export const generateProject = async (
  { name, roles, users, bots }: ProjectConfig,
  allUsers: User[],
  allBots: User[],
  allPermissions: Permission[]
) => {
  const query = `
    INSERT INTO "Project" ("name", "dbUrl", "createdAt", "createdById")
    VALUES ($1, $2, $3, $4) RETURNING "pid";
  `;

  const dbUrl = faker.internet.url();
  const createdAt = faker.date.between({
    from: "2023-02-01",
    to: "2023-02-31",
  });

  if (users.length == 0) {
    throw new Error("project must have at least one user");
  }

  if (bots.length == 0) {
    throw new Error("project must have at least one bot");
  }

  const selectedUsers = sample(allUsers, users.length);
  const selectedBots = sample(allBots, bots.length);

  const res = await client.query(query, [
    name,
    dbUrl,
    createdAt,
    selectedUsers[0].uid,
  ]);
  const pid = res.rows[0].pid;

  const createdRoles: Role[] = [];
  for (let i = 0; i < roles.length; ++i) {
    createdRoles.push(await generateRole(roles[i], pid, allPermissions));
  }

  logger.info(`generated ${roles.length} roles for project ${name}`);

  for (let i = 0; i < users.length; ++i) {
    await assignUserToken(selectedUsers[i].uid, pid);
    for (let j = 0; j < users[i].roles.length; ++j) {
      await assignRole(users[i].roles[j], selectedUsers[i].uid, createdRoles);
    }
  }

  for (let i = 0; i < bots.length; ++i) {
    await assignUserToken(selectedBots[i].uid, pid);
    for (let j = 0; j < bots[i].roles.length; ++j) {
      await assignRole(bots[i].roles[j], selectedBots[i].uid, createdRoles);
    }
  }

  logger.info(`generated project ${name} with pid ${pid}`);
};
