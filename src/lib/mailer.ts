import nodemailer from "nodemailer";

const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT;
const USER = process.env.SMTP_USER;
const PASSWORD = process.env.SMTP_PASSWORD;
const FROM = process.env.SMTP_FROM;
const TO = process.env.CONTACT_TO_EMAIL;

let transporter: nodemailer.Transporter | null = null;

export function isMailerConfigured() {
  return Boolean(HOST && PORT && USER && PASSWORD && FROM && TO);
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: HOST,
      port: Number(PORT),
      secure: Number(PORT) === 465,
      auth: { user: USER, pass: PASSWORD },
    });
  }
  return transporter;
}

export async function sendContactMessage({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  // No SMTP credentials in this environment (e.g. local dev) — log instead of
  // failing, so the contact form can still be exercised end to end.
  if (!isMailerConfigured()) {
    console.warn("[mailer] SMTP not configured — logging contact message instead of sending", {
      name,
      email,
      subject,
      message,
    });
    return;
  }

  await getTransporter().sendMail({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `[Contact] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
}
