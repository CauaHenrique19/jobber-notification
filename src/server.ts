import "express-async-errors";
import http from "http";

import { winstonLogger } from "@CauaHenrique19/jobber-shared";
import { Application } from "express";
import { Channel } from "amqplib";

import { config } from "@notifications/config";
import { helthRoutes } from "@notifications/routes";
import { checkConnection } from "@notifications/elasticsearch";
import { createConnection } from "@notifications/queues/connection";
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from "@notifications/queues/email.consumer";

const SERVER_PORT = 4001;
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "notificationServer", "debug");

export function start(app: Application): void {
  startServer(app);
  app.use(helthRoutes);
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);

  await emailChannel.assertExchange("jobber-email-notification", "direct");

  // const verifyLink = `${config.CLIENT_URL}/confirm_email?v_token=123456789`;

  // const messageDetails: IEmailMessageDetails = {
  //   receiverEmail: `${config.SENDER_EMAIL}`,
  //   resetLink: verifyLink,
  //   username: "Manny",
  //   template: "forgotPassword",
  // };

  // const message = JSON.stringify(messageDetails);
  //emailChannel.publish("jobber-email-notification", "auth-email", Buffer.from(message));

  //await emailChannel.assertExchange("jobber-order-notification", "direct");
  // const message1 = JSON.stringify({ name: "jobber", service: "order notification service" });
  // emailChannel.publish("jobber-order-notification", "order-email", Buffer.from(message1));
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application) {
  try {
    const httpServer = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log("error", "NotificationService startServer() method:", error);
  }
}
