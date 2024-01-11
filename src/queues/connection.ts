import client, { Channel, Connection } from "amqplib";

import { winstonLogger } from "@CauaHenrique19/jobber-shared";

import { config } from "@notifications/config";

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "notificationQueueConnection", "debug");

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel = await connection.createChannel();
    log.info("Notification server connected to queue successfully...");
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log("error", "NotificationService createConnection() method:", error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once("SIGINT", async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection };
