import { NextResponse } from 'next/server'
import { sanityRead } from '@/lib/sanity.server'
import { certificacionByIdQuery } from '@/lib/crm/queries'
import groq from 'groq'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { readFileSync } from 'fs'
import path from 'path'

const gapByCertQuery = groq`*[_type == "crmGapAnalysis" && certId == $certId][0]`

interface GapClause {
  clauseId: string
  estado: string
  porcentaje: number
}

function sectionPct(clauses: GapClause[], sectionNum: string): number {
  const valid = clauses.filter(c => {
    const prefix = c.clauseId === sectionNum || c.clauseId.startsWith(sectionNum + '.')
    return prefix && c.estado !== 'N/A' && c.porcentaje !== -1
  })
  if (!valid.length) return 0
  return Math.round(valid.reduce((sum, c) => sum + c.porcentaje, 0) / valid.length)
}

function countNoCumple(clauses: GapClause[], sections: string[]): number {
  return clauses.filter(c =>
    sections.some(s => c.clauseId === s || c.clauseId.startsWith(s + '.')) &&
    c.estado === 'No Cumple'
  ).length
}

export async function GET(_req: Request, { params }: { params: Promise<{ certId: string }> }) {
  const { certId } = await params

  const client = sanityRead()
  const [cert, gap] = await Promise.all([
    client.fetch<Record<string, unknown>>(certificacionByIdQuery, { id: certId }),
    client.fetch<{ cumplimientoTotal?: number; clauses?: GapClause[] }>(gapByCertQuery, { certId }),
  ])

  if (!cert) return NextResponse.json({ error: 'Certificación no encontrada' }, { status: 404 })

  const clauses: GapClause[] = (gap?.clauses ?? []) as GapClause[]

  const now = new Date()
  const mesAno = now.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
  const mesAnoFmt = mesAno.charAt(0).toUpperCase() + mesAno.slice(1)

  // [UNA_SEMANA]: mes en que cae la fecha actual + 7 días
  const unaSemanaDate = new Date(now)
  unaSemanaDate.setDate(unaSemanaDate.getDate() + 7)
  const monthName = (d: Date) => {
    const m = d.toLocaleDateString('es-CO', { month: 'long' })
    return m.charAt(0).toUpperCase() + m.slice(1)
  }
  const unaSemana = monthName(unaSemanaDate)

  // [SEIS_MESES]: 6 meses después de la fecha de [UNA_SEMANA]
  const seisMesesDate = new Date(unaSemanaDate)
  seisMesesDate.setMonth(seisMesesDate.getMonth() + 6)
  const seisMeses = monthName(seisMesesDate)

  const anio = String(now.getFullYear())

  const cumplGlobal = Math.round((gap?.cumplimientoTotal ?? 0) * 10) / 10
  const restanteTotal = Math.round((100 - cumplGlobal) * 10) / 10
  const noCumpleTotal = clauses.filter(c => c.estado === 'No Cumple').length
  const cumpleParcialTotal = clauses.filter(c => c.estado === 'Cumple Parcial').length
  const valorProyecto = cert.valorProyecto
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(cert.valorProyecto as number)
    : ''

  const clause81 = clauses.find(c => c.clauseId === '8.1')
  const fase8uno = clause81 && clause81.estado !== 'N/A' ? clause81.porcentaje : sectionPct(clauses, '8.1')

  const variables: Record<string, string> = {
    NOMBRE_EMPRESA: String(cert.clienteNombre ?? ''),
    MES_ANO: mesAnoFmt,
    AÑO: anio,
    CUMPLIMIENTO_GLOBAL: `${cumplGlobal}%`,
    RESTANTE_TOTAL: `${restanteTotal}%`,
    NUMERO_NO_CUMPLE: String(noCumpleTotal),
    NUMERO_CUMPLE_PARCIAL: String(cumpleParcialTotal),
    VALOR_PROYECTO: valorProyecto,
    FASE_4: `${sectionPct(clauses, '4')}%`,
    FASE_5: `${sectionPct(clauses, '5')}%`,
    FASE_6: `${sectionPct(clauses, '6')}%`,
    FASE_7: `${sectionPct(clauses, '7')}%`,
    FASE_8: `${sectionPct(clauses, '8')}%`,
    FASE_9: `${sectionPct(clauses, '9')}%`,
    FASE_10: `${sectionPct(clauses, '10')}%`,
    FASE_8_UNO: `${fase8uno}%`,
    RECUENTO_4_5_6_7: String(countNoCumple(clauses, ['4', '5', '6', '7'])),
    UNA_SEMANA: unaSemana,
    SEIS_MESES: seisMeses,
    DIA_MAX: (() => { const d = new Date(now); d.setDate(d.getDate() + 30); return String(d.getDate()) })(),
    MES_MAX: (() => { const d = new Date(now); d.setDate(d.getDate() + 30); return monthName(d) })(),
  }

  const templatePath = path.join(process.cwd(), 'public', 'PROPUESTA TÉCNICA DE CONSULTORÍA.docx')
  const content = readFileSync(templatePath, 'binary')
  const zip = new PizZip(content)

  const doc = new Docxtemplater(zip, {
    delimiters: { start: '[', end: ']' },
    paragraphLoop: true,
    linebreaks: true,
  })

  doc.render(variables)

  const buffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' })
  const clienteName = String(cert.clienteNombre ?? certId).replace(/[^a-zA-Z0-9_\- ]/g, '')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="Propuesta_${clienteName}.docx"`,
    },
  })
}
