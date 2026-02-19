"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clienteSchema } from "@/lib/crm/schemas"
import { Input } from "@/components/crm/ui/input"
import { Label } from "@/components/crm/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/crm/ui/select"
import { CrmFormWrapper } from "@/components/crm/shared/CrmFormWrapper"
import { toast } from "sonner"
import type { CrmCliente } from "@/lib/crm/types"
import type { z } from "zod"

type FormData = z.infer<typeof clienteSchema>

export default function ClienteEditarClient({ cliente }: { cliente: CrmCliente }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      razonSocial: cliente.razonSocial,
      nombreComercial: cliente.nombreComercial,
      nif: cliente.nif,
      sector: cliente.sector,
      tamano: cliente.tamano,
      numEmpleados: cliente.numEmpleados,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      ciudad: cliente.ciudad,
      pais: cliente.pais,
      estado: cliente.estado,
      consultorAsignado: cliente.consultorAsignado,
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/clientes/${cliente._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Error al actualizar') }
      toast.success('Cliente actualizado')
      router.push(`/crm/clientes/${cliente._id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CrmFormWrapper title={`Editar: ${cliente.nombreComercial}`} backHref={`/crm/clientes/${cliente._id}`} onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Razón Social *</Label><Input {...register('razonSocial')} />{errors.razonSocial && <p className="text-sm text-red-500 mt-1">{errors.razonSocial.message}</p>}</div>
        <div><Label>Nombre Comercial *</Label><Input {...register('nombreComercial')} />{errors.nombreComercial && <p className="text-sm text-red-500 mt-1">{errors.nombreComercial.message}</p>}</div>
        <div><Label>NIF / NIT *</Label><Input {...register('nif')} />{errors.nif && <p className="text-sm text-red-500 mt-1">{errors.nif.message}</p>}</div>
        <div><Label>Sector *</Label><Input {...register('sector')} />{errors.sector && <p className="text-sm text-red-500 mt-1">{errors.sector.message}</p>}</div>
        <div>
          <Label>Tamaño *</Label>
          <Select defaultValue={cliente.tamano} onValueChange={v => setValue('tamano', v as FormData['tamano'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Micro', 'Pequeña', 'Mediana', 'Grande'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Empleados *</Label><Input type="number" {...register('numEmpleados', { valueAsNumber: true })} /></div>
        <div><Label>Teléfono</Label><Input {...register('telefono')} /></div>
        <div><Label>Email *</Label><Input type="email" {...register('email')} />{errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}</div>
        <div><Label>Dirección</Label><Input {...register('direccion')} /></div>
        <div><Label>Ciudad</Label><Input {...register('ciudad')} /></div>
        <div><Label>País</Label><Input {...register('pais')} /></div>
        <div>
          <Label>Estado</Label>
          <Select defaultValue={cliente.estado} onValueChange={v => setValue('estado', v as FormData['estado'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Prospecto', 'Activo', 'Inactivo', 'Ex-cliente'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Consultor Asignado *</Label><Input {...register('consultorAsignado')} /></div>
      </div>
    </CrmFormWrapper>
  )
}
