import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

export async function sendContactNotification(message) {
  const tx = getTransporter();
  if (!tx) {
    console.log(`[contact] New message from ${message.email} (email notifications disabled)`);
    return;
  }

  const to = process.env.CONTACT_RECEIVER || process.env.ADMIN_EMAIL;
  await tx.sendMail({
    from: `"Portfolio" <${process.env.SMTP_USER}>`,
    to,
    replyTo: message.email,
    subject: `New portfolio message: ${message.subject || '(no subject)'}`,
    text: `From: ${message.name} <${message.email}>\n\n${message.message}`,
  });
}
