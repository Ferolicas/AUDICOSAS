"use client"

import Link from "next/link"
import { ArrowLeft, Pencil, FileText, CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Progress } from "@/components/crm/ui/progress"
import { Separator } from "@/components/crm/ui/separator"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import { PriorityIndicator } from "@/components/crm/shared/PriorityIndicator"
import type { CrmCertificacion } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const FASE_NOMBRES = ['Diagnóstico Gratuito', 'Diseño a Tu Medida', 'Implementación Acompañada', 'Preparación Auditoría', 'Certificación y Mejora']
const FASE_COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

export default function CertificacionDetalleClient({ certificacion: c }: { certificacion: CrmCertificacion }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/certificacion">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{c.clienteNombre}</h1>
            <StatusBadge status={c.estado} />
            <PriorityIndicator priority={c.prioridad as 'Urgente' | 'Alta' | 'Media' | 'Baja'} />
          </div>
          <p className="text-gray-500">{c.codigo}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/crm/certificacion/${c._id}/editar`}>
            <Button variant="outline"><Pencil className="w-4 h-4 mr-2" />Editar</Button>
          </Link>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Normas</p>
            <div className="flex gap-1 flex-wrap mt-1">
              {c.normas?.map(n => <Badge key={n} variant="outline">{n}</Badge>)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Consultor Líder</p>
            <p className="text-lg font-semibold">{c.consultorLider}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Valor Proyecto</p>
            <p className="text-lg font-semibold">{c.valorProyecto ? formatCOP(c.valorProyecto) : '-'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Fechas</p>
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
                <div key={num} className={`p-4 rounded-lg border-2 ${isCurrent ? 'border-blue-500 bg-blue-50' : isComplete ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${isComplete ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'}`}>
                      {isComplete ? <CheckCircle2 className="w-5 h-5" /> : num}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{FASE_NOMBRES[num - 1]}</p>
                      {isCurrent && <Badge className="bg-blue-500 text-white text-xs">Fase actual</Badge>}
                    </div>
                    {faseData && <span className="text-sm font-medium">{faseData.avance}%</span>}
                  </div>

                  {faseData && (isCurrent || isComplete) && (
                    <>
                      {faseData.avance != null && <Progress value={faseData.avance} className="h-1.5 mb-3" />}
                      {faseData.tareas && faseData.tareas.length > 0 && (
                        <div className="space-y-1 mt-2">
                          <p className="text-xs font-medium text-gray-500 uppercase">Tareas</p>
                          {faseData.tareas.map((t, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              {t.completada ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-gray-300" />}
                              <span className={t.completada ? 'line-through text-gray-400' : ''}>{t.nombre}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {faseData.entregables && faseData.entregables.length > 0 && (
                        <div className="space-y-1 mt-2">
                          <p className="text-xs font-medium text-gray-500 uppercase">Entregables</p>
                          {faseData.entregables.map((e, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              {e.completado ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-gray-300" />}
                              <span className={e.completado ? 'line-through text-gray-400' : ''}>{e.nombre}</span>
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
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Generar Documentos</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { fase: 1, nombre: 'Diagnóstico y Compromiso', docs: 'Caso de negocio, compromiso, política, cronograma' },
              { fase: 2, nombre: 'Análisis de Contexto', docs: 'PESTEL, partes interesadas, riesgos, mapa procesos' },
              { fase: 3, nombre: 'Documentación del SGC', docs: 'Fichas de proceso, procedimientos, formatos' },
              { fase: 4, nombre: 'Implementación y Formación', docs: 'Plan comunicación, formación, registros' },
              { fase: 5, nombre: 'Auditoría Interna', docs: 'Programa, plan, checklist, hallazgos, informe' },
              { fase: 6, nombre: 'Certificación', docs: 'Selección OC, preparación final, registro' },
            ].map(f => (
              <Link key={f.fase} href={`/crm/documentos/${f.fase}/${c._id}`} target="_blank">
                <div className="border rounded-lg p-4 hover:bg-gray-50 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${c.faseActual > f.fase ? 'bg-green-500' : c.faseActual === f.fase ? 'bg-blue-500' : 'bg-gray-300'}`}>{f.fase}</span>
                    <span className="font-medium text-sm">{f.nombre}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-8">{f.docs}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
