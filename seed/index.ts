import "./config/dotenv";

import { generateBots, generatePermissions, generateUsers } from "./gen";

import { client } from "./config";

const main = async () => {
  // The seed is set manually to ensure that the same data is generated every
  // time the production data is generated.
  // faker.seed(0);

  await client.connect();

  const users = await generateUsers(15);
  console.log(users);
  const bots = await generateBots(5);
  console.log(bots);

  const permissions = await generatePermissions();
  console.log(permissions);

  await client.end();
};

main().catch((err) => console.error(err));
