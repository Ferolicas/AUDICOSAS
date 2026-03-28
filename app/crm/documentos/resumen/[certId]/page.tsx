import { sanityRead } from '@/lib/sanity.server'
import { certificacionByIdQuery } from '@/lib/crm/queries'
import { notFound } from 'next/navigation'
import groq from 'groq'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'
import type { CrmCertificacion } from '@/lib/crm/types'

const gapByCertQuery = groq`*[_type == "crmGapAnalysis" && certId == $certId][0]`

interface GapClause {
  clauseId: string
  estado: string
  porcentaje: number
  comentarios?: string
  accionPropuesta?: string
}

interface GapData {
  analistaResponsable?: string
  fechaAnalisis?: string
  cumplimientoTotal?: number
  observacionesGenerales?: string
  clauses?: GapClause[]
}

function estadoColor(estado: string) {
  if (estado === 'Cumple') return '#16a34a'
  if (estado === 'Cumple Parcial') return '#ca8a04'
  if (estado === 'No Cumple') return '#dc2626'
  return '#64748b'
}

function estadoBg(estado: string) {
  if (estado === 'Cumple') return '#f0fdf4'
  if (estado === 'Cumple Parcial') return '#fefce8'
  if (estado === 'No Cumple') return '#fef2f2'
  return '#f8fafc'
}

const SECTION_NAMES: Record<string, string> = {
  '4': 'Contexto de la Organización',
  '5': 'Liderazgo',
  '6': 'Planificación',
  '7': 'Apoyo',
  '8': 'Operación',
  '9': 'Evaluación del Desempeño',
  '10': 'Mejora',
}

function groupBySection(clauses: GapClause[]) {
  const groups: Record<string, GapClause[]> = {}
  for (const c of clauses) {
    const secNum = c.clauseId.split('.')[0]
    if (!groups[secNum]) groups[secNum] = []
    groups[secNum].push(c)
  }
  return groups
}

function calcSectionPct(clauses: GapClause[]) {
  const vals = clauses.map(c => {
    if (c.estado === 'Cumple') return 100
    if (c.estado === 'Cumple Parcial') return 50
    if (c.estado === 'No Cumple') return 0
    return null
  }).filter(v => v !== null) as number[]
  if (vals.length === 0) return 0
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}

export default async function ResumenEjecutivoPage({ params }: { params: Promise<{ certId: string }> }) {
  const { certId } = await params
  const [cert, gap] = await Promise.all([
    sanityRead().fetch<CrmCertificacion>(certificacionByIdQuery, { id: certId }),
    sanityRead().fetch<GapData | null>(gapByCertQuery, { certId }),
  ])

  if (!cert) notFound()

  const clauses = gap?.clauses?.filter(c => c.estado && c.estado !== 'N/A') || []
  const groups = groupBySection(clauses)
  const totalPct = gap?.cumplimientoTotal ?? 0
  const totalColor = totalPct >= 80 ? '#16a34a' : totalPct >= 50 ? '#ca8a04' : '#dc2626'

  const gaps = clauses.filter(c => c.estado === 'No Cumple' || c.estado === 'Cumple Parcial')

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Nav — no-print */}
      <div className="no-print bg-[#0f1e35] px-6 py-3 flex items-center gap-4 text-white">
        <Link href={`/crm/certificacion/${certId}`} className="flex items-center gap-2 text-slate-300 hover:text-white text-sm">
          <ArrowLeft className="w-4 h-4" />Volver
        </Link>
        <span className="flex-1 font-semibold">Resumen Ejecutivo — {cert.clienteNombre}</span>
        <button onClick={() => {}} className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded">
          <Printer className="w-4 h-4" />Imprimir
        </button>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-6 space-y-8" style={{ fontFamily: 'system-ui, sans-serif' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1B2A4A,#2563EB)', borderRadius: 12, padding: '32px 40px', color: 'white' }}>
          <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#93c5fd', marginBottom: 8 }}>
            AUDICO S.A.S. — Diagnóstico GAP ISO 9001:2015
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{cert.clienteNombre}</h1>
          <p style={{ color: '#bfdbfe', marginTop: 4 }}>{cert.codigo} · {gap?.fechaAnalisis || 'Sin fecha'}</p>
          {gap?.analistaResponsable && (
            <p style={{ color: '#bfdbfe', fontSize: 13, marginTop: 4 }}>Analista: {gap.analistaResponsable}</p>
          )}
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Cumplimiento Global', value: `${totalPct}%`, color: totalColor },
            { label: 'Requisitos Cumple', value: clauses.filter(c => c.estado === 'Cumple').length, color: '#16a34a' },
            { label: 'Cumple Parcial', value: clauses.filter(c => c.estado === 'Cumple Parcial').length, color: '#ca8a04' },
            { label: 'No Cumple', value: clauses.filter(c => c.estado === 'No Cumple').length, color: '#dc2626' },
          ].map(k => (
            <div key={k.label} style={{ background: 'white', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: k.color, margin: 0 }}>{k.value}</p>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Per-section summary */}
        <div style={{ background: 'white', borderRadius: 12, padding: '24px 32px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Resultados por Sección</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Sección</th>
                <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Requisitos</th>
                <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Cumplimiento</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(SECTION_NAMES).map(([num, name]) => {
                const secClauses = groups[num] || []
                const pct = calcSectionPct(secClauses)
                const color = pct >= 80 ? '#16a34a' : pct >= 50 ? '#ca8a04' : '#dc2626'
                return (
                  <tr key={num} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#334155' }}>
                      <strong style={{ fontFamily: 'monospace', color: '#475569' }}>{num}.</strong> {name}
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px 12px', fontSize: 13, color: '#64748b' }}>
                      {secClauses.length}
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                      <span style={{ fontWeight: 700, color, fontSize: 14 }}>{pct}%</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Critical gaps */}
        {gaps.length > 0 && (
          <div style={{ background: 'white', borderRadius: 12, padding: '24px 32px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Brechas Identificadas</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#64748b', fontWeight: 600, width: 80 }}>Cláusula</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 12, color: '#64748b', fontWeight: 600, width: 120 }}>Estado</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Comentarios</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Acción Propuesta</th>
                </tr>
              </thead>
              <tbody>
                {gaps.map(g => (
                  <tr key={g.clauseId} style={{ borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{g.clauseId}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ background: estadoBg(g.estado), color: estadoColor(g.estado), padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                        {g.estado}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 200 }}>{g.comentarios || '—'}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 200 }}>{g.accionPropuesta || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Observaciones generales */}
        {gap?.observacionesGenerales && (
          <div style={{ background: 'white', borderRadius: 12, padding: '24px 32px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>Observaciones Generales</h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{gap.observacionesGenerales}</p>
          </div>
        )}

        {!gap && (
          <div style={{ background: '#fef9c3', borderRadius: 12, padding: '24px 32px', border: '1px solid #fde047', textAlign: 'center' }}>
            <p style={{ color: '#854d0e', fontSize: 14 }}>
              No hay diagnóstico GAP guardado para esta certificación.{' '}
              <a href={`/crm/documentos/gap/${certId}`} style={{ color: '#2563eb', fontWeight: 600 }}>
                Completar diagnóstico →
              </a>
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingBottom: 32 }}>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>AUDICO S.A.S. — audicoiso.com · Generado {new Date().toLocaleDateString('es-CO')}</p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  )
}
