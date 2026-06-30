import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import nodemailer from 'nodemailer';

const sendEmailSchema = z.object({
  email: z.string().email(),
  consulta: z.string().min(50),
});

export const sendEmailFn = createServerFn({ method: 'POST' })
  .validator(sendEmailSchema)
  .handler(async ({ data }) => {
    const { email, consulta } = data;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"SIMLaR Consultas" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: 'Nueva consulta desde el formulario',
      text: `Email: ${email}\n\nConsulta:\n${consulta}`,
    });

    return { ok: true };
  });
