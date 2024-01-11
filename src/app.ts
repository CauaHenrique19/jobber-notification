import { winstonLogger } from "@CauaHenrique19/jobber-shared";
import express from "express";

import { config } from "@notifications/config";
import { start } from "@notifications/server";

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "notificationApp", "debug");

function initialize(): void {
  const app = express();
  start(app);
  log.info("Notification Service Initialized");
}

initialize();
