"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Progress } from "@/components/crm/ui/progress"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import { PriorityIndicator } from "@/components/crm/shared/PriorityIndicator"
import type { CrmCertificacion } from "@/lib/crm/types"

const FASES = [
  { num: 1, nombre: 'Diagnóstico', color: 'bg-blue-500' },
  { num: 2, nombre: 'Diseño', color: 'bg-purple-500' },
  { num: 3, nombre: 'Implementación', color: 'bg-orange-500' },
  { num: 4, nombre: 'Preparación', color: 'bg-yellow-500' },
  { num: 5, nombre: 'Certificación', color: 'bg-green-500' },
]

export default function CertificacionPipelineClient({ certificaciones }: { certificaciones: CrmCertificacion[] }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline de Certificación</h1>
          <p className="text-gray-600">Proyectos de certificación ISO por fase</p>
        </div>
        <Link href="/crm/certificacion/nuevo">
          <Button><Plus className="w-4 h-4 mr-2" />Nuevo Proyecto</Button>
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {FASES.map(fase => {
          const proyectos = certificaciones.filter(c => c.faseActual === fase.num)
          return (
            <div key={fase.num} className="min-w-[280px] flex-1">
              <div className={`${fase.color} text-white rounded-t-lg px-4 py-2 flex items-center justify-between`}>
                <span className="font-semibold text-sm">Fase {fase.num}: {fase.nombre}</span>
                <Badge className="bg-white/20 text-white">{proyectos.length}</Badge>
              </div>
              <div className="bg-gray-100 rounded-b-lg p-3 space-y-3 min-h-[200px]">
                {proyectos.map(p => (
                  <Link key={p._id} href={`/crm/certificacion/${p._id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm text-gray-900">{p.clienteNombre}</h4>
                          <PriorityIndicator priority={p.prioridad as 'Urgente' | 'Alta' | 'Media' | 'Baja'} />
                        </div>
                        <div className="flex gap-1 flex-wrap mb-2">
                          {p.normas?.map(n => <Badge key={n} variant="outline" className="text-xs">{n}</Badge>)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Avance</span><span>{p.avanceGlobal}%</span>
                          </div>
                          <Progress value={p.avanceGlobal} className="h-1.5" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{p.consultorLider} · {p.codigo}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {proyectos.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">Sin proyectos</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
