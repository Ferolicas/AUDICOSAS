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
import type { z } from "zod"

type FormData = z.infer<typeof clienteSchema>

export default function NuevoClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { pais: 'Colombia', estado: 'Prospecto' },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/crm/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al crear cliente')
      }
      toast.success('Cliente creado exitosamente')
      router.push('/crm/clientes')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CrmFormWrapper title="Nuevo Cliente" backHref="/crm/clientes" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Razón Social *</Label>
          <Input {...register('razonSocial')} placeholder="Razón social" />
          {errors.razonSocial && <p className="text-sm text-red-500 mt-1">{errors.razonSocial.message}</p>}
        </div>
        <div>
          <Label>Nombre Comercial *</Label>
          <Input {...register('nombreComercial')} placeholder="Nombre comercial" />
          {errors.nombreComercial && <p className="text-sm text-red-500 mt-1">{errors.nombreComercial.message}</p>}
        </div>
        <div>
          <Label>NIF / NIT *</Label>
          <Input {...register('nif')} placeholder="NIF o NIT" />
          {errors.nif && <p className="text-sm text-red-500 mt-1">{errors.nif.message}</p>}
        </div>
        <div>
          <Label>Sector *</Label>
          <Input {...register('sector')} placeholder="Sector empresarial" />
          {errors.sector && <p className="text-sm text-red-500 mt-1">{errors.sector.message}</p>}
        </div>
        <div>
          <Label>Tamaño *</Label>
          <Select onValueChange={v => setValue('tamano', v as FormData['tamano'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar tamaño" /></SelectTrigger>
            <SelectContent>
              {['Micro', 'Pequeña', 'Mediana', 'Grande'].map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tamano && <p className="text-sm text-red-500 mt-1">{errors.tamano.message}</p>}
        </div>
        <div>
          <Label>Número de Empleados *</Label>
          <Input type="number" {...register('numEmpleados', { valueAsNumber: true })} placeholder="0" />
          {errors.numEmpleados && <p className="text-sm text-red-500 mt-1">{errors.numEmpleados.message}</p>}
        </div>
        <div>
          <Label>Teléfono</Label>
          <Input {...register('telefono')} placeholder="+57 ..." />
        </div>
        <div>
          <Label>Email *</Label>
          <Input type="email" {...register('email')} placeholder="email@empresa.com" />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label>Dirección</Label>
          <Input {...register('direccion')} placeholder="Dirección" />
        </div>
        <div>
          <Label>Ciudad</Label>
          <Input {...register('ciudad')} placeholder="Ciudad" />
        </div>
        <div>
          <Label>País</Label>
          <Input {...register('pais')} />
        </div>
        <div>
          <Label>Estado</Label>
          <Select defaultValue="Prospecto" onValueChange={v => setValue('estado', v as FormData['estado'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['Prospecto', 'Activo', 'Inactivo', 'Ex-cliente'].map(e => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Consultor Asignado *</Label>
          <Input {...register('consultorAsignado')} placeholder="Nombre del consultor" />
          {errors.consultorAsignado && <p className="text-sm text-red-500 mt-1">{errors.consultorAsignado.message}</p>}
        </div>
      </div>
    </CrmFormWrapper>
  )
}
