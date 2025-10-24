import nodemailer from 'nodemailer'

export function getTransport(){
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if(!host || !user || !pass){
    return null
  }
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } })
}

export async function sendMail(to: string|string[], subject: string, html: string){
  const transport = getTransport()
  if(!transport){
    return { queued: false, reason: 'SMTP no configurado' }
  }
  const from = process.env.SMTP_FROM || 'no-reply@example.com'
  await transport.sendMail({ from, to, subject, html })
  return { queued: true }
}

