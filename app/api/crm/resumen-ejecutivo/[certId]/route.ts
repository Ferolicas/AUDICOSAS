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
  comentarios?: string
}

// ── Cláusulas ISO 9001:2015 ───────────────────────────────────────────────────

const CLAUSE_TITLES: Record<string, string> = {
  '4.1': 'Comprensión de la organización y su contexto',
  '4.2': 'Comprensión de las necesidades y expectativas de las partes interesadas',
  '4.3': 'Determinación del alcance del SGC',
  '4.4': 'SGC y sus procesos',
  '5.1.1': 'Liderazgo y compromiso — Generalidades',
  '5.1.2': 'Enfoque al cliente',
  '5.2.1': 'Establecimiento de la política de calidad',
  '5.2.2': 'Comunicación de la política de calidad',
  '5.3': 'Roles, responsabilidades y autoridades',
  '6.1': 'Acciones para abordar riesgos y oportunidades',
  '6.2': 'Objetivos de calidad y planificación para lograrlos',
  '6.3': 'Planificación de los cambios',
  '7.1.1': 'Recursos — Generalidades',
  '7.1.2': 'Personas',
  '7.1.3': 'Infraestructura',
  '7.1.4': 'Ambiente para la operación de los procesos',
  '7.1.5': 'Recursos de seguimiento y medición',
  '7.1.6': 'Conocimientos de la organización',
  '7.2': 'Competencia',
  '7.3': 'Toma de conciencia',
  '7.4': 'Comunicación',
  '7.5.1': 'Información documentada — Generalidades',
  '7.5.2': 'Creación y actualización de información documentada',
  '7.5.3': 'Control de la información documentada',
  '8.1': 'Planificación y control operacional',
  '8.2.1': 'Comunicación con el cliente',
  '8.2.2': 'Determinación de los requisitos relativos a productos y servicios',
  '8.2.3': 'Revisión de los requisitos relativos a productos y servicios',
  '8.2.4': 'Cambios en los requisitos de productos y servicios',
  '8.3': 'Diseño y desarrollo de los productos y servicios',
  '8.4': 'Control de los procesos, productos y servicios suministrados externamente',
  '8.5.1': 'Control de la producción y de la provisión del servicio',
  '8.5.2': 'Identificación y trazabilidad',
  '8.5.3': 'Propiedad perteneciente a los clientes o proveedores externos',
  '8.5.4': 'Preservación',
  '8.5.5': 'Actividades posteriores a la entrega',
  '8.5.6': 'Control de los cambios',
  '8.6': 'Liberación de los productos y servicios',
  '8.7': 'Control de las salidas no conformes',
  '9.1.1': 'Seguimiento, medición, análisis y evaluación — Generalidades',
  '9.1.2': 'Satisfacción del cliente',
  '9.1.3': 'Análisis y evaluación',
  '9.2': 'Auditoría interna',
  '9.3.1': 'Revisión por la dirección — Generalidades',
  '9.3.2': 'Entradas de la revisión por la dirección',
  '9.3.3': 'Salidas de la revisión por la dirección',
  '10.1': 'Generalidades',
  '10.2': 'No conformidad y acción correctiva',
  '10.3': 'Mejora continua',
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

function bulletList(clauses: GapClause[], estado: string): string {
  const items = clauses.filter(c => c.estado === estado)
  if (!items.length) return 'Ninguno'
  return items.map(c => `• ${c.clauseId} – ${CLAUSE_TITLES[c.clauseId] ?? c.clauseId}`).join('\n')
}

// Fusiona variables [FASE_X] que Word parte en múltiples runs XML
function fixSplitVars(xml: string): string {
  // Paso 1: [FASE_ + número  →  [FASE_N (dentro del mismo run)
  xml = xml.replace(
    /\[FASE_<\/w:t><\/w:r><w:r[^>]*><w:rPr>[\s\S]*?<\/w:rPr><w:t>(\d+)<\/w:t><\/w:r>/g,
    '[FASE_$1</w:t></w:r>'
  )
  // Paso 2: [FASE_N + ]  →  [FASE_N]
  xml = xml.replace(
    /(\[FASE_\d+)<\/w:t><\/w:r><w:r[^>]*><w:rPr>[\s\S]*?<\/w:rPr><w:t>\]<\/w:t><\/w:r>/g,
    '$1]</w:t></w:r>'
  )
  return xml
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function GET(_req: Request, { params }: { params: Promise<{ certId: string }> }) {
  const { certId } = await params
  const client = sanityRead()

  const [cert, gap] = await Promise.all([
    client.fetch<Record<string, unknown>>(certificacionByIdQuery, { id: certId }),
    client.fetch<{ cumplimientoTotal?: number; clauses?: GapClause[] }>(gapByCertQuery, { certId }),
  ])

  if (!cert) return NextResponse.json({ error: 'Certificación no encontrada' }, { status: 404 })

  const clauses: GapClause[] = (gap?.clauses ?? []) as GapClause[]
  const cumplGlobal = Math.round((gap?.cumplimientoTotal ?? 0) * 10) / 10
  const valorNum = cert.valorProyecto as number | undefined
  const valorProyecto = valorNum
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valorNum)
    : ''

  const variables: Record<string, string> = {
    CUMPLIMIENTO_GLOBAL: `${cumplGlobal}%`,
    FASE_4: `${sectionPct(clauses, '4')}%`,
    FASE_5: `${sectionPct(clauses, '5')}%`,
    FASE_6: `${sectionPct(clauses, '6')}%`,
    FASE_7: `${sectionPct(clauses, '7')}%`,
    FASE_8: `${sectionPct(clauses, '8')}%`,
    FASE_9: `${sectionPct(clauses, '9')}%`,
    FASE_10: `${sectionPct(clauses, '10')}%`,
    LISTA_NOCUMPLE: bulletList(clauses, 'No Cumple'),
    LISTA_CUMPLEPARCIAL: bulletList(clauses, 'Cumple Parcial'),
    VALOR_PROYECTO: valorProyecto,
  }

  const templatePath = path.join(process.cwd(), 'public', 'RESUMEN EJECUTIVO DEL DIAGNÓSTICO GAP.docx')
  const content = readFileSync(templatePath, 'binary')
  const zip = new PizZip(content)

  // Arreglar variables partidas en múltiples runs
  const docXml = zip.file('word/document.xml')!.asText()
  zip.file('word/document.xml', fixSplitVars(docXml))

  const doc = new Docxtemplater(zip, {
    delimiters: { start: '[', end: ']' },
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => '',
  })

  doc.render(variables)
  const buffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' })
  const clienteName = String(cert.clienteNombre ?? certId).replace(/[^a-zA-Z0-9_\- ]/g, '')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="ResumenEjecutivo_${clienteName}.docx"`,
    },
  })
}
