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
import type { CrmCapacitacion } from "@/lib/crm/types"
import type { z } from "zod"

type FormData = z.infer<typeof capacitacionSchema>
const TIPOS: FormData['tipo'][] = ['Sensibilización', 'Implementación', 'Auditor interno', 'Interpretación norma', 'Herramientas', 'Otro']
const MODALIDADES: FormData['modalidad'][] = ['Presencial', 'Virtual', 'Híbrido']

export default function CapacitacionEditarClient({ capacitacion: c }: { capacitacion: CrmCapacitacion }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(capacitacionSchema),
    defaultValues: {
      cursoNombre: c.cursoNombre,
      tipo: c.tipo,
      clienteId: c.cliente?._id || '',
      clienteNombre: c.clienteNombre,
      instructor: c.instructor,
      fecha: c.fecha,
      duracionHoras: c.duracionHoras,
      modalidad: c.modalidad,
      numParticipantes: c.numParticipantes,
      estado: c.estado,
    },
  })

  const clienteId = watch('clienteId')
  const clienteNombre = watch('clienteNombre')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { clienteId, ...rest } = data
      const res = await fetch(`/api/crm/capacitaciones/${c._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rest, cliente: { _type: 'reference', _ref: clienteId } }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Error al actualizar') }
      toast.success('Capacitación actualizada')
      router.push(`/crm/capacitaciones/${c._id}`)
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title={`Editar: ${c.codigo}`} backHref={`/crm/capacitaciones/${c._id}`} onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><Label>Nombre del Curso</Label><Input {...register('cursoNombre')} /></div>
        <div>
          <Label>Tipo</Label>
          <Select defaultValue={c.tipo} onValueChange={v => setValue('tipo', v as FormData['tipo'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Modalidad</Label>
          <Select defaultValue={c.modalidad} onValueChange={v => setValue('modalidad', v as FormData['modalidad'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{MODALIDADES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label>Cliente</Label>
          <ClienteSelector
            value={clienteId}
            clienteNombre={clienteNombre}
            onSelect={(id, nombre) => { setValue('clienteId', id); setValue('clienteNombre', nombre) }}
          />
        </div>
        <div><Label>Instructor</Label><Input {...register('instructor')} /></div>
        <div><Label>Fecha</Label><Input type="date" {...register('fecha')} /></div>
        <div><Label>Duración (horas)</Label><Input type="number" {...register('duracionHoras', { valueAsNumber: true })} /></div>
        <div><Label>N° Participantes</Label><Input type="number" {...register('numParticipantes', { valueAsNumber: true })} /></div>
        <div>
          <Label>Estado</Label>
          <Select defaultValue={c.estado} onValueChange={v => setValue('estado', v as FormData['estado'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Programada', 'Ejecutada', 'Cancelada'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
    </CrmFormWrapper>
  )
}
