"use client"

import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Pencil, Building2, Phone, Mail, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/crm/ui/table"
import { Button } from "@/components/crm/ui/button"
import { Separator } from "@/components/crm/ui/separator"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import type { CrmCliente } from "@/lib/crm/types"

interface Props {
  cliente: CrmCliente
}

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "-"
  try {
    return format(new Date(dateStr), "d 'de' MMMM, yyyy", { locale: es })
  } catch {
    return dateStr
  }
}

function InfoItem({ label, value, icon }: { label: string; value: string | number | undefined | null; icon?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 flex items-center gap-2">
        {icon}
        {value ?? "-"}
      </dd>
    </div>
  )
}

export default function ClienteDetalleClient({ cliente }: Props) {
  const certs = cliente.certificaciones ?? []

  return (
    <div className="p-6 space-y-6">
      {/* Back + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link href="/crm/clientes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Volver al directorio
          </Button>
        </Link>
        <Link href={`/crm/clientes/${cliente._id}/editar`}>
          <Button variant="outline">
            <Pencil className="w-4 h-4" />
            Editar Cliente
          </Button>
        </Link>
      </div>

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-500" />
                {cliente.nombreComercial}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1 font-mono">{cliente.codigo}</p>
            </div>
            <StatusBadge status={cliente.estado} />
          </div>
        </CardHeader>
      </Card>

      {/* Info Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informacion General</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <InfoItem label="Razon Social" value={cliente.razonSocial} />
            <InfoItem label="NIF / NIT" value={cliente.nif} />
            <InfoItem label="Sector" value={cliente.sector} />
            <InfoItem
              label="Tamano"
              value={cliente.tamano}
            />
            <InfoItem label="No. Empleados" value={cliente.numEmpleados?.toLocaleString("es-CO")} />
            <InfoItem
              label="Telefono"
              value={cliente.telefono}
              icon={<Phone className="w-3.5 h-3.5 text-gray-400" />}
            />
            <InfoItem
              label="Email"
              value={cliente.email}
              icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}
            />
            <InfoItem
              label="Direccion"
              value={cliente.direccion}
              icon={<MapPin className="w-3.5 h-3.5 text-gray-400" />}
            />
            <InfoItem label="Ciudad" value={cliente.ciudad} />
            <InfoItem label="Pais" value={cliente.pais} />
            <InfoItem label="Consultor Asignado" value={cliente.consultorAsignado} />
            <InfoItem label="Fecha de Alta" value={formatDate(cliente.fechaAlta)} />
          </dl>
        </CardContent>
      </Card>

      {/* Certificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Certificaciones del Cliente</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {certs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Este cliente no tiene certificaciones registradas.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Norma</TableHead>
                  <TableHead>Organismo</TableHead>
                  <TableHead className="hidden md:table-cell">No. Certificado</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha Emision</TableHead>
                  <TableHead className="hidden lg:table-cell">Vigencia Hasta</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certs.map((cert, idx) => (
                  <TableRow key={cert.numeroCertificado ?? idx}>
                    <TableCell className="font-medium">{cert.norma}</TableCell>
                    <TableCell className="text-gray-600">{cert.organismo}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm text-gray-600">
                      {cert.numeroCertificado}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-600">
                      {formatDate(cert.fechaEmision)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-gray-600">
                      {formatDate(cert.vigenciaHasta)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={cert.estado} />
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
