"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Pencil, Building2, Phone, Mail, MapPin, Target, MessageSquare, Send, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/crm/ui/table"
import { Button } from "@/components/crm/ui/button"
import { Separator } from "@/components/crm/ui/separator"
import { Badge } from "@/components/crm/ui/badge"
import { Input } from "@/components/crm/ui/input"
import { Checkbox } from "@/components/crm/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/crm/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/crm/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/crm/ui/select"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import { DeleteButton } from "@/components/crm/shared/DeleteButton"
import type { CrmCliente } from "@/lib/crm/types"
import { toast } from "sonner"

interface DiagnosticoRow {
  _id: string
  codigo: string
  estado: string
  fechaVisita: string
  normas: string[]
  inversionEstimada?: number
}

interface AuditoriaRow {
  _id: string
  codigo: string
  estado: string
  tipo: string
  fechaInicio: string
}

interface CertificacionRow {
  _id: string
  codigo: string
  estado: string
  normas: string[]
  avanceGlobal: number
}

interface ConsultoriaRow {
  _id: string
  codigo: string
  estado: string
  tipo: string
  avance: number
}

interface Props {
  cliente: CrmCliente
  diagnosticos: DiagnosticoRow[]
  auditorias: AuditoriaRow[]
  certificaciones_crm: CertificacionRow[]
  consultorias: ConsultoriaRow[]
}

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "-"
  try {
    return format(new Date(dateStr), "d 'de' MMMM, yyyy", { locale: es })
  } catch {
    return dateStr
  }
}

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

function InfoItem({ label, value, icon }: { label: string; value: string | number | undefined | null; icon?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-sm font-medium text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-100 flex items-center gap-2">
        {icon}
        {value ?? "-"}
      </dd>
    </div>
  )
}

