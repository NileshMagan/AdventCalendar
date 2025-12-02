import fs from "fs/promises";
import nodemailer from "nodemailer";

async function loadMessages() {
  const data = await fs.readFile(new URL("./messages.json", import.meta.url));
  return JSON.parse(data.toString());
}

function todayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function main() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
    FRIEND_EMAIL,
    FROM_EMAIL,
    FROM_NAME,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FRIEND_EMAIL || !FROM_EMAIL) {
    console.error("Missing one or more required environment variables.");
    process.exit(1);
  }

  const secure = SMTP_SECURE === "true";

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const messages = await loadMessages();
  const today = todayDate();
  const msg = messages.find((m) => m.date === today);

  if (!msg) {
    console.log(`No message configured for today (${today}).`);
    return;
  }

  const fromName = FROM_NAME || "Advent Calendar";
  const mailOptions = {
    from: `${fromName} <${FROM_EMAIL}>`,
    to: FRIEND_EMAIL,
    subject: msg.subject,
    text: msg.body,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Sent advent email for ${today} to ${FRIEND_EMAIL}.`);
}

main().catch((err) => {
  console.error("Error sending email:", err);
  process.exit(1);
});
