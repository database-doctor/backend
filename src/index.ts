import "./dotenv";

import { app, port } from "./app";

import { cronJob } from "./alerting";
import { logger } from "./util";

app.listen(port, () => {
  logger.info(`server running on port ${port}`);
  cronJob();
});
