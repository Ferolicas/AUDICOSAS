"use client"

import Link from "next/link"
import { ArrowLeft, Pencil, Users, Clock, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/crm/ui/table"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import type { CrmCapacitacion } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function CapacitacionDetalleClient({ capacitacion: c }: { capacitacion: CrmCapacitacion }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/capacitaciones">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">{c.cursoNombre}</h1>
            <StatusBadge status={c.estado} />
          </div>
          <p className="text-slate-400">{c.codigo} · {c.clienteNombre}</p>
        </div>
        <Link href={`/crm/capacitaciones/${c._id}/editar`}>
          <Button variant="outline"><Pencil className="w-4 h-4 mr-2" />Editar</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-slate-400">Tipo</p><Badge variant="outline">{c.tipo}</Badge></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-400">Instructor</p><p className="font-semibold">{c.instructor}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-400">Modalidad</p><Badge variant="secondary">{c.modalidad}</Badge></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-400">Cliente</p><p className="font-semibold">{c.clienteNombre}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <p className="text-sm text-slate-400">Fecha</p>
            <p className="text-lg font-bold">{c.fecha ? format(new Date(c.fecha), 'dd MMM yyyy', { locale: es }) : '-'}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <p className="text-sm text-slate-400">Duración</p>
            <p className="text-lg font-bold">{c.duracionHoras} horas</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <p className="text-sm text-slate-400">Participantes</p>
            <p className="text-lg font-bold">{c.numParticipantes}</p>
          </CardContent>
        </Card>
      </div>

      {c.evaluacion && (
        <Card>
          <CardHeader><CardTitle>Evaluación</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{c.evaluacion.satisfaccionPromedio}</p>
                <p className="text-sm text-slate-400">/ 5.0 satisfacción</p>
              </div>
              {c.evaluacion.comentarios && (
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Comentarios</p>
                  <p className="text-slate-300">{c.evaluacion.comentarios}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {c.participantes && c.participantes.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Participantes</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Asistió</TableHead>
                  <TableHead>Calificación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {c.participantes.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{p.nombre}</TableCell>
                    <TableCell>{p.cargo}</TableCell>
                    <TableCell className="text-sm">{p.email}</TableCell>
                    <TableCell>{p.asistio ? <Badge className="bg-green-500 text-white">Sí</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                    <TableCell>{p.calificacion ? `${p.calificacion}/5` : '-'}</TableCell>
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
