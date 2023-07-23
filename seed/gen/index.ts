import { generateBots, generateUsers } from "./user";

import { count } from "../constants";
import { generatePermissions } from "./permission";

export const generateData = async () => {
  const users = await generateUsers(count.GENERATED_USERS);
  const bots = await generateBots(count.GENERATED_BOTS);
  const permissions = await generatePermissions();
};
