import { SendMailClient } from 'zeptomail'

const ZEPTOMAIL_URL = 'https://api.zeptomail.eu/v1.1/email'

let _client: SendMailClient | null = null

export function getMailClient(): SendMailClient {
  if (!_client) {
    const token = process.env.ZEPTOMAIL_TOKEN
    if (!token) throw new Error('ZEPTOMAIL_TOKEN no configurado')
    _client = new SendMailClient({ url: ZEPTOMAIL_URL, token })
  }
  return _client
}

export const FROM = { address: 'contacto@audicoiso.com', name: 'AUDICO S.A.S.' }

interface SendOptions {
  to: string | string[]
  toName?: string
  subject: string
  htmlbody: string
}

export async function sendMail({ to, toName, subject, htmlbody }: SendOptions): Promise<{ sent: boolean; reason?: string }> {
  try {
    const recipients = Array.isArray(to) ? to : [to]
    await getMailClient().sendMail({
      from: FROM,
      to: recipients.map(address => ({
        email_address: { address, name: toName || address },
      })),
      subject,
      htmlbody,
    })
    return { sent: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[ZeptoMail] error:', msg)
    return { sent: false, reason: msg }
  }
}
