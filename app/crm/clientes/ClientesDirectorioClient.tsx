"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/crm/ui/table"
import { Input } from "@/components/crm/ui/input"
import { Button } from "@/components/crm/ui/button"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import type { CrmCliente } from "@/lib/crm/types"

interface Props {
  clientes: CrmCliente[]
}

export default function ClientesDirectorioClient({ clientes }: Props) {
  const [search, setSearch] = useState("")

  const filtered = clientes.filter((c) => {
    const term = search.toLowerCase()
    return (
      (c.nombreComercial ?? "").toLowerCase().includes(term) ||
      (c.razonSocial ?? "").toLowerCase().includes(term) ||
      (c.sector ?? "").toLowerCase().includes(term) ||
      (c.codigo ?? "").toLowerCase().includes(term)
    )
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-500" />
            Directorio de Clientes
          </h1>
          <p className="text-gray-600 mt-1">
            {clientes.length} cliente{clientes.length !== 1 ? "s" : ""} registrado{clientes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/crm/clientes/nuevo">
          <Button>
            <Plus className="w-4 h-4" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-lg">Clientes</span>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, empresa o sector..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Buscar clientes"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {search
                ? "No se encontraron clientes con ese criterio de busqueda."
                : "No hay clientes registrados."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Nombre Comercial</TableHead>
                  <TableHead className="hidden md:table-cell">Sector</TableHead>
                  <TableHead className="hidden lg:table-cell">Ciudad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden lg:table-cell">Consultor</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Empleados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c._id} className="cursor-pointer">
                    <TableCell>
                      <Link
                        href={`/crm/clientes/${c._id}`}
                        className="font-mono text-sm text-blue-600 hover:underline"
                      >
                        {c.codigo}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/crm/clientes/${c._id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {c.nombreComercial}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-600">
                      {c.sector}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-gray-600">
                      {c.ciudad}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={c.estado} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-gray-600">
                      {c.consultorAsignado}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right text-gray-600">
                      {c.numEmpleados?.toLocaleString("es-CO")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
