import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}
const FROM = 'AUDICO S.A.S. <contacto@audicoiso.com>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'misamiopc@gmail.com'
const LOGO_URL = 'https://audicoiso.com/logoaudico.png'
const WHATSAPP_URL = 'https://wa.me/573161374657'
const PHONE = '+57 316 137 4657'

interface ClientData {
  name: string
  email: string
  phone?: string | null
  company?: string | null
  employees?: string | null
  sector?: string | null
  serviceInterest?: string | null
  message?: string | null
}

function clientEmailHtml(data: ClientData): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1B2A4A,#2563EB);padding:32px 40px;text-align:center;">
            <img src="${LOGO_URL}" alt="AUDICO S.A.S." width="140" style="display:block;margin:0 auto 16px;" />
            <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700;">¡Solicitud Recibida!</h1>
            <p style="color:#93c5fd;font-size:14px;margin:8px 0 0;">Auditoría y Consultoría Empresarial</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">
              Hola <strong>${data.name}</strong>,
            </p>
            <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px;">
              Hemos recibido tu solicitud exitosamente. Un consultor especializado de AUDICO se pondrá en contacto contigo en las próximas <strong>24 horas</strong> para agendar tu diagnóstico gratuito.
            </p>

            <!-- Summary Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:0 0 24px;">
              <tr><td style="padding:20px;">
                <p style="font-size:13px;color:#64748b;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;margin:0 0 12px;">Resumen de tu solicitud</p>
                ${data.company ? `<p style="font-size:14px;color:#334155;margin:4px 0;"><strong>Empresa:</strong> ${data.company}</p>` : ''}
                ${data.serviceInterest ? `<p style="font-size:14px;color:#334155;margin:4px 0;"><strong>Interés:</strong> ${data.serviceInterest}</p>` : ''}
                ${data.employees ? `<p style="font-size:14px;color:#334155;margin:4px 0;"><strong>Empleados:</strong> ${data.employees}</p>` : ''}
                ${data.sector ? `<p style="font-size:14px;color:#334155;margin:4px 0;"><strong>Sector:</strong> ${data.sector}</p>` : ''}
                ${data.message ? `<p style="font-size:14px;color:#334155;margin:4px 0;"><strong>Mensaje:</strong> ${data.message}</p>` : ''}
              </td></tr>
            </table>

            <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px;">
              Si deseas comunicarte con nosotros de inmediato, puedes hacerlo por WhatsApp:
            </p>

            <!-- WhatsApp Button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${WHATSAPP_URL}" target="_blank" style="display:inline-block;background:#25D366;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
                  📱 Escribir por WhatsApp
                </a>
              </td></tr>
            </table>

            <p style="font-size:13px;color:#94a3b8;text-align:center;margin:24px 0 0;">
              También puedes llamarnos al <a href="tel:${PHONE}" style="color:#2563eb;text-decoration:none;">${PHONE}</a>
              o escribirnos a <a href="mailto:contacto@audicoiso.com" style="color:#2563eb;text-decoration:none;">contacto@audicoiso.com</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0f172a;padding:24px 40px;text-align:center;">
            <p style="font-size:13px;color:#64748b;margin:0;">
              AUDICO S.A.S. — Cali, Valle del Cauca, Colombia
            </p>
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

function adminEmailHtml(data: ClientData): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1B2A4A;padding:24px 40px;">
            <h1 style="color:#f59e0b;font-size:18px;margin:0;">🔔 Nuevo Cliente Registrado</h1>
            <p style="color:#94a3b8;font-size:13px;margin:6px 0 0;">Formulario recibido desde audicoiso.com</p>
          </td>
        </tr>

        <!-- Client Info -->
        <tr>
          <td style="padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
              <tr style="background:#f8fafc;">
                <td style="padding:10px 16px;font-size:13px;color:#64748b;font-weight:700;width:140px;border-bottom:1px solid #e2e8f0;">Nombre</td>
                <td style="padding:10px 16px;font-size:14px;color:#1e293b;border-bottom:1px solid #e2e8f0;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-size:13px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Email</td>
                <td style="padding:10px 16px;font-size:14px;color:#1e293b;border-bottom:1px solid #e2e8f0;">
                  <a href="mailto:${data.email}" style="color:#2563eb;text-decoration:none;">${data.email}</a>
                </td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:10px 16px;font-size:13px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">WhatsApp</td>
                <td style="padding:10px 16px;font-size:14px;color:#1e293b;border-bottom:1px solid #e2e8f0;">
                  ${data.phone || '—'}
                </td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-size:13px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Empresa</td>
                <td style="padding:10px 16px;font-size:14px;color:#1e293b;border-bottom:1px solid #e2e8f0;">${data.company || '—'}</td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:10px 16px;font-size:13px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Empleados</td>
                <td style="padding:10px 16px;font-size:14px;color:#1e293b;border-bottom:1px solid #e2e8f0;">${data.employees || '—'}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-size:13px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Sector</td>
                <td style="padding:10px 16px;font-size:14px;color:#1e293b;border-bottom:1px solid #e2e8f0;">${data.sector || '—'}</td>
              </tr>
              <tr style="background:#f8fafc;">
                <td style="padding:10px 16px;font-size:13px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Certificación</td>
                <td style="padding:10px 16px;font-size:14px;color:#1e293b;font-weight:600;border-bottom:1px solid #e2e8f0;">${data.serviceInterest || '—'}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-size:13px;color:#64748b;font-weight:700;">Mensaje</td>
                <td style="padding:10px 16px;font-size:14px;color:#1e293b;">${data.message || '—'}</td>
              </tr>
            </table>

            <!-- Action Buttons -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td align="center" style="padding:0 4px;">
                  <a href="${WHATSAPP_URL}?text=Hola%20${encodeURIComponent(data.name)}%2C%20soy%20de%20AUDICO.%20Recibimos%20tu%20solicitud." target="_blank" style="display:inline-block;background:#25D366;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:6px;">
                    📱 WhatsApp al cliente
                  </a>
                </td>
                <td align="center" style="padding:0 4px;">
                  <a href="mailto:${data.email}" style="display:inline-block;background:#2563eb;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:6px;">
                    ✉️ Responder por email
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:16px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="font-size:12px;color:#94a3b8;margin:0;">Notificación automática — AUDICO CRM</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendClientConfirmation(data: ClientData) {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: 'RESEND_API_KEY no configurada' }
  try {
    await getResend().emails.send({
      from: FROM,
      to: data.email,
      subject: '¡Solicitud recibida! — AUDICO S.A.S.',
      html: clientEmailHtml(data),
    })
    return { sent: true }
  } catch (err: any) {
    console.error('Email cliente error:', err.message)
    return { sent: false, reason: err.message }
  }
}

export async function sendAdminNotification(data: ClientData) {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: 'RESEND_API_KEY no configurada' }
  try {
    await getResend().emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `Nuevo cliente: ${data.name} — ${data.company || 'Sin empresa'}`,
      html: adminEmailHtml(data),
    })
    return { sent: true }
  } catch (err: any) {
    console.error('Email admin error:', err.message)
    return { sent: false, reason: err.message }
  }
}
