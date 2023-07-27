import cron from "node-cron";
import { handleAlerts } from "./handleAlerts";
import { logger } from "../util";

export const cronJob = () => {
  logger.info("starting cron job");
  cron.schedule("* * * * *", () => {
    logger.info("running cron job");
    handleAlerts();
  });
};
