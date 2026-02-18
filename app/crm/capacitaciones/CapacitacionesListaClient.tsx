"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Input } from "@/components/crm/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/crm/ui/table"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import type { CrmCapacitacion } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function CapacitacionesListaClient({ capacitaciones }: { capacitaciones: CrmCapacitacion[] }) {
  const [search, setSearch] = useState("")

  const filtered = capacitaciones.filter(c =>
    !search || c.cursoNombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.clienteNombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.codigo?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Capacitaciones</h1>
          <p className="text-gray-600">Formación y capacitación en normas ISO</p>
        </div>
        <Link href="/crm/capacitaciones/nuevo">
          <Button><Plus className="w-4 h-4 mr-2" />Nueva Capacitación</Button>
        </Link>
      </div>

      <Input placeholder="Buscar capacitación..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Modalidad</TableHead>
                <TableHead>Participantes</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c._id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <Link href={`/crm/capacitaciones/${c._id}`} className="font-medium text-blue-600 hover:underline">{c.codigo}</Link>
                  </TableCell>
                  <TableCell className="font-medium">{c.cursoNombre}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{c.tipo}</Badge></TableCell>
                  <TableCell>{c.clienteNombre}</TableCell>
                  <TableCell className="text-sm">{c.instructor}</TableCell>
                  <TableCell className="text-sm">{c.fecha ? format(new Date(c.fecha), 'dd MMM yyyy', { locale: es }) : '-'}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{c.modalidad}</Badge></TableCell>
                  <TableCell className="text-center">{c.numParticipantes}</TableCell>
                  <TableCell><StatusBadge status={c.estado} /></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-gray-500">No se encontraron capacitaciones</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
