import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

const smtpConfigurado = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

const transporter = smtpConfigurado
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: SMTP_SECURE === 'true',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

/**
 * Envia um e-mail. Se o SMTP nao estiver configurado (ambiente de dev),
 * apenas loga no console em vez de falhar o job.
 */
export async function enviarEmail({ to, subject, html }) {
  if (!transporter) {
    console.log(`[notification-service] SMTP nao configurado — e-mail simulado para ${to}: "${subject}"`);
    return { simulado: true };
  }

  return transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to,
    subject,
    html,
  });
}
