import { count, projects } from "../constants";
import { generateBots, generateUsers } from "./user";

import { generatePermissions } from "./permission";
import { generateProject } from "./project";

export const generateData = async () => {
  const users = await generateUsers(count.GENERATED_USERS);
  const bots = await generateBots(count.GENERATED_BOTS);
  const permissions = await generatePermissions();

  for (const project of projects) {
    await generateProject(project, users, bots, permissions);
  }
};
