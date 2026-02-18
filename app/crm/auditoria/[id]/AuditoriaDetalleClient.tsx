"use client"

import Link from "next/link"
import { ArrowLeft, Pencil, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/crm/ui/table"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import type { CrmAuditoria } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AuditoriaDetalleClient({ auditoria: a }: { auditoria: CrmAuditoria }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/auditoria">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{a.clienteNombre}</h1>
            <StatusBadge status={a.estado} />
          </div>
          <p className="text-gray-500">{a.codigo} · {a.tipo}</p>
        </div>
        <Link href={`/crm/auditoria/${a._id}/editar`}>
          <Button variant="outline"><Pencil className="w-4 h-4 mr-2" />Editar</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Tipo</p><p className="font-semibold">{a.tipo}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Auditor Líder</p><p className="font-semibold">{a.auditorLider}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Fecha</p><p className="font-semibold">{a.fechaInicio ? format(new Date(a.fechaInicio), 'dd MMM', { locale: es }) : '-'} — {a.fechaFin ? format(new Date(a.fechaFin), 'dd MMM yyyy', { locale: es }) : '-'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Normas</p><div className="flex gap-1 flex-wrap mt-1">{a.normas?.map(n => <Badge key={n} variant="outline" className="text-xs">{n}</Badge>)}</div></CardContent></Card>
      </div>

      {a.resultado && (
        <Card>
          <CardHeader><CardTitle>Resultado</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <StatusBadge status={a.resultado} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">{a.numNCMayores ?? 0}</p>
                <p className="text-sm text-gray-600">NC Mayores</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">{a.numNCMenores ?? 0}</p>
                <p className="text-sm text-gray-600">NC Menores</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">{a.numObservaciones ?? 0}</p>
                <p className="text-sm text-gray-600">Observaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {a.hallazgos && a.hallazgos.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Hallazgos</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cláusula</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Evidencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {a.hallazgos.map((h, i) => (
                  <TableRow key={i}>
                    <TableCell><StatusBadge status={h.tipo} /></TableCell>
                    <TableCell className="font-mono text-sm">{h.clausula}</TableCell>
                    <TableCell className="max-w-xs">{h.descripcion}</TableCell>
                    <TableCell className="max-w-xs text-sm text-gray-600">{h.evidencia}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {a.accionesCorrectivas && a.accionesCorrectivas.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Acciones Correctivas</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Fecha Límite</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {a.accionesCorrectivas.map((ac, i) => (
                  <TableRow key={i}>
                    <TableCell>{ac.descripcion}</TableCell>
                    <TableCell>{ac.responsable}</TableCell>
                    <TableCell>{ac.fechaLimite ? format(new Date(ac.fechaLimite), 'dd MMM yyyy', { locale: es }) : '-'}</TableCell>
                    <TableCell><StatusBadge status={ac.estado} /></TableCell>
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
