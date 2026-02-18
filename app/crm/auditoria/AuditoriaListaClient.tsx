"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Input } from "@/components/crm/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/crm/ui/table"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import type { CrmAuditoria } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AuditoriaListaClient({ auditorias }: { auditorias: CrmAuditoria[] }) {
  const [search, setSearch] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos")

  const estados = ["Todos", "Planificada", "En ejecución", "Completada", "Cancelada"]

  const filtered = auditorias.filter(a => {
    const matchSearch = !search || a.clienteNombre?.toLowerCase().includes(search.toLowerCase()) ||
      a.codigo?.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === "Todos" || a.estado === filtroEstado
    return matchSearch && matchEstado
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auditorías</h1>
          <p className="text-gray-600">Gestión de auditorías internas y externas</p>
        </div>
        <div className="flex gap-2">
          <Link href="/crm/auditoria/programa">
            <Button variant="outline"><Calendar className="w-4 h-4 mr-2" />Programa</Button>
          </Link>
          <Link href="/crm/auditoria/nuevo">
            <Button><Plus className="w-4 h-4 mr-2" />Nueva Auditoría</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="Buscar auditoría..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
        <div className="flex gap-2 flex-wrap">
          {estados.map(e => (
            <Button key={e} variant={filtroEstado === e ? "default" : "outline"} size="sm" onClick={() => setFiltroEstado(e)}>
              {e}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Normas</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a._id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <Link href={`/crm/auditoria/${a._id}`} className="font-medium text-blue-600 hover:underline">
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
                  <TableCell className="text-sm">
                    {a.fechaInicio ? format(new Date(a.fechaInicio), 'dd MMM yyyy', { locale: es }) : '-'}
                  </TableCell>
                  <TableCell className="text-sm">{a.auditorLider}</TableCell>
                  <TableCell><StatusBadge status={a.estado} /></TableCell>
                  <TableCell>
                    {a.resultado ? <StatusBadge status={a.resultado} /> : <span className="text-gray-400">-</span>}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No se encontraron auditorías</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
