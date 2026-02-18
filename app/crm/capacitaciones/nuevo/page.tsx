"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { capacitacionSchema } from "@/lib/crm/schemas"
import { Input } from "@/components/crm/ui/input"
import { Label } from "@/components/crm/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/crm/ui/select"
import { CrmFormWrapper } from "@/components/crm/shared/CrmFormWrapper"
import { ClienteSelector } from "@/components/crm/shared/ClienteSelector"
import { toast } from "sonner"
import type { z } from "zod"

type FormData = z.infer<typeof capacitacionSchema>
const TIPOS: FormData['tipo'][] = ['Sensibilización', 'Implementación', 'Auditor interno', 'Interpretación norma', 'Herramientas', 'Otro']
const MODALIDADES: FormData['modalidad'][] = ['Presencial', 'Virtual', 'Híbrido']

export default function NuevaCapacitacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(capacitacionSchema),
    defaultValues: { estado: 'Programada', clienteId: '', clienteNombre: '' },
  })

  const clienteId = watch('clienteId')
  const clienteNombre = watch('clienteNombre')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/crm/capacitaciones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      toast.success('Capacitación creada')
      router.push('/crm/capacitaciones')
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title="Nueva Capacitación" backHref="/crm/capacitaciones" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><Label>Nombre del Curso *</Label><Input {...register('cursoNombre')} placeholder="Ej: Auditor Interno ISO 9001" />{errors.cursoNombre && <p className="text-sm text-red-500 mt-1">{errors.cursoNombre.message}</p>}</div>
        <div>
          <Label>Tipo *</Label>
          <Select onValueChange={v => setValue('tipo', v as FormData['tipo'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
            <SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          {errors.tipo && <p className="text-sm text-red-500 mt-1">{errors.tipo.message}</p>}
        </div>
        <div>
          <Label>Modalidad *</Label>
          <Select onValueChange={v => setValue('modalidad', v as FormData['modalidad'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>{MODALIDADES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          {errors.modalidad && <p className="text-sm text-red-500 mt-1">{errors.modalidad.message}</p>}
        </div>
        <div className="md:col-span-2">
          <Label>Cliente *</Label>
          <ClienteSelector
            value={clienteId}
            clienteNombre={clienteNombre}
            onSelect={(id, nombre) => { setValue('clienteId', id); setValue('clienteNombre', nombre) }}
            error={errors.clienteId?.message}
          />
        </div>
        <div><Label>Instructor *</Label><Input {...register('instructor')} placeholder="Nombre del instructor" /></div>
        <div><Label>Fecha *</Label><Input type="date" {...register('fecha')} /></div>
        <div><Label>Duración (horas) *</Label><Input type="number" {...register('duracionHoras', { valueAsNumber: true })} placeholder="8" /></div>
        <div><Label>N° Participantes *</Label><Input type="number" {...register('numParticipantes', { valueAsNumber: true })} placeholder="15" /></div>
      </div>
    </CrmFormWrapper>
  )
}
