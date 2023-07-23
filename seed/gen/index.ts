import { THEATRE_PROJECT, count } from "../constants";
import { generateBots, generateUsers } from "./user";

import { generatePermissions } from "./permission";
import { generateProject } from "./project";

export const generateData = async () => {
  const users = await generateUsers(count.GENERATED_USERS);
  const bots = await generateBots(count.GENERATED_BOTS);
  const permissions = await generatePermissions();
  await generateProject(THEATRE_PROJECT, users, bots, permissions);
};
