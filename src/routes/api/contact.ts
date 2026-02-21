import { createFileRoute } from '@tanstack/react-router'
import nodemailer from 'nodemailer'

export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null)
        const email = String(body?.email ?? '').trim()
        const consulta = String(body?.consulta ?? '').trim()

        if (!email || !email.includes('@')) {
          return Response.json({ error: 'Email inválido' }, { status: 400 })
        }
        if (consulta.length < 50) {
          return Response.json({ error: 'Consulta muy corta' }, { status: 400 })
        }

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })

        await transporter.sendMail({
          from: `"SIMLaR Consultas" <${process.env.SMTP_USER}>`,
          to: process.env.MAIL_TO,
          replyTo: email,
          subject: 'Nueva consulta desde el formulario',
          text: `Email: ${email}\n\nConsulta:\n${consulta}`,
        })

        return Response.json({ ok: true })
      },
    },
  },
})