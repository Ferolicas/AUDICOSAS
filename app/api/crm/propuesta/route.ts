import { NextRequest } from 'next/server'
import { sanityRead, sanityWrite } from '@/lib/sanity.server'
import { sendMail } from '@/lib/zeptomail'
import { jsonOk, jsonError } from '@/lib/crm/api-helpers'
import groq from 'groq'

const diagnosticoPropuestaQuery = groq`*[_type == "crmDiagnostico" && _id == $id][0]{
  _id, codigo, clienteNombre, normas, fechaVisita, viabilidad,
  tiempoEstimado, inversionEstimada, resumenEjecutivo,
  cliente->{ _id, nombreComercial, razonSocial, nombreContacto, email }
}`

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

function buildPropuestaHtml(d: {
  codigo: string
  clienteNombre: string
  normas: string[]
  fechaVisita?: string
  viabilidad?: string
  tiempoEstimado?: number
  inversionEstimada?: number
  resumenEjecutivo?: string
  cliente?: { nombreComercial?: string; nombreContacto?: string; razonSocial?: string }
}): string {
  const normasList = (d.normas || []).map(n => `<li style="margin:4px 0;color:#334155;">${n}</li>`).join('')
  const inversion = d.inversionEstimada ? formatCOP(d.inversionEstimada) : 'A convenir'
  const tiempo = d.tiempoEstimado ? `${d.tiempoEstimado} meses` : 'A definir'
  const contacto = d.cliente?.nombreContacto || d.clienteNombre || ''
  const empresa = d.cliente?.nombreComercial || d.cliente?.razonSocial || d.clienteNombre || ''

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Propuesta Comercial AUDICO</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:32px 40px;text-align:center;">
              <img src="https://audicoiso.com/logoaudico.png" alt="AUDICO" height="50" style="max-height:50px;display:inline-block;" />
              <p style="color:#94a3b8;margin:12px 0 0;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Propuesta Comercial</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#64748b;font-size:14px;margin:0 0 8px;">Estimado/a,</p>
              <h2 style="color:#0f172a;font-size:20px;margin:0 0 4px;font-weight:700;">${contacto}</h2>
              <p style="color:#64748b;font-size:13px;margin:0 0 32px;">${empresa}</p>

              <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Gracias por confiar en <strong>AUDICO S.A.S.</strong> para acompanarte en tu proceso de implementacion y certificacion de sistemas de gestion. A continuacion encontraras el resumen de nuestra propuesta.
              </p>

              <!-- Info boxes -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="50%" style="padding-right:8px;vertical-align:top;">
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;">
                      <p style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px;">Codigo</p>
                      <p style="color:#1e293b;font-size:15px;font-weight:600;margin:0;font-family:monospace;">${d.codigo}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left:8px;vertical-align:top;">
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;">
                      <p style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px;">Viabilidad</p>
                      <p style="color:#1e293b;font-size:15px;font-weight:600;margin:0;">${d.viabilidad || 'Alta'}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Normas -->
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin-bottom:24px;">
                <p style="color:#1d4ed8;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px;">Normas de Interes</p>
                <ul style="margin:0;padding-left:20px;">${normasList}</ul>
              </div>

              <!-- Investment -->
              <div style="background:#0f172a;border-radius:10px;padding:24px;margin-bottom:24px;text-align:center;">
                <p style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Inversion Estimada</p>
                <p style="color:#60a5fa;font-size:28px;font-weight:800;margin:0;">${inversion}</p>
                <p style="color:#64748b;font-size:13px;margin:8px 0 0;">Tiempo estimado: <strong style="color:#94a3b8;">${tiempo}</strong></p>
              </div>

              ${d.resumenEjecutivo ? `
              <!-- Summary -->
              <div style="border-left:3px solid #3b82f6;padding:16px 20px;background:#f8fafc;border-radius:0 8px 8px 0;margin-bottom:28px;">
                <p style="color:#1e40af;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;margin:0 0 8px;">Resumen Ejecutivo</p>
                <p style="color:#475569;font-size:14px;line-height:1.6;margin:0;">${d.resumenEjecutivo.replace(/\n/g, '<br/>')}</p>
              </div>
              ` : ''}

              <!-- CTA -->
              <div style="text-align:center;margin-top:32px;">
                <a href="mailto:audicoempresarial@gmail.com" style="display:inline-block;background:#2563eb;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">
                  Contactar a AUDICO
                </a>
                <p style="color:#94a3b8;font-size:12px;margin:16px 0 0;">O llamanos al +57 316 137 4657</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">AUDICO S.A.S. &bull; audicoiso.com &bull; Cali, Colombia</p>
              <p style="color:#cbd5e1;font-size:11px;margin:4px 0 0;">Esta propuesta es valida por 30 dias a partir de su emision.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { diagnosticoId, email, saveEmail } = body

    if (!diagnosticoId || typeof diagnosticoId !== 'string') {
      return jsonError('diagnosticoId requerido')
    }
    if (!email || typeof email !== 'string') {
      return jsonError('email requerido')
    }

    // 1. Fetch diagnostic
    const diagnostico = await sanityRead().fetch(diagnosticoPropuestaQuery, { id: diagnosticoId })
    if (!diagnostico) return jsonError('Diagnostico no encontrado', 404)

    // 2. Update client email if requested
    if (saveEmail === true && diagnostico.cliente?._id) {
      try {
        await sanityWrite().patch(diagnostico.cliente._id).set({ email }).commit()
      } catch (err) {
        console.error('[propuesta] error updating client email:', err)
      }
    }

    // 3. Send email
    const htmlbody = buildPropuestaHtml(diagnostico)
    const result = await sendMail({
      to: email,
      toName: diagnostico.cliente?.nombreContacto || diagnostico.clienteNombre,
      subject: `Propuesta Comercial AUDICO — ${diagnostico.clienteNombre}`,
      htmlbody,
    })

    if (!result.sent) {
      return jsonError(`Error al enviar el correo: ${result.reason}`, 500)
    }

    return jsonOk({ ok: true, sent: true })
  } catch (err) {
    console.error('[propuesta] error:', err)
    return jsonError('Error interno al enviar propuesta', 500)
  }
}
