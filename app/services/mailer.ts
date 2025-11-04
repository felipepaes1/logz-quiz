import nodemailer, { Transporter } from "nodemailer";

type Booleanish = string | undefined | null;

function parseBoolean(value: Booleanish, fallback: boolean): boolean {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) return true;
  if (["false", "0", "no", "n"].includes(normalized)) return false;
  return fallback;
}

let cachedTransporter: Transporter | null = null;

function buildTransport() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT
    ? Number(process.env.SMTP_PORT)
    : undefined;
  const secure = parseBoolean(process.env.SMTP_SECURE, false);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) {
    throw new Error("SMTP_HOST environment variable is required");
  }

  if (!port || Number.isNaN(port)) {
    throw new Error("SMTP_PORT environment variable is required and must be a number");
  }

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS environment variables are required");
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
}

type AddressLike = string | string[];

export type SendMailOptions = {
  to: AddressLike;
  subject: string;
  html: string;
  cc?: AddressLike;
  bcc?: AddressLike;
  replyTo?: string;
  disableDefaultBcc?: boolean;
};

function resolveAddressList(address?: string | null): string[] | undefined {
  if (!address) {
    return undefined;
  }

  const items = address
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}

export async function sendMail(options: SendMailOptions) {
  const transporter = buildTransport();

  const defaultFrom =
    process.env.MAIL_FROM ||
    (process.env.SMTP_USER ? `Log Z <${process.env.SMTP_USER}>` : undefined);

  if (!defaultFrom) {
    throw new Error("MAIL_FROM or SMTP_USER environment variable is required to send email");
  }

  const defaultBcc = resolveAddressList(
    process.env.MAIL_TO ?? process.env.SMTP_BCC ?? undefined,
  );

  const finalBcc: AddressLike | undefined = options.disableDefaultBcc
    ? options.bcc
    : options.bcc ?? defaultBcc;

  const info = await transporter.sendMail({
    from: defaultFrom,
    to: options.to,
    subject: options.subject,
    html: options.html,
    cc: options.cc,
    bcc: finalBcc,
    replyTo: options.replyTo,
  });

  return info;
}
