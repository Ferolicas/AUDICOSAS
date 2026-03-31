import { NextResponse } from 'next/server'
import { sanityRead } from '@/lib/sanity.server'
import { certificacionByIdQuery } from '@/lib/crm/queries'
import groq from 'groq'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { readFileSync } from 'fs'
import path from 'path'

const gapByCertQuery = groq`*[_type == "crmGapAnalysis" && certId == $certId][0]`
const clienteByIdQuery = groq`*[_type == "crmCliente" && _id == $id][0]{
  _id, codigo, razonSocial, nombreComercial, nif, direccion,
  nombreContacto, telefono, email
}`

interface GapClause {
  clauseId: string
  estado: string
  porcentaje: number
}

// ── Número a letras (español, pesos colombianos) ──────────────────────────────

const UNIDADES = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE',
  'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE']
const DECENAS = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
const CENTENAS = ['', 'CIEN', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
  'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

function tresDigitos(n: number): string {
  const h = Math.floor(n / 100)
  const resto = n % 100
  const d = Math.floor(resto / 10)
  const u = resto % 10
  let r = ''
  if (h > 0) {
    r += (h === 1 && resto > 0) ? 'CIENTO' : CENTENAS[h]
    if (resto > 0) r += ' '
  }
  if (resto >= 20) {
    r += DECENAS[d]
    if (u > 0) r += ' Y ' + UNIDADES[u]
  } else if (resto > 0) {
    r += UNIDADES[resto]
  }
  return r.trim()
}

function numberToWords(n: number): string {
  if (!n || n === 0) return 'CERO PESOS COLOMBIANOS'
  const num = Math.floor(Math.abs(n))
  const millones = Math.floor(num / 1_000_000)
  const miles = Math.floor((num % 1_000_000) / 1_000)
  const resto = num % 1_000
  let r = ''
  if (millones > 0) {
    r += millones === 1 ? 'UN MILLÓN' : tresDigitos(millones) + ' MILLONES'
    if (miles > 0 || resto > 0) r += ' '
  }
  if (miles > 0) {
    r += miles === 1 ? 'MIL' : tresDigitos(miles) + ' MIL'
    if (resto > 0) r += ' '
  }
  if (resto > 0) r += tresDigitos(resto)
  return r.trim() + ' PESOS COLOMBIANOS'
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

const monthName = (d: Date) => {
  const m = d.toLocaleDateString('es-CO', { month: 'long' })
  return m.charAt(0).toUpperCase() + m.slice(1)
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function GET(_req: Request, { params }: { params: Promise<{ certId: string }> }) {
  const { certId } = await params
  const client = sanityRead()

  const cert = await client.fetch<Record<string, unknown>>(certificacionByIdQuery, { id: certId })
  if (!cert) return NextResponse.json({ error: 'Certificación no encontrada' }, { status: 404 })

  const clienteId = (cert.cliente as Record<string, unknown> | null)?._id as string | undefined

  const [gap, cliente] = await Promise.all([
    client.fetch<{ cumplimientoTotal?: number; clauses?: GapClause[] }>(gapByCertQuery, { certId }),
    clienteId
      ? client.fetch<Record<string, unknown>>(clienteByIdQuery, { id: clienteId })
      : Promise.resolve(null),
  ])

  const clauses: GapClause[] = (gap?.clauses ?? []) as GapClause[]

  const now = new Date()
  const dia = String(now.getDate())
  const mes = monthName(now)
  const ano = String(now.getFullYear())
  const fechaHoy = `${dia} de ${mes} de ${ano}`
  const mesAno = `${mes} de ${ano}`

  const nextMonth = new Date(now)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const mesAnoUnomas = `${monthName(nextMonth)} de ${nextMonth.getFullYear()}`

  const cumplGlobal = Math.round((gap?.cumplimientoTotal ?? 0) * 10) / 10
  const noCumpleTotal = clauses.filter(c => c.estado === 'No Cumple').length
  const cumpleParcialTotal = clauses.filter(c => c.estado === 'Cumple Parcial').length
  const valorNum = cert.valorProyecto as number | undefined
  const valorProyecto = valorNum
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valorNum)
    : ''

  const variables: Record<string, string> = {
    ID_CLIENTE: String(cliente?.codigo ?? ''),
    DIA: dia,
    MES: mes,
    ANO: ano,
    NOMBRE_EMPRESA: String(cert.clienteNombre ?? cliente?.nombreComercial ?? ''),
    NIT: String(cliente?.nif ?? ''),
    DIRECCION: String(cliente?.direccion ?? ''),
    NOMBRE: String(cliente?.nombreContacto ?? ''),
    EMAIL: String(cliente?.email ?? ''),
    TELEFONO: String(cliente?.telefono ?? ''),
    FECHA_HOY: fechaHoy,
    MES_ANO: mesAno,
    MES_ANO_UNOMAS: mesAnoUnomas,
    CUMPLIMIENTO_GLOBAL: `${cumplGlobal}%`,
    NUMERO_NO_CUMPLE: String(noCumpleTotal),
    NUMERO_CUMPLE_PARCIAL: String(cumpleParcialTotal),
    RECUENTO_4_5_6_7: String(countNoCumple(clauses, ['4', '5', '6', '7'])),
    VALOR_PROYECTO: valorProyecto,
    VALOR_LETRAS: valorNum ? numberToWords(valorNum) : '',
  }

  const templatePath = path.join(process.cwd(), 'public', 'CONTRATO DE PRESTACIÓN DE SERVICIOS DE CONSULTORÍA.docx')
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
      'Content-Disposition': `attachment; filename="Contrato_${clienteName}.docx"`,
    },
  })
}
