import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const FROM = 'AUDICO S.A.S. <contacto@audicoiso.com>'
const LOGO_URL = 'https://audicoiso.com/logoaudico.png'
const LOGIN_URL = 'https://audicoiso.com/crm/login'

interface AccountEmailData {
  to: string
  nombre: string
  tempPassword: string
}

function accountCreatedHtml({ nombre, tempPassword }: AccountEmailData): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1B2A4A,#2563EB);padding:32px 40px;text-align:center;">
            <img src="${LOGO_URL}" alt="AUDICO S.A.S." width="140" style="display:block;margin:0 auto 16px;" />
            <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700;">Bienvenido al CRM AUDICO</h1>
            <p style="color:#93c5fd;font-size:14px;margin:8px 0 0;">Tu cuenta ha sido creada</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">
              Hola <strong>${nombre}</strong>,
            </p>
            <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px;">
              Se ha creado una cuenta para ti en el CRM de AUDICO ISO. A continuación encontrarás tus credenciales de acceso:
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border:2px solid #bfdbfe;border-radius:8px;margin:0 0 24px;">
              <tr><td style="padding:20px;">
                <p style="font-size:13px;color:#1e40af;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;margin:0 0 12px;">Tus credenciales</p>
                <p style="font-size:14px;color:#334155;margin:4px 0;"><strong>Correo:</strong> ${nombre}</p>
                <p style="font-size:14px;color:#334155;margin:4px 0;"><strong>Contraseña temporal:</strong>
                  <span style="font-family:monospace;background:#dbeafe;padding:2px 8px;border-radius:4px;font-size:16px;font-weight:700;color:#1e40af;">${tempPassword}</span>
                </p>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;margin:0 0 24px;">
              <tr><td style="padding:16px 20px;">
                <p style="font-size:14px;color:#92400e;margin:0;line-height:1.5;">
                  <strong>Importante:</strong> Al iniciar sesión por primera vez, se te pedirá que cambies tu contraseña por una personal y segura.
                </p>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${LOGIN_URL}" target="_blank" style="display:inline-block;background:#2563eb;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
                  Iniciar sesión en el CRM
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#0f172a;padding:24px 40px;text-align:center;">
            <p style="font-size:13px;color:#64748b;margin:0;">AUDICO S.A.S. — Cali, Valle del Cauca, Colombia</p>
            <p style="font-size:12px;color:#475569;margin:8px 0 0;">
              <a href="https://audicoiso.com" style="color:#60a5fa;text-decoration:none;">audicoiso.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendAccountCreatedEmail(data: AccountEmailData) {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: 'RESEND_API_KEY no configurada' }
  try {
    await getResend().emails.send({
      from: FROM,
      to: data.to,
      subject: 'Tu cuenta en AUDICO CRM ha sido creada',
      html: accountCreatedHtml(data),
    })
    return { sent: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('Email account created error:', msg)
    return { sent: false, reason: msg }
  }
}
