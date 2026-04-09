import { NextRequest, NextResponse } from 'next/server'
import { sanityRead } from '@/lib/sanity.server'
import { sendMail } from '@/lib/zeptomail'
import groq from 'groq'

const ADMIN_EMAIL = 'contacto@audicoiso.com'
const LOGO_URL = 'https://audicoiso.com/logoaudico.png'
const WHATSAPP_URL = 'https://wa.me/+573180066892'

// Colombia is UTC-5 year-round (no DST)
function getTomorrowColombia(): string {
  const now = new Date()
  const colombiaOffset = -5 * 60 // minutes
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000
  const colombiaMs = utcMs + colombiaOffset * 60_000
  const colombia = new Date(colombiaMs)
  colombia.setDate(colombia.getDate() + 1)
  return colombia.toISOString().split('T')[0] // YYYY-MM-DD
}

const diagnosticosTomorrowQuery = groq`
  *[_type == "crmDiagnostico"
    && fechaVisita == $tomorrow
    && estado != "Cancelado"
  ] {
    _id,
    codigo,
    clienteNombre,
    fechaVisita,
    normas,
    consultorAsignado,
    cliente->{ _id, nombreComercial, razonSocial, nombreContacto, email, telefono }
  }
`

function clienteReminderHtml(d: {
  codigo: string
  clienteNombre: string
  fechaVisita: string
  normas: string[]
  consultorAsignado: string
  cliente?: { nombreComercial?: string; nombreContacto?: string; email?: string }
}): string {
  const nombre = d.cliente?.nombreContacto || d.clienteNombre
  const empresa = d.cliente?.nombreComercial || d.clienteNombre
  const normasList = (d.normas || []).map(n =>
    `<li style="margin:4px 0;color:#334155;">${n}</li>`
  ).join('')

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
            <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700;">Recordatorio de Visita</h1>
            <p style="color:#93c5fd;font-size:14px;margin:8px 0 0;">Tu sesión con AUDICO es mañana</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">
              Hola <strong>${nombre}</strong>,
            </p>
            <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px;">
              Te recordamos que mañana tienes programada tu sesión de diagnóstico con nuestro equipo en <strong>AUDICO S.A.S.</strong>
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border:2px solid #bfdbfe;border-radius:8px;margin:0 0 24px;">
              <tr><td style="padding:20px;">
                <p style="font-size:13px;color:#1e40af;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;margin:0 0 12px;">Detalles de la sesión</p>
                <p style="font-size:14px;color:#334155;margin:4px 0;"><strong>Empresa:</strong> ${empresa}</p>
                <p style="font-size:14px;color:#334155;margin:4px 0;"><strong>Código:</strong> <span style="font-family:monospace;">${d.codigo}</span></p>
                <p style="font-size:14px;color:#334155;margin:4px 0;"><strong>Fecha:</strong> ${d.fechaVisita}</p>
                <p style="font-size:14px;color:#334155;margin:4px 0;"><strong>Consultor:</strong> ${d.consultorAsignado || 'AUDICO'}</p>
                ${normasList ? `
                <p style="font-size:14px;color:#334155;margin:12px 0 4px;"><strong>Normas a tratar:</strong></p>
                <ul style="margin:0;padding-left:20px;">${normasList}</ul>
                ` : ''}
              </td></tr>
            </table>

            <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px;">
              Si tienes alguna duda o necesitas reprogramar, contáctanos por WhatsApp:
            </p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${WHATSAPP_URL}" target="_blank" style="display:inline-block;background:#25D366;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
                  📱 Escribir por WhatsApp
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

function adminReminderHtml(diagnosticos: Array<{
  codigo: string
  clienteNombre: string
  fechaVisita: string
  normas: string[]
  consultorAsignado: string
  cliente?: { nombreComercial?: string; nombreContacto?: string; email?: string; telefono?: string }
}>): string {
  const rows = diagnosticos.map(d => {
    const empresa = d.cliente?.nombreComercial || d.clienteNombre
    const contacto = d.cliente?.nombreContacto || '—'
    const email = d.cliente?.email || '—'
    const telefono = d.cliente?.telefono || '—'
    return `
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:12px 16px;font-size:13px;font-family:monospace;color:#1e293b;">${d.codigo}</td>
        <td style="padding:12px 16px;font-size:13px;color:#1e293b;font-weight:600;">${empresa}</td>
        <td style="padding:12px 16px;font-size:13px;color:#475569;">${contacto}</td>
        <td style="padding:12px 16px;font-size:13px;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td>
        <td style="padding:12px 16px;font-size:13px;color:#475569;">${telefono}</td>
        <td style="padding:12px 16px;font-size:13px;color:#475569;">${d.consultorAsignado || '—'}</td>
        <td style="padding:12px 16px;font-size:12px;color:#64748b;">${(d.normas || []).join(', ')}</td>
      </tr>
    `
  }).join('')

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#1B2A4A;padding:24px 40px;">
            <h1 style="color:#f59e0b;font-size:18px;margin:0;">🗓️ Visitas programadas para mañana</h1>
            <p style="color:#94a3b8;font-size:13px;margin:6px 0 0;">${diagnosticos.length} diagnóstico${diagnosticos.length !== 1 ? 's' : ''} — ${diagnosticos[0]?.fechaVisita ?? ''}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:10px 16px;font-size:12px;color:#64748b;text-align:left;font-weight:700;">Código</th>
                  <th style="padding:10px 16px;font-size:12px;color:#64748b;text-align:left;font-weight:700;">Empresa</th>
                  <th style="padding:10px 16px;font-size:12px;color:#64748b;text-align:left;font-weight:700;">Contacto</th>
                  <th style="padding:10px 16px;font-size:12px;color:#64748b;text-align:left;font-weight:700;">Email</th>
                  <th style="padding:10px 16px;font-size:12px;color:#64748b;text-align:left;font-weight:700;">Teléfono</th>
                  <th style="padding:10px 16px;font-size:12px;color:#64748b;text-align:left;font-weight:700;">Consultor</th>
                  <th style="padding:10px 16px;font-size:12px;color:#64748b;text-align:left;font-weight:700;">Normas</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 40px;text-align:center;">
            <p style="font-size:12px;color:#94a3b8;margin:0;">Notificación automática — AUDICO CRM</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tomorrow = getTomorrowColombia()
    const diagnosticos = await sanityRead().fetch(diagnosticosTomorrowQuery, { tomorrow })

    if (!diagnosticos || diagnosticos.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, message: `No hay visitas para ${tomorrow}` })
    }

    const results: { codigo: string; clienteSent: boolean; adminSent: boolean }[] = []

    for (const d of diagnosticos) {
      const clienteEmail = d.cliente?.email
      let clienteSent = false

      // Send to client if they have an email
      if (clienteEmail) {
        const result = await sendMail({
          to: clienteEmail,
          toName: d.cliente?.nombreContacto || d.clienteNombre,
          subject: `Recordatorio: tu sesión AUDICO es mañana — ${d.codigo}`,
          htmlbody: clienteReminderHtml(d),
        })
        clienteSent = result.sent
      }

      results.push({ codigo: d.codigo, clienteSent, adminSent: false })
    }

    // Send one consolidated email to admin with all visits
    const adminResult = await sendMail({
      to: ADMIN_EMAIL,
      toName: 'AUDICO Admin',
      subject: `🗓️ ${diagnosticos.length} visita${diagnosticos.length !== 1 ? 's' : ''} programada${diagnosticos.length !== 1 ? 's' : ''} para mañana ${tomorrow}`,
      htmlbody: adminReminderHtml(diagnosticos),
    })

    results.forEach(r => { r.adminSent = adminResult.sent })

    console.log(`[cron/recordatorios] ${tomorrow}: ${diagnosticos.length} diagnósticos, admin sent: ${adminResult.sent}`)
    return NextResponse.json({ ok: true, tomorrow, sent: diagnosticos.length, results })
  } catch (err) {
    console.error('[cron/recordatorios] error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
