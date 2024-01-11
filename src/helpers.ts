import { IEmailLocals, winstonLogger } from "@CauaHenrique19/jobber-shared";
import nodemailer from "nodemailer";
import Email from "email-templates";
import path from "path";

import { config } from "@notifications/config";

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "mailTransportHelper", "debug");

async function emailTemplates(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
  try {
    const smtpTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });

    const email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport: smtpTransporter,
      views: {
        options: {
          extension: "ejs",
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, "../build"),
        },
      },
    });

    await email.send({
      template: path.join(__dirname, "..", "src/emails", template),
      message: {
        to: receiver,
      },
      locals,
    });
  } catch (error) {
    log.error(error);
  }
}

export { emailTemplates };
