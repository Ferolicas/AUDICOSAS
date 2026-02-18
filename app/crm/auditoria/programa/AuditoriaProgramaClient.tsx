"use client"

import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/crm/ui/table"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import type { CrmAuditoria } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AuditoriaProgramaClient({ auditorias }: { auditorias: CrmAuditoria[] }) {
  const year = new Date().getFullYear()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm/auditoria">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programa Anual de Auditorías {year}</h1>
          <p className="text-gray-600">Planificación y seguimiento del programa de auditorías</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Cronograma
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Normas</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditorias.map(a => (
                <TableRow key={a._id}>
                  <TableCell>
                    <Link href={`/crm/auditoria/${a._id}`} className="text-blue-600 hover:underline font-medium">
                      {a.codigo}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{a.clienteNombre}</TableCell>
                  <TableCell className="text-sm">{a.tipo}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {a.normas?.map(n => <Badge key={n} variant="outline" className="text-xs">{n}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell>{a.fechaInicio ? format(new Date(a.fechaInicio), 'dd MMM yyyy', { locale: es }) : '-'}</TableCell>
                  <TableCell>{a.fechaFin ? format(new Date(a.fechaFin), 'dd MMM yyyy', { locale: es }) : '-'}</TableCell>
                  <TableCell>{a.auditorLider}</TableCell>
                  <TableCell><StatusBadge status={a.estado} /></TableCell>
                </TableRow>
              ))}
              {auditorias.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No hay auditorías programadas</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
