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
import type { CrmDesarrollo } from "@/lib/crm/types"
import type { z } from "zod"

type FormData = z.infer<typeof desarrolloSchema>
const CATEGORIAS: FormData['categoria'][] = ['Mejora de servicios', 'Nuevo producto', 'Proceso interno', 'Marketing', 'Tecnología', 'Otro']

export default function DesarrolloEditarClient({ desarrollo: d }: { desarrollo: CrmDesarrollo }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(desarrolloSchema),
    defaultValues: {
      nombre: d.nombre,
      descripcion: d.descripcion,
      categoria: d.categoria,
      prioridad: d.prioridad,
      responsable: d.responsable,
      fechaInicio: d.fechaInicio,
      fechaLimite: d.fechaLimite,
      avance: d.avance,
      estado: d.estado,
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/desarrollo/${d._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Error al actualizar')
      toast.success('Proyecto actualizado')
      router.push('/crm/desarrollo')
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title={`Editar: ${d.codigo}`} backHref="/crm/desarrollo" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><Label>Nombre</Label><Input {...register('nombre')} /></div>
        <div className="md:col-span-2"><Label>Descripción</Label><Textarea {...register('descripcion')} rows={3} /></div>
        <div>
          <Label>Categoría</Label>
          <Select defaultValue={d.categoria} onValueChange={v => setValue('categoria', v as FormData['categoria'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Prioridad</Label>
          <Select defaultValue={d.prioridad} onValueChange={v => setValue('prioridad', v as FormData['prioridad'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Urgente', 'Alta', 'Media', 'Baja'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Responsable</Label><Input {...register('responsable')} /></div>
        <div>
          <Label>Estado</Label>
          <Select defaultValue={d.estado} onValueChange={v => setValue('estado', v as FormData['estado'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Por hacer', 'En progreso', 'En revisión', 'Completado'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Fecha Inicio</Label><Input type="date" {...register('fechaInicio')} /></div>
        <div><Label>Fecha Límite</Label><Input type="date" {...register('fechaLimite')} /></div>
        <div><Label>Avance (%)</Label><Input type="number" {...register('avance', { valueAsNumber: true })} min={0} max={100} /></div>
      </div>
    </CrmFormWrapper>
  )
}
