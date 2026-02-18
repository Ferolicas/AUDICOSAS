"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Input } from "@/components/crm/ui/input"
import { Progress } from "@/components/crm/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/crm/ui/table"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import type { CrmConsultoria } from "@/lib/crm/types"

function formatCOP(v: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)
}

export default function ConsultoriaListaClient({ consultorias }: { consultorias: CrmConsultoria[] }) {
  const [search, setSearch] = useState("")

  const filtered = consultorias.filter(c =>
    !search || c.clienteNombre?.toLowerCase().includes(search.toLowerCase()) || c.codigo?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultoría</h1>
          <p className="text-gray-600">Proyectos de consultoría y acompañamiento</p>
        </div>
        <Link href="/crm/consultoria/nuevo">
          <Button><Plus className="w-4 h-4 mr-2" />Nuevo Proyecto</Button>
        </Link>
      </div>

      <Input placeholder="Buscar proyecto..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Normas</TableHead>
                <TableHead>Consultor</TableHead>
                <TableHead>Avance</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c._id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <Link href={`/crm/consultoria/${c._id}`} className="font-medium text-blue-600 hover:underline">{c.codigo}</Link>
                  </TableCell>
                  <TableCell className="font-medium">{c.clienteNombre}</TableCell>
                  <TableCell className="text-sm">{c.tipo}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">{c.normas?.map(n => <Badge key={n} variant="outline" className="text-xs">{n}</Badge>)}</div>
                  </TableCell>
                  <TableCell className="text-sm">{c.consultorLider}</TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1"><span>{c.avance}%</span></div>
                      <Progress value={c.avance} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{c.valorContratado ? formatCOP(c.valorContratado) : '-'}</TableCell>
                  <TableCell><StatusBadge status={c.estado} /></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No se encontraron proyectos</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
