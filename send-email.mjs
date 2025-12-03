import fs from "fs/promises";
import nodemailer from "nodemailer";

async function loadMessages() {
  const data = await fs.readFile(new URL("./messages.json", import.meta.url));
  return JSON.parse(data.toString());
}

function todayDate() {
  // Allow override for testing
  if (process.env.TEST_DATE) {
    const testDate = process.env.TEST_DATE.trim();
    if (testDate && /^\d{4}-\d{2}-\d{2}$/.test(testDate)) {
      console.log(`Using test date: ${testDate}`);
      return testDate;
    }
  }
  
  // Allow override from multiple days workflow
  if (process.env.TEST_DATE_OVERRIDE === "true") {
    const args = process.argv.slice(2);
    for (let arg of args) {
      if (arg.includes('TEST_DATE=')) {
        const testDate = arg.split('=')[1];
        if (testDate && /^\d{4}-\d{2}-\d{2}$/.test(testDate)) {
          console.log(`Using workflow override date: ${testDate}`);
          return testDate;
        }
      }
    }
  }
  
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
    DRY_RUN,
  } = process.env;

  const isDryRun = DRY_RUN === "true" || 
                   process.argv.includes("--dry-run") ||
                   process.argv.some(arg => arg.includes('DRY_RUN=true'));

  if (!FRIEND_EMAIL || !FROM_EMAIL) {
    console.error("Missing email configuration (FRIEND_EMAIL, FROM_EMAIL required).");
    process.exit(1);
  }

  if (!isDryRun && (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS)) {
    console.error("Missing SMTP configuration for sending email.");
    process.exit(1);
  }

  const secure = SMTP_SECURE === "true";

  let transporter;
  if (!isDryRun) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

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

  if (isDryRun) {
    console.log(`DRY RUN - Would send email for ${today}:`);
    console.log(`From: ${mailOptions.from}`);
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Body:\n${mailOptions.text}`);
    console.log(`\nDry run complete - no email was actually sent.`);
  } else {
    await transporter.sendMail(mailOptions);
    console.log(`Sent advent email for ${today} to ${FRIEND_EMAIL}.`);
  }
}

main().catch((err) => {
  console.error("Error sending email:", err);
  process.exit(1);
});
