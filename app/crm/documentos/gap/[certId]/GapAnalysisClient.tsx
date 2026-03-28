"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Printer, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Textarea } from "@/components/crm/ui/textarea"
import { Input } from "@/components/crm/ui/input"
import { Label } from "@/components/crm/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/crm/ui/select"
import { Progress } from "@/components/crm/ui/progress"
import { toast } from "sonner"
import type { CrmCertificacion } from "@/lib/crm/types"

// ── ISO 9001:2015 Clause Structure ──────────────────────────────────────────

const SECTIONS = [
  {
    numero: '4', titulo: 'Contexto de la Organización',
    clausulas: [
      { id: '4.1', titulo: 'Comprensión de la organización y su contexto' },
      { id: '4.2', titulo: 'Comprensión de las necesidades y expectativas de las partes interesadas' },
      { id: '4.3', titulo: 'Determinación del alcance del SGC' },
      { id: '4.4', titulo: 'SGC y sus procesos' },
    ]
  },
  {
    numero: '5', titulo: 'Liderazgo',
    clausulas: [
      { id: '5.1.1', titulo: 'Liderazgo y compromiso — Generalidades' },
      { id: '5.1.2', titulo: 'Enfoque al cliente' },
      { id: '5.2.1', titulo: 'Establecimiento de la política de calidad' },
      { id: '5.2.2', titulo: 'Comunicación de la política de calidad' },
      { id: '5.3', titulo: 'Roles, responsabilidades y autoridades' },
    ]
  },
  {
    numero: '6', titulo: 'Planificación',
    clausulas: [
      { id: '6.1', titulo: 'Acciones para abordar riesgos y oportunidades' },
      { id: '6.2', titulo: 'Objetivos de calidad y planificación para lograrlos' },
      { id: '6.3', titulo: 'Planificación de los cambios' },
    ]
  },
  {
    numero: '7', titulo: 'Apoyo',
    clausulas: [
      { id: '7.1.1', titulo: 'Recursos — Generalidades' },
      { id: '7.1.2', titulo: 'Personas' },
      { id: '7.1.3', titulo: 'Infraestructura' },
      { id: '7.1.4', titulo: 'Ambiente para la operación de los procesos' },
      { id: '7.1.5', titulo: 'Recursos de seguimiento y medición' },
      { id: '7.1.6', titulo: 'Conocimientos de la organización' },
      { id: '7.2', titulo: 'Competencia' },
      { id: '7.3', titulo: 'Toma de conciencia' },
      { id: '7.4', titulo: 'Comunicación' },
      { id: '7.5.1', titulo: 'Información documentada — Generalidades' },
      { id: '7.5.2', titulo: 'Creación y actualización de información documentada' },
      { id: '7.5.3', titulo: 'Control de la información documentada' },
    ]
  },
  {
    numero: '8', titulo: 'Operación',
    clausulas: [
      { id: '8.1', titulo: 'Planificación y control operacional' },
      { id: '8.2.1', titulo: 'Comunicación con el cliente' },
      { id: '8.2.2', titulo: 'Determinación de los requisitos relativos a productos y servicios' },
      { id: '8.2.3', titulo: 'Revisión de los requisitos relativos a productos y servicios' },
      { id: '8.2.4', titulo: 'Cambios en los requisitos de productos y servicios' },
      { id: '8.3', titulo: 'Diseño y desarrollo de los productos y servicios' },
      { id: '8.4', titulo: 'Control de los procesos, productos y servicios suministrados externamente' },
      { id: '8.5.1', titulo: 'Control de la producción y de la provisión del servicio' },
      { id: '8.5.2', titulo: 'Identificación y trazabilidad' },
      { id: '8.5.3', titulo: 'Propiedad perteneciente a los clientes o proveedores externos' },
      { id: '8.5.4', titulo: 'Preservación' },
      { id: '8.5.5', titulo: 'Actividades posteriores a la entrega' },
      { id: '8.5.6', titulo: 'Control de los cambios' },
      { id: '8.6', titulo: 'Liberación de los productos y servicios' },
      { id: '8.7', titulo: 'Control de las salidas no conformes' },
    ]
  },
  {
    numero: '9', titulo: 'Evaluación del Desempeño',
    clausulas: [
      { id: '9.1.1', titulo: 'Seguimiento, medición, análisis y evaluación — Generalidades' },
      { id: '9.1.2', titulo: 'Satisfacción del cliente' },
      { id: '9.1.3', titulo: 'Análisis y evaluación' },
      { id: '9.2', titulo: 'Auditoría interna' },
      { id: '9.3.1', titulo: 'Revisión por la dirección — Generalidades' },
      { id: '9.3.2', titulo: 'Entradas de la revisión por la dirección' },
      { id: '9.3.3', titulo: 'Salidas de la revisión por la dirección' },
    ]
  },
  {
    numero: '10', titulo: 'Mejora',
    clausulas: [
      { id: '10.1', titulo: 'Generalidades' },
      { id: '10.2', titulo: 'No conformidad y acción correctiva' },
      { id: '10.3', titulo: 'Mejora continua' },
    ]
  },
]

