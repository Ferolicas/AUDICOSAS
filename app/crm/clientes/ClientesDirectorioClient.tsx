"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Plus, Users, UserPlus, Mail, Check, X, Loader2, Filter, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/crm/ui/table"
import { Input } from "@/components/crm/ui/input"
import { Button } from "@/components/crm/ui/button"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/crm/ui/dialog"
import { toast } from "sonner"
import { DeleteButton } from "@/components/crm/shared/DeleteButton"
import type { CrmCliente } from "@/lib/crm/types"

interface Props {
  clientes: CrmCliente[]
}

export default function ClientesDirectorioClient({ clientes }: Props) {
  const [search, setSearch] = useState("")
  const [serviceFilter, setServiceFilter] = useState<string>("todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<CrmCliente | null>(null)
  const [creating, setCreating] = useState(false)

  // Extract unique service interests for filter buttons
  const serviceOptions = useMemo(() => {
    const services = new Map<string, number>()
    for (const c of clientes) {
      const s = (c.servicioInteres ?? "").trim()
      if (s) services.set(s, (services.get(s) ?? 0) + 1)
    }
    return Array.from(services.entries()).sort((a, b) => b[1] - a[1])
  }, [clientes])

  const filtered = clientes.filter((c) => {
    const term = search.toLowerCase()
    const matchesSearch =
      (c.nombreComercial ?? "").toLowerCase().includes(term) ||
      (c.razonSocial ?? "").toLowerCase().includes(term) ||
      (c.sector ?? "").toLowerCase().includes(term) ||
      (c.codigo ?? "").toLowerCase().includes(term) ||
      (c.servicioInteres ?? "").toLowerCase().includes(term)
    const matchesService =
      serviceFilter === "todos" ||
      (serviceFilter === "sin-servicio"
        ? !(c.servicioInteres ?? "").trim()
        : (c.servicioInteres ?? "") === serviceFilter)
    return matchesSearch && matchesService
  })

  function openCreateAccount(cliente: CrmCliente) {
    setSelectedCliente(cliente)
    setModalOpen(true)
  }

  async function handleCreateAccount() {
    if (!selectedCliente) return
    setCreating(true)

    try {
      const res = await fetch("/api/crm/auth/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clienteId: selectedCliente._id }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Error al crear cuenta")
        return
      }

      if (data.emailSent) {
        toast.success(`Cuenta creada y correo enviado a ${selectedCliente.email}`)
      } else {
        toast.warning(`Cuenta creada pero no se pudo enviar el correo: ${data.emailError || "sin detalles"}`)
      }

      setModalOpen(false)
    } catch {
      toast.error("Error de conexión")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-500" />
            Directorio de Clientes
          </h1>
          <p className="text-slate-400 mt-1">
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

      {/* Service interest filters */}
      {serviceOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-sm text-slate-400 mr-1">Servicio:</span>
          <button
            onClick={() => setServiceFilter("todos")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              serviceFilter === "todos"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Todos ({clientes.length})
          </button>
          {serviceOptions.map(([service, count]) => (
            <button
              key={service}
              onClick={() => setServiceFilter(serviceFilter === service ? "todos" : service)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                serviceFilter === service
                  ? "bg-amber-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {service} ({count})
            </button>
          ))}
          <button
            onClick={() => setServiceFilter(serviceFilter === "sin-servicio" ? "todos" : "sin-servicio")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              serviceFilter === "sin-servicio"
                ? "bg-slate-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Sin servicio ({clientes.filter(c => !(c.servicioInteres ?? "").trim()).length})
          </button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-lg">Clientes{filtered.length !== clientes.length ? ` (${filtered.length} de ${clientes.length})` : ""}</span>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Buscar por nombre, empresa, sector o servicio..."
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
            <div className="text-center py-12 text-slate-400">
              {search || serviceFilter !== "todos"
                ? "No se encontraron clientes con ese criterio de búsqueda."
                : "No hay clientes registrados."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Nombre Comercial</TableHead>
                  <TableHead className="hidden md:table-cell">Contacto</TableHead>
                  <TableHead className="hidden md:table-cell">Sector</TableHead>
                  <TableHead className="hidden md:table-cell">Servicio de Interés</TableHead>
                  <TableHead className="hidden lg:table-cell">Ciudad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden lg:table-cell">Consultor</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c._id}>
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
                        className="font-medium text-slate-100 hover:text-blue-600"
                      >
                        {c.nombreComercial}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-300">
                      {c.nombreContacto ? (
                        <span>{c.nombreContacto}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-400">
                      {c.sector}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {c.servicioInteres ? (
                        <span className="text-xs font-medium text-amber-400 bg-amber-900/30 px-2 py-0.5 rounded-full">
                          {c.servicioInteres}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-400">
                      {c.ciudad}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={c.estado} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-400">
                      {c.consultorAsignado}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCreateAccount(c)}
                          disabled={!c.email}
                          title={c.email ? "Crear cuenta CRM para este cliente" : "El cliente no tiene correo"}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Crear cuenta</span>
                        </Button>
                        <DeleteButton
                          id={c._id}
                          apiPath="/api/crm/clientes"
                          entityName="Cliente"
                          redirectPath="/crm/clientes"
                          compact
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal crear cuenta */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Crear cuenta CRM
            </DialogTitle>
            <DialogDescription>
              Se creará una cuenta para el cliente y se le enviará un correo con sus credenciales de acceso.
            </DialogDescription>
          </DialogHeader>

          {selectedCliente && (
            <div className="space-y-3 py-2">
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Empresa</span>
                  <span className="text-sm font-medium">{selectedCliente.nombreComercial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Razón Social</span>
                  <span className="text-sm font-medium">{selectedCliente.razonSocial || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Correo</span>
                  <span className="text-sm font-medium text-blue-400">{selectedCliente.email || "Sin correo"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Teléfono</span>
                  <span className="text-sm font-medium">{selectedCliente.telefono || "—"}</span>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-sm text-blue-300">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Se enviará un correo a: {selectedCliente.email}</p>
                    <p className="text-blue-400 mt-1">Con una contraseña temporal y el enlace de inicio de sesión. Al ingresar por primera vez, deberá cambiar la contraseña.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={creating}>
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
            <Button onClick={handleCreateAccount} disabled={creating}>
              {creating ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-1" />
              )}
              {creating ? "Creando..." : "Confirmar y enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