export default function ClienteDetalleClient({ cliente, diagnosticos, auditorias, certificaciones_crm, consultorias }: Props) {
  const certs = cliente.certificaciones ?? []

  // Propuesta modal state
  const [propuestaModalOpen, setPropuestaModalOpen] = useState(false)
  const [selectedDiagId, setSelectedDiagId] = useState('')
  const [emailOption, setEmailOption] = useState<'stored' | 'custom'>(cliente.email ? 'stored' : 'custom')
  const [customEmail, setCustomEmail] = useState('')
  const [saveCustomEmail, setSaveCustomEmail] = useState(false)
  const [sendingPropuesta, setSendingPropuesta] = useState(false)

  const hasDiagnosticos = diagnosticos.length > 0

  const handleEnviarPropuesta = async () => {
    if (!selectedDiagId) { toast.error('Selecciona un diagnostico'); return }
    const email = emailOption === 'stored' ? cliente.email : customEmail
    if (!email) { toast.error('Ingresa un correo'); return }
    setSendingPropuesta(true)
    try {
      const res = await fetch('/api/crm/propuesta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosticoId: selectedDiagId,
          email,
          saveEmail: emailOption === 'custom' && saveCustomEmail,
        }),
      })
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Error al enviar') }
      toast.success('Propuesta enviada correctamente')
      setPropuestaModalOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al enviar')
    } finally {
      setSendingPropuesta(false)
    }
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Back + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link href="/crm/clientes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Volver al directorio
            </Button>
          </Link>
          <div className="flex gap-2 flex-wrap">
            {hasDiagnosticos && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDiagId(diagnosticos[0]?._id || '')
                  setEmailOption(cliente.email ? 'stored' : 'custom')
                  setPropuestaModalOpen(true)
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Propuesta
              </Button>
            )}
            <Link href={`/crm/clientes/${cliente._id}/editar`}>
              <Button variant="outline">
                <Pencil className="w-4 h-4 mr-2" />
                Editar Cliente
              </Button>
            </Link>
            <DeleteButton id={cliente._id} apiPath="/api/crm/clientes" entityName="Cliente" redirectPath="/crm/clientes" />
          </div>
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
                <p className="text-sm text-slate-400 mt-1 font-mono">{cliente.codigo}</p>
              </div>
              <StatusBadge status={cliente.estado} />
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="info">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="info">Informacion</TabsTrigger>
            <TabsTrigger value="diagnosticos">
              Diagnosticos {diagnosticos.length > 0 && <Badge variant="secondary" className="ml-1.5 text-xs">{diagnosticos.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="auditorias">
              Auditorias {auditorias.length > 0 && <Badge variant="secondary" className="ml-1.5 text-xs">{auditorias.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="certificaciones">
              Certificaciones {certificaciones_crm.length > 0 && <Badge variant="secondary" className="ml-1.5 text-xs">{certificaciones_crm.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="consultorias">
              Consultorias {consultorias.length > 0 && <Badge variant="secondary" className="ml-1.5 text-xs">{consultorias.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* Tab: Informacion */}
          <TabsContent value="info" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informacion General</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  <InfoItem label="Razon Social" value={cliente.razonSocial} />
                  {cliente.nombreContacto && <InfoItem label="Contacto" value={cliente.nombreContacto} />}
                  <InfoItem label="NIF / NIT" value={cliente.nif} />
                  <InfoItem label="Sector" value={cliente.sector} />
                  <InfoItem label="Tamano" value={cliente.tamano} />
                  <InfoItem label="No. Empleados" value={cliente.numEmpleados?.toLocaleString("es-CO")} />
                  <InfoItem label="Telefono" value={cliente.telefono} icon={<Phone className="w-3.5 h-3.5 text-slate-500" />} />
                  <InfoItem label="Email" value={cliente.email} icon={<Mail className="w-3.5 h-3.5 text-slate-500" />} />
                  <InfoItem label="Direccion" value={cliente.direccion} icon={<MapPin className="w-3.5 h-3.5 text-slate-500" />} />
                  <InfoItem label="Ciudad" value={cliente.ciudad} />
                  <InfoItem label="Pais" value={cliente.pais} />
                  <InfoItem label="Consultor Asignado" value={cliente.consultorAsignado} />
                  <InfoItem label="Fecha de Alta" value={formatDate(cliente.fechaAlta)} />
                  <InfoItem label="Servicio de Interes" value={cliente.servicioInteres} icon={<Target className="w-3.5 h-3.5 text-amber-500" />} />
                </dl>
              </CardContent>
            </Card>

            {cliente.observaciones && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    Observaciones del Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{cliente.observaciones}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Certificaciones del Cliente</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                {certs.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">
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
                          <TableCell className="text-slate-400">{cert.organismo}</TableCell>
                          <TableCell className="hidden md:table-cell font-mono text-sm text-slate-400">{cert.numeroCertificado}</TableCell>
                          <TableCell className="hidden md:table-cell text-slate-400">{formatDate(cert.fechaEmision)}</TableCell>
                          <TableCell className="hidden lg:table-cell text-slate-400">{formatDate(cert.vigenciaHasta)}</TableCell>
                          <TableCell><StatusBadge status={cert.estado} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Diagnosticos */}
          <TabsContent value="diagnosticos" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Diagnosticos</CardTitle>
                <Link href={`/crm/diagnostico/nuevo`}>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />Nuevo Diagnostico
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {diagnosticos.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">Sin diagnosticos registrados.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Codigo</TableHead>
                        <TableHead>Normas</TableHead>
                        <TableHead className="hidden md:table-cell">Fecha Visita</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="hidden lg:table-cell text-right">Inversion</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {diagnosticos.map(d => (
                        <TableRow key={d._id} className="cursor-pointer hover:bg-slate-800/50">
                          <TableCell>
                            <Link href={`/crm/diagnostico/${d._id}`} className="font-mono text-blue-400 hover:underline">
                              {d.codigo}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {d.normas?.map(n => <Badge key={n} variant="outline" className="text-xs">{n}</Badge>)}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-slate-400">{formatDate(d.fechaVisita)}</TableCell>
                          <TableCell><StatusBadge status={d.estado} /></TableCell>
                          <TableCell className="hidden lg:table-cell text-right text-slate-300">
                            {d.inversionEstimada ? formatCOP(d.inversionEstimada) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Auditorias */}
          <TabsContent value="auditorias" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Auditorias</CardTitle>
                <Link href={`/crm/auditoria/nuevo`}>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />Nueva Auditoria
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {auditorias.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">Sin auditorias registradas.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Codigo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="hidden md:table-cell">Fecha Inicio</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditorias.map(a => (
                        <TableRow key={a._id}>
                          <TableCell>
                            <Link href={`/crm/auditoria/${a._id}`} className="font-mono text-blue-400 hover:underline">
                              {a.codigo}
                            </Link>
                          </TableCell>
                          <TableCell className="text-slate-300 text-sm">{a.tipo}</TableCell>
                          <TableCell className="hidden md:table-cell text-slate-400">{formatDate(a.fechaInicio)}</TableCell>
                          <TableCell><StatusBadge status={a.estado} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Certificaciones */}
          <TabsContent value="certificaciones" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Proyectos de Certificacion</CardTitle>
                <Link href={`/crm/certificacion/nuevo`}>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />Nueva Certificacion
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {certificaciones_crm.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">Sin proyectos de certificacion.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Codigo</TableHead>
                        <TableHead>Normas</TableHead>
                        <TableHead className="hidden md:table-cell">Avance</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certificaciones_crm.map(c => (
                        <TableRow key={c._id}>
                          <TableCell>
                            <Link href={`/crm/certificacion/${c._id}`} className="font-mono text-blue-400 hover:underline">
                              {c.codigo}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {c.normas?.map(n => <Badge key={n} variant="outline" className="text-xs">{n}</Badge>)}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-slate-300">{c.avanceGlobal}%</TableCell>
                          <TableCell><StatusBadge status={c.estado} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Consultorias */}
          <TabsContent value="consultorias" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Consultorias</CardTitle>
                <Link href={`/crm/consultoria/nuevo`}>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />Nueva Consultoria
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {consultorias.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">Sin consultorias registradas.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Codigo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="hidden md:table-cell">Avance</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consultorias.map(c => (
                        <TableRow key={c._id}>
                          <TableCell>
                            <Link href={`/crm/consultoria/${c._id}`} className="font-mono text-blue-400 hover:underline">
                              {c.codigo}
                            </Link>
                          </TableCell>
                          <TableCell className="text-slate-300 text-sm">{c.tipo}</TableCell>
                          <TableCell className="hidden md:table-cell text-slate-300">{c.avance}%</TableCell>
                          <TableCell><StatusBadge status={c.estado} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Enviar Propuesta Modal */}
      <Dialog open={propuestaModalOpen} onOpenChange={setPropuestaModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Propuesta al Cliente</DialogTitle>
            <DialogDescription>
              Selecciona el diagnostico de origen y el correo del destinatario.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Diagnostic selector */}
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Diagnostico de origen</label>
              <Select value={selectedDiagId} onValueChange={setSelectedDiagId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar diagnostico" />
                </SelectTrigger>
                <SelectContent>
                  {diagnosticos.map(d => (
                    <SelectItem key={d._id} value={d._id}>
                      {d.codigo} — {d.estado} {d.inversionEstimada ? `(${formatCOP(d.inversionEstimada)})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Email option */}
            {cliente.email && (
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
                <input
                  type="radio"
                  name="clientePropEmail"
                  className="mt-0.5 accent-blue-500"
                  checked={emailOption === 'stored'}
                  onChange={() => setEmailOption('stored')}
                />
                <div>
                  <p className="text-sm font-medium text-slate-200">Correo del cliente</p>
                  <p className="text-xs text-slate-400 mt-0.5">{cliente.email}</p>
                </div>
              </label>
            )}

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
              <input
                type="radio"
                name="clientePropEmail"
                className="mt-0.5 accent-blue-500"
                checked={emailOption === 'custom' || !cliente.email}
                onChange={() => setEmailOption('custom')}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">Otro correo</p>
                {(emailOption === 'custom' || !cliente.email) && (
                  <div className="mt-2 space-y-2">
                    <Input
                      type="email"
                      placeholder="correo@empresa.com"
                      value={customEmail}
                      onChange={e => setCustomEmail(e.target.value)}
                    />
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                      <Checkbox
                        checked={saveCustomEmail}
                        onCheckedChange={checked => setSaveCustomEmail(Boolean(checked))}
                      />
                      Guardar este correo en el sistema
                    </label>
                  </div>
                )}
              </div>
            </label>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setPropuestaModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEnviarPropuesta} disabled={sendingPropuesta || !selectedDiagId} className="gap-2">
              <Send className="w-4 h-4" />
              {sendingPropuesta ? 'Enviando...' : 'Enviar Propuesta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