const ALL_CLAUSE_IDS = SECTIONS.flatMap(s => s.clausulas.map(c => c.id))

// ── Types ────────────────────────────────────────────────────────────────────

type Estado = 'Cumple' | 'Cumple Parcial' | 'No Cumple' | 'N/A' | ''

interface ClauseData {
  estado: Estado
  comentarios: string
  accionPropuesta: string
}

interface GapExisting {
  _id?: string
  analistaResponsable?: string
  fechaAnalisis?: string
  observacionesGenerales?: string
  cumplimientoTotal?: number
  clauses?: Array<{
    clauseId: string
    estado: string
    comentarios?: string
    accionPropuesta?: string
  }>
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function estadoToPct(estado: Estado): number | null {
  if (estado === 'Cumple') return 100
  if (estado === 'Cumple Parcial') return 50
  if (estado === 'No Cumple') return 0
  return null // N/A or empty → excluded
}

function calcSectionPct(clauseIds: string[], data: Record<string, ClauseData>): number {
  const values = clauseIds.map(id => estadoToPct(data[id]?.estado || '')).filter(v => v !== null) as number[]
  if (values.length === 0) return 0
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}

function calcTotalPct(data: Record<string, ClauseData>): number {
  return calcSectionPct(ALL_CLAUSE_IDS, data)
}

function estadoColor(estado: Estado) {
  if (estado === 'Cumple') return 'bg-green-500/20 text-green-300 border-green-500/30'
  if (estado === 'Cumple Parcial') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
  if (estado === 'No Cumple') return 'bg-red-500/20 text-red-300 border-red-500/30'
  if (estado === 'N/A') return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  return 'bg-slate-700 text-slate-400 border-slate-600'
}

function progressColor(pct: number) {
  if (pct >= 80) return 'bg-green-500'
  if (pct >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

// ── Component ────────────────────────────────────────────────────────────────

export default function GapAnalysisClient({
  certId,
  cert,
  existing,
}: {
  certId: string
  cert: CrmCertificacion
  existing: GapExisting | null
}) {
  // Initialize clause data from existing or empty
  const [clauseData, setClauseData] = useState<Record<string, ClauseData>>(() => {
    const init: Record<string, ClauseData> = {}
    for (const id of ALL_CLAUSE_IDS) {
      const found = existing?.clauses?.find(c => c.clauseId === id)
      init[id] = {
        estado: (found?.estado as Estado) || '',
        comentarios: found?.comentarios || '',
        accionPropuesta: found?.accionPropuesta || '',
      }
    }
    return init
  })

  const [header, setHeader] = useState({
    analistaResponsable: existing?.analistaResponsable || '',
    fechaAnalisis: existing?.fechaAnalisis || new Date().toISOString().split('T')[0],
    observacionesGenerales: existing?.observacionesGenerales || '',
  })

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)

  const updateClause = useCallback((id: string, field: keyof ClauseData, value: string) => {
    setClauseData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }))
  }, [])

  const toggleSection = (num: string) => setCollapsed(prev => ({ ...prev, [num]: !prev[num] }))
  const toggleClause = (id: string) => setExpandedClauses(prev => ({ ...prev, [id]: !prev[id] }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const totalPct = calcTotalPct(clauseData)
      const clauses = ALL_CLAUSE_IDS.map(id => ({
        _key: id,
        clauseId: id,
        estado: clauseData[id]?.estado || '',
        porcentaje: estadoToPct(clauseData[id]?.estado || '') ?? -1,
        comentarios: clauseData[id]?.comentarios || '',
        accionPropuesta: clauseData[id]?.accionPropuesta || '',
      }))

      const body = {
        ...header,
        clienteNombre: cert.clienteNombre,
        cumplimientoTotal: totalPct,
        clauses,
      }

      const res = await fetch(`/api/crm/gap-analysis/${certId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Error al guardar')
      toast.success('Diagnóstico GAP guardado')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const totalPct = calcTotalPct(clauseData)

  return (
    <div className="min-h-screen bg-[#0a1628] text-slate-100">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#0f1e35] border-b border-slate-700 px-6 py-3 flex items-center gap-4 no-print">
        <Link href={`/crm/certificacion/${certId}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-white">Diagnóstico GAP — ISO 9001:2015</h1>
          <p className="text-sm text-slate-400">{cert.clienteNombre} · {cert.codigo}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-bold" style={{ color: totalPct >= 80 ? '#22c55e' : totalPct >= 50 ? '#eab308' : '#ef4444' }}>
              {totalPct}%
            </span>
            <p className="text-xs text-slate-400">Cumplimiento</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />Imprimir
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />{saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Header fields */}
        <div className="bg-[#1B2A4A] rounded-xl border border-slate-700 p-5">
          <h2 className="font-semibold text-slate-200 mb-4">Información del Análisis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-300 text-sm">Analista Responsable</Label>
              <Input
                value={header.analistaResponsable}
                onChange={e => setHeader(h => ({ ...h, analistaResponsable: e.target.value }))}
                placeholder="Nombre del analista"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-300 text-sm">Fecha de Análisis</Label>
              <Input
                type="date"
                value={header.fechaAnalisis}
                onChange={e => setHeader(h => ({ ...h, fechaAnalisis: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-300 text-sm">Normas Evaluadas</Label>
              <div className="flex flex-wrap gap-1 mt-2">
                {cert.normas?.map(n => <Badge key={n} variant="outline" className="text-xs">{n}</Badge>)}
              </div>
            </div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-[#1B2A4A] rounded-xl border border-slate-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-200">Cumplimiento Global</h2>
            <span className="text-3xl font-bold" style={{ color: totalPct >= 80 ? '#22c55e' : totalPct >= 50 ? '#eab308' : '#ef4444' }}>
              {totalPct}%
            </span>
          </div>
          <Progress value={totalPct} className="h-3" />
          <div className="grid grid-cols-4 gap-4 mt-4">
            {[
              { label: 'Cumple', color: 'text-green-400', count: ALL_CLAUSE_IDS.filter(id => clauseData[id]?.estado === 'Cumple').length },
              { label: 'Cumple Parcial', color: 'text-yellow-400', count: ALL_CLAUSE_IDS.filter(id => clauseData[id]?.estado === 'Cumple Parcial').length },
              { label: 'No Cumple', color: 'text-red-400', count: ALL_CLAUSE_IDS.filter(id => clauseData[id]?.estado === 'No Cumple').length },
              { label: 'N/A', color: 'text-slate-400', count: ALL_CLAUSE_IDS.filter(id => clauseData[id]?.estado === 'N/A').length },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.map(section => {
          const sectionPct = calcSectionPct(section.clausulas.map(c => c.id), clauseData)
          const isCollapsed = collapsed[section.numero]

          return (
            <div key={section.numero} className="bg-[#1B2A4A] rounded-xl border border-slate-700 overflow-hidden">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.numero)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-700/30 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {section.numero}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{section.titulo}</p>
                  <p className="text-xs text-slate-400">{section.clausulas.length} requisitos</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: sectionPct >= 80 ? '#22c55e' : sectionPct >= 50 ? '#eab308' : '#ef4444' }}>
                      {sectionPct}%
                    </p>
                  </div>
                  <div className="w-24">
                    <Progress value={sectionPct} className="h-1.5" />
                  </div>
                  {isCollapsed ? <ChevronRight className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {/* Clauses */}
              {!isCollapsed && (
                <div className="border-t border-slate-700">
                  {section.clausulas.map((clausula, idx) => {
                    const data = clauseData[clausula.id]
                    const isExpanded = expandedClauses[clausula.id]
                    const pct = estadoToPct(data?.estado || '')

                    return (
                      <div key={clausula.id} className={`border-b border-slate-700/50 last:border-b-0 ${idx % 2 === 0 ? 'bg-slate-900/20' : ''}`}>
                        {/* Main row */}
                        <div className="flex items-center gap-3 px-5 py-3">
                          <button onClick={() => toggleClause(clausula.id)} className="shrink-0">
                            {isExpanded
                              ? <ChevronDown className="w-4 h-4 text-slate-500" />
                              : <ChevronRight className="w-4 h-4 text-slate-500" />
                            }
                          </button>
                          <Badge variant="outline" className="shrink-0 font-mono text-xs min-w-[3.5rem] justify-center">
                            {clausula.id}
                          </Badge>
                          <span className="flex-1 text-sm text-slate-200">{clausula.titulo}</span>
                          {pct !== null && (
                            <span className="text-sm font-semibold shrink-0" style={{ color: pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444' }}>
                              {pct}%
                            </span>
                          )}
                          <div className="w-40 shrink-0">
                            <Select
                              value={data?.estado || ''}
                              onValueChange={v => updateClause(clausula.id, 'estado', v)}
                            >
                              <SelectTrigger className={`h-8 text-xs border ${estadoColor(data?.estado || '')}`}>
                                <SelectValue placeholder="— Estado —" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Cumple">✅ Cumple</SelectItem>
                                <SelectItem value="Cumple Parcial">⚠️ Cumple Parcial</SelectItem>
                                <SelectItem value="No Cumple">❌ No Cumple</SelectItem>
                                <SelectItem value="N/A">— N/A</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <div className="px-12 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-slate-400 mb-1 block">Comentarios / Evidencias</Label>
                              <Textarea
                                rows={3}
                                value={data?.comentarios || ''}
                                onChange={e => updateClause(clausula.id, 'comentarios', e.target.value)}
                                placeholder="Describe la situación actual, evidencias encontradas..."
                                className="text-sm resize-none"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-slate-400 mb-1 block">Acción Propuesta</Label>
                              <Textarea
                                rows={3}
                                value={data?.accionPropuesta || ''}
                                onChange={e => updateClause(clausula.id, 'accionPropuesta', e.target.value)}
                                placeholder="Acción recomendada para cerrar la brecha..."
                                className="text-sm resize-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Observaciones generales */}
        <div className="bg-[#1B2A4A] rounded-xl border border-slate-700 p-5">
          <Label className="text-slate-200 font-semibold block mb-2">Observaciones Generales</Label>
          <Textarea
            rows={5}
            value={header.observacionesGenerales}
            onChange={e => setHeader(h => ({ ...h, observacionesGenerales: e.target.value }))}
            placeholder="Conclusiones generales del diagnóstico GAP, contexto del cliente, recomendaciones prioritarias..."
            className="resize-none"
          />
        </div>

        {/* Bottom save */}
        <div className="flex justify-end pb-6 no-print">
          <Button onClick={handleSave} disabled={saving} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />{saving ? 'Guardando...' : 'Guardar Diagnóstico GAP'}
          </Button>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  )
}
