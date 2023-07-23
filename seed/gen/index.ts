import { generateBots, generateUsers } from "./user";

import { count } from "../constants";
import { generatePermissions } from "./permission";

export const generateData = async () => {
  // await generateUsers(count.GENERATED_USERS);
  // await generateBots(count.GENERATED_BOTS);
  await generatePermissions();
};
