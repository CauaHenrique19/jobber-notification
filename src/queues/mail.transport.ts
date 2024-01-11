import { IEmailLocals, winstonLogger } from "@CauaHenrique19/jobber-shared";

import { config } from "@notifications/config";
import { emailTemplates } from "@notifications/helpers";

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "mailTransport", "debug");

async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
  try {
    await emailTemplates(template, receiverEmail, locals);
    log.info("Email sent successfully.");
  } catch (error) {
    log.log("error", "NotificationService MailTransport sendEmail() method error:", error);
  }
}

export { sendEmail };
