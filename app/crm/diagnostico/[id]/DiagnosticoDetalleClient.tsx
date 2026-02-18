"use client"

import Link from "next/link"
import { ArrowLeft, FileText, Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Progress } from "@/components/crm/ui/progress"
import { Separator } from "@/components/crm/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/crm/ui/table"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import type { CrmDiagnostico } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

export default function DiagnosticoDetalleClient({ diagnostico: d }: { diagnostico: CrmDiagnostico }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/diagnostico">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{d.clienteNombre}</h1>
            <StatusBadge status={d.estado} />
          </div>
          <p className="text-gray-500">{d.codigo}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/crm/diagnostico/${d._id}/editar`}>
            <Button variant="outline"><Pencil className="w-4 h-4 mr-2" />Editar</Button>
          </Link>
          {d.estado === 'Completado' && (
            <Link href={`/crm/certificacion/nuevo?diagnosticoId=${d._id}`}>
              <Button><FileText className="w-4 h-4 mr-2" />Convertir a Certificación</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Normas</p>
            <div className="flex gap-1 flex-wrap mt-1">
              {d.normas?.map(n => <Badge key={n} variant="outline">{n}</Badge>)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Fecha de Visita</p>
            <p className="text-lg font-semibold">{d.fechaVisita ? format(new Date(d.fechaVisita), 'dd MMMM yyyy', { locale: es }) : '-'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Consultor Asignado</p>
            <p className="text-lg font-semibold">{d.consultorAsignado}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Viabilidad</p>
            <p className="text-lg font-semibold">{d.viabilidad || '-'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Results if completed */}
      {d.estado === 'Completado' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-500">Cumplimiento Global</p>
                <p className="text-4xl font-bold text-blue-600 mt-1">{d.cumplimientoGlobal ?? 0}%</p>
                <Progress value={d.cumplimientoGlobal ?? 0} className="h-2 mt-2" />
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-500">Tiempo Estimado</p>
                <p className="text-4xl font-bold text-green-600 mt-1">{d.tiempoEstimado ?? '-'}</p>
                <p className="text-sm text-gray-500">meses</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-500">Inversión Estimada</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{d.inversionEstimada ? formatCOP(d.inversionEstimada) : '-'}</p>
              </CardContent>
            </Card>
          </div>

          {d.resumenEjecutivo && (
            <Card>
              <CardHeader><CardTitle>Resumen Ejecutivo</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{d.resumenEjecutivo}</p>
              </CardContent>
            </Card>
          )}

          {d.cotizacion && d.cotizacion.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Cotización</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepto</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {d.cotizacion.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.concepto}</TableCell>
                        <TableCell className="text-right font-medium">{formatCOP(item.valor)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{formatCOP(d.cotizacion.reduce((s, c) => s + c.valor, 0))}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
