"use client"

import Link from "next/link"
import { ArrowLeft, Pencil, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Progress } from "@/components/crm/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/crm/ui/table"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import { DeleteButton } from "@/components/crm/shared/DeleteButton"
import type { CrmConsultoria } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

function formatCOP(v: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)
}

export default function ConsultoriaDetalleClient({ consultoria: c }: { consultoria: CrmConsultoria }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/consultoria">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">{c.clienteNombre}</h1>
            <StatusBadge status={c.estado} />
          </div>
          <p className="text-slate-400">{c.codigo} · {c.tipo}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/crm/consultoria/${c._id}/editar`}>
            <Button variant="outline"><Pencil className="w-4 h-4 mr-2" />Editar</Button>
          </Link>
          <DeleteButton id={c._id} apiPath="/api/crm/consultorias" entityName="Consultoría" redirectPath="/crm/consultoria" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-slate-400">Consultor Líder</p><p className="font-semibold">{c.consultorLider}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-400">Valor Contratado</p><p className="font-semibold">{c.valorContratado ? formatCOP(c.valorContratado) : '-'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-400">Normas</p><div className="flex gap-1 flex-wrap mt-1">{c.normas?.map(n => <Badge key={n} variant="outline" className="text-xs">{n}</Badge>)}</div></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-400">Fechas</p><p className="text-sm">{c.fechaInicio ? format(new Date(c.fechaInicio), 'dd MMM yy', { locale: es }) : '-'} → {c.fechaFinPlan ? format(new Date(c.fechaFinPlan), 'dd MMM yy', { locale: es }) : '-'}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">Avance</p>
            <span className="text-2xl font-bold text-blue-600">{c.avance}%</span>
          </div>
          <Progress value={c.avance} className="h-3" />
        </CardContent>
      </Card>

      {c.sesiones && c.sesiones.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Sesiones</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tema</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {c.sesiones.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>{s.fecha ? format(new Date(s.fecha), 'dd MMM yyyy', { locale: es }) : '-'}</TableCell>
                    <TableCell className="font-medium">{s.tema}</TableCell>
                    <TableCell>{s.duracionHoras}h</TableCell>
                    <TableCell className="max-w-xs text-sm text-slate-400">{s.notas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {c.entregables && c.entregables.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Entregables</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha Entrega</TableHead>
                  <TableHead>Archivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {c.entregables.map((e, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{e.nombre}</TableCell>
                    <TableCell>{e.fechaEntrega ? format(new Date(e.fechaEntrega), 'dd MMM yyyy', { locale: es }) : '-'}</TableCell>
                    <TableCell>
                      {(e as unknown as { archivoUrl?: string }).archivoUrl ? (
                        <a href={(e as unknown as { archivoUrl: string }).archivoUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" />Descargar</Button>
                        </a>
                      ) : <span className="text-slate-500">-</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
