import "./util/dotenv";

import { client } from "./util";
import { faker } from "@faker-js/faker";
import { generateData } from "./gen";
import { logger } from "../src/util";

const main = async () => {
  // The seed is set manually to ensure that the same data is generated every
  // time the production data is generated. In particular, all non-id fields
  // are generated using faker, which is seeded here. Note that id fields are
  // not guaranteed to be consistent across runs, unless the database is reset
  // before each run using `npm run db:reset`.
  faker.seed(0);
  await client.connect();

  try {
    await client.query("BEGIN");
    await generateData();
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(`${err}`);
    throw err;
  }

  logger.info("successfully seeded database");
  await client.end();
};

main().catch((_) => {
  logger.error("failed to seed database");
  process.exit(1);
});
