import nodemailer from "nodemailer";
import { dbConection } from "../config/db.js";

let cachedTransporter = null;

const getMailTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  const sequelize = await dbConection();

  try {
    const [rows] = await sequelize.query(
      `SELECT TOP 1 * FROM MailSetting WHERE IsActive = 1`
    );

    if (!rows.length) {
      throw new Error("No active MailSetting found");
    }

    const setting = rows[0];

    cachedTransporter = nodemailer.createTransport({
      host: setting.MailServer,
      port: 587,
      secure: false,
      tls: { rejectUnauthorized: false },
      auth: {
        user: setting.Email,
        pass: setting.Password,
      },
    });

    cachedTransporter.fromAddress = {
      email: setting.Email,
      name: setting.ServerName || "",
    };

    return cachedTransporter;
  } finally {
    await sequelize.close();
  }
};

export const sendBulkEmails = async (recipients, subject, html) => {
  const transporter = await getMailTransporter();

  console.log("transport => ", transporter );
  

  for (const recipient of recipients) {
    try {
      await transporter.sendMail({
        from: `"${transporter.fromAddress.name}" <${transporter.fromAddress.email}>`,
        to: recipient.email,
        subject,
        html,
      });

      console.log(`Email sent to ${recipient.email}`);
    } catch (err) {
      console.error(`Error sending email to ${recipient.email}:`, err.message);
    }
  }
};
