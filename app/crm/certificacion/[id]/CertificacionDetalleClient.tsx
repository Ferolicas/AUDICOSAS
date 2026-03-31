"use client"

import Link from "next/link"
import { ArrowLeft, Pencil, FileText, CheckCircle2, Circle, CheckCheck, Paperclip } from "lucide-react"
import DocumentosSection from "@/components/crm/shared/DocumentosSection"
import type { Documento } from "@/components/crm/shared/DocumentosSection"
import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Progress } from "@/components/crm/ui/progress"
import { Separator } from "@/components/crm/ui/separator"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import { PriorityIndicator } from "@/components/crm/shared/PriorityIndicator"
import { DeleteButton } from "@/components/crm/shared/DeleteButton"
import type { CrmCertificacion } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const FASE_NOMBRES = ['Auditoría de Brechas y Potencial de ROI', 'Arquitectura de Procesos de Alto Rendimiento', 'Despliegue Estratégico y Cultura Organizacional', 'Blindaje ISO (Simulacro de Auditoría)', 'Validación de Activos y Mejora Continua']
const FASE_COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

export default function CertificacionDetalleClient({ certificacion: inicial }: { certificacion: CrmCertificacion }) {
  const [faseActual, setFaseActual] = useState(inicial.faseActual)
  const [avanceGlobal, setAvanceGlobal] = useState(inicial.avanceGlobal)
  const [completing, setCompleting] = useState<number | null>(null)
  const c = { ...inicial, faseActual, avanceGlobal }

  async function completarFase(num: number) {
    if (completing) return
    setCompleting(num)
    try {
      const nuevaFase = Math.min(num + 1, 5)
      const nuevoAvance = num >= 5 ? 100 : Math.round((num / 5) * 100)
      const res = await fetch(`/api/crm/certificaciones/${inicial._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faseActual: nuevaFase,
          avanceGlobal: nuevoAvance,
          ...(num >= 5 ? { estado: 'Completado' } : {}),
        }),
      })
      if (!res.ok) throw new Error('Error al actualizar')
      setFaseActual(nuevaFase)
      setAvanceGlobal(nuevoAvance)
      toast.success(`Fase ${num} completada`)
    } catch {
      toast.error('No se pudo completar la fase')
    } finally {
      setCompleting(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/certificacion">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">{c.clienteNombre}</h1>
            <StatusBadge status={c.estado} />
            <PriorityIndicator priority={c.prioridad as 'Urgente' | 'Alta' | 'Media' | 'Baja'} />
          </div>
          <p className="text-slate-400">{c.codigo}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/crm/certificacion/${c._id}/editar`}>
            <Button variant="outline"><Pencil className="w-4 h-4 mr-2" />Editar</Button>
          </Link>
          <DeleteButton id={c._id} apiPath="/api/crm/certificaciones" entityName="Certificación" redirectPath="/crm/certificacion" />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">Normas</p>
            <div className="flex gap-1 flex-wrap mt-1">
              {c.normas?.map(n => <Badge key={n} variant="outline">{n}</Badge>)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">Consultor Líder</p>
            <p className="text-lg font-semibold">{c.consultorLider}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">Valor Proyecto</p>
            <p className="text-lg font-semibold">{c.valorProyecto ? formatCOP(c.valorProyecto) : '-'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">Fechas</p>
            <p className="text-sm">{c.fechaInicio ? format(new Date(c.fechaInicio), 'dd MMM yy', { locale: es }) : '-'} → {c.fechaObjetivo ? format(new Date(c.fechaObjetivo), 'dd MMM yy', { locale: es }) : '-'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Avance global */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">Avance Global</p>
            <span className="text-2xl font-bold text-blue-600">{c.avanceGlobal}%</span>
          </div>
          <Progress value={c.avanceGlobal} className="h-3" />
        </CardContent>
      </Card>

      {/* Phase timeline */}
      <Card>
        <CardHeader><CardTitle>Fases del Proyecto</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(num => {
              const isCurrent = c.faseActual === num
              const isComplete = c.faseActual > num
              const faseData = c.fases?.find(f => f.numero === num)

              return (
                <div key={num} className={`p-4 rounded-lg border-2 ${isCurrent ? 'border-blue-500 bg-blue-900/30' : isComplete ? 'border-green-200 bg-green-50' : 'border-slate-700'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${isComplete ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-slate-600'}`}>
                      {isComplete ? <CheckCircle2 className="w-5 h-5" /> : num}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{FASE_NOMBRES[num - 1]}</p>
                      {isCurrent && <Badge className="bg-blue-500 text-white text-xs">Fase actual</Badge>}
                    </div>
                    {faseData && <span className="text-sm font-medium">{faseData.avance}%</span>}
                    {isCurrent && (
                      <button
                        onClick={() => completarFase(num)}
                        disabled={completing === num}
                        title="Marcar fase como completada"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                      >
                        <CheckCheck className="w-4 h-4" />
                        {completing === num ? 'Guardando...' : 'Completar'}
                      </button>
                    )}
                  </div>

                  {faseData && (isCurrent || isComplete) && (
                    <>
                      {faseData.avance != null && <Progress value={faseData.avance} className="h-1.5 mb-3" />}
                      {faseData.tareas && faseData.tareas.length > 0 && (
                        <div className="space-y-1 mt-2">
                          <p className="text-xs font-medium text-slate-400 uppercase">Tareas</p>
                          {faseData.tareas.map((t, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              {t.completada ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-slate-600" />}
                              <span className={t.completada ? 'line-through text-slate-500' : ''}>{t.nombre}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {faseData.entregables && faseData.entregables.length > 0 && (
                        <div className="space-y-1 mt-2">
                          <p className="text-xs font-medium text-slate-400 uppercase">Entregables</p>
                          {faseData.entregables.map((e, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              {e.completado ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-slate-600" />}
                              <span className={e.completado ? 'line-through text-slate-500' : ''}>{e.nombre}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Document Generation */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Documentos</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href={`/crm/documentos/gap/${c._id}`}>
              <div className="border-2 border-blue-500/40 rounded-xl p-5 hover:bg-blue-900/30 hover:border-blue-400 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">G</div>
                  <div>
                    <p className="font-semibold text-slate-100">Diagnóstico GAP</p>
                    <p className="text-xs text-slate-400">ISO 9001:2015 — Análisis por cláusula</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Formulario editable con los 49 requisitos de la norma. Guarda el progreso y retoma en cualquier momento.
                </p>
              </div>
            </Link>
            <Link href={`/crm/documentos/propuesta/${c._id}`}>
              <div className="border-2 border-amber-500/40 rounded-xl p-5 hover:bg-amber-900/30 hover:border-amber-400 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">P</div>
                  <div>
                    <p className="font-semibold text-slate-100">Propuesta</p>
                    <p className="text-xs text-slate-400">Propuesta comercial del proyecto</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Documento de propuesta personalizada con alcance, cronograma e inversión para el cliente.
                </p>
              </div>
            </Link>
            <Link href={`/crm/documentos/contrato/${c._id}`}>
              <div className="border-2 border-purple-500/40 rounded-xl p-5 hover:bg-purple-900/30 hover:border-purple-400 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">C</div>
                  <div>
                    <p className="font-semibold text-slate-100">Contrato</p>
                    <p className="text-xs text-slate-400">Contrato de prestación de servicios</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Contrato formal entre AUDICO y el cliente con condiciones, alcance y términos del proyecto.
                </p>
              </div>
            </Link>
            <Link href={`/crm/documentos/resumen/${c._id}`}>
              <div className="border-2 border-green-500/40 rounded-xl p-5 hover:bg-green-900/30 hover:border-green-400 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">R</div>
                  <div>
                    <p className="font-semibold text-slate-100">Resumen Ejecutivo</p>
                    <p className="text-xs text-slate-400">Informe consolidado para imprimir</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Vista ejecutiva con porcentaje global, brechas críticas y acciones propuestas. Listo para presentar al cliente.
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Archivos adjuntos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="w-5 h-5" />Archivos Adjuntos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentosSection
            docId={inicial._id}
            documentos={(inicial.documentos ?? []) as Documento[]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
