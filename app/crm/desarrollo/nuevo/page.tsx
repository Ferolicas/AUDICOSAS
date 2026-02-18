"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { desarrolloSchema } from "@/lib/crm/schemas"
import { Input } from "@/components/crm/ui/input"
import { Label } from "@/components/crm/ui/label"
import { Textarea } from "@/components/crm/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/crm/ui/select"
import { CrmFormWrapper } from "@/components/crm/shared/CrmFormWrapper"
import { toast } from "sonner"
import type { z } from "zod"

type FormData = z.infer<typeof desarrolloSchema>
const CATEGORIAS: FormData['categoria'][] = ['Mejora de servicios', 'Nuevo producto', 'Proceso interno', 'Marketing', 'Tecnología', 'Otro']

export default function NuevoDesarrolloPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(desarrolloSchema),
    defaultValues: { estado: 'Por hacer', prioridad: 'Media', avance: 0 },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/crm/desarrollo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      toast.success('Proyecto de desarrollo creado')
      router.push('/crm/desarrollo')
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title="Nuevo Proyecto de Desarrollo" backHref="/crm/desarrollo" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><Label>Nombre *</Label><Input {...register('nombre')} placeholder="Nombre del proyecto" />{errors.nombre && <p className="text-sm text-red-500 mt-1">{errors.nombre.message}</p>}</div>
        <div className="md:col-span-2"><Label>Descripción *</Label><Textarea {...register('descripcion')} rows={3} placeholder="Descripción del proyecto" />{errors.descripcion && <p className="text-sm text-red-500 mt-1">{errors.descripcion.message}</p>}</div>
        <div>
          <Label>Categoría *</Label>
          <Select onValueChange={v => setValue('categoria', v as FormData['categoria'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>{CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          {errors.categoria && <p className="text-sm text-red-500 mt-1">{errors.categoria.message}</p>}
        </div>
        <div>
          <Label>Prioridad</Label>
          <Select defaultValue="Media" onValueChange={v => setValue('prioridad', v as FormData['prioridad'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Urgente', 'Alta', 'Media', 'Baja'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Responsable *</Label><Input {...register('responsable')} placeholder="Nombre del responsable" /></div>
        <div><Label>Fecha Inicio *</Label><Input type="date" {...register('fechaInicio')} /></div>
        <div><Label>Fecha Límite *</Label><Input type="date" {...register('fechaLimite')} /></div>
      </div>
    </CrmFormWrapper>
  )
}
