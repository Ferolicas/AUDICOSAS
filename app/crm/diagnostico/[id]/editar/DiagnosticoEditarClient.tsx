"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { diagnosticoSchema } from "@/lib/crm/schemas"
import { Input } from "@/components/crm/ui/input"
import { Label } from "@/components/crm/ui/label"
import { Textarea } from "@/components/crm/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/crm/ui/select"
import { Checkbox } from "@/components/crm/ui/checkbox"
import { CrmFormWrapper } from "@/components/crm/shared/CrmFormWrapper"
import { ClienteSelector } from "@/components/crm/shared/ClienteSelector"
import { toast } from "sonner"
import type { CrmDiagnostico } from "@/lib/crm/types"
import type { z } from "zod"

type FormData = z.infer<typeof diagnosticoSchema>
const NORMAS = ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 27001:2022', 'ISO 50001:2018']

export default function DiagnosticoEditarClient({ diagnostico: d }: { diagnostico: CrmDiagnostico }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [normas, setNormas] = useState<string[]>(d.normas || [])
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(diagnosticoSchema),
    defaultValues: {
      clienteId: d.cliente?._ref || '',
      clienteNombre: d.clienteNombre,
      normas: d.normas || [],
      estado: d.estado,
      fechaVisita: d.fechaVisita,
      consultorAsignado: d.consultorAsignado,
      cumplimientoGlobal: d.cumplimientoGlobal,
      viabilidad: d.viabilidad,
      tiempoEstimado: d.tiempoEstimado,
      inversionEstimada: d.inversionEstimada,
      resumenEjecutivo: d.resumenEjecutivo,
    },
  })

  const clienteId = watch('clienteId')
  const clienteNombre = watch('clienteNombre')

  const toggleNorma = (norma: string) => {
    const updated = normas.includes(norma) ? normas.filter(n => n !== norma) : [...normas, norma]
    setNormas(updated)
    setValue('normas', updated)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { clienteId, ...rest } = data
      const res = await fetch(`/api/crm/diagnosticos/${d._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rest, cliente: { _type: 'reference', _ref: clienteId } }),
      })
      if (!res.ok) throw new Error('Error al actualizar')
      toast.success('Diagnóstico actualizado')
      router.push(`/crm/diagnostico/${d._id}`)
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title={`Editar: ${d.codigo}`} backHref={`/crm/diagnostico/${d._id}`} onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Cliente</Label>
          <ClienteSelector
            value={clienteId}
            clienteNombre={clienteNombre}
            onSelect={(id, nombre) => { setValue('clienteId', id); setValue('clienteNombre', nombre) }}
          />
        </div>
        <div>
          <Label>Estado</Label>
          <Select defaultValue={d.estado} onValueChange={v => setValue('estado', v as FormData['estado'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Programado', 'En ejecución', 'Completado', 'Cancelado'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label>Normas</Label>
          <div className="flex gap-4 flex-wrap mt-2">
            {NORMAS.map(n => (
              <label key={n} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={normas.includes(n)} onCheckedChange={() => toggleNorma(n)} /><span className="text-sm">{n}</span>
              </label>
            ))}
          </div>
        </div>
        <div><Label>Fecha de Visita</Label><Input type="date" {...register('fechaVisita')} /></div>
        <div><Label>Consultor Asignado</Label><Input {...register('consultorAsignado')} /></div>
        <div><Label>Cumplimiento Global (%)</Label><Input type="number" {...register('cumplimientoGlobal', { valueAsNumber: true })} /></div>
        <div>
          <Label>Viabilidad</Label>
          <Select defaultValue={d.viabilidad || ''} onValueChange={v => setValue('viabilidad', v as FormData['viabilidad'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>{['Alta', 'Media', 'Baja'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Tiempo Estimado (meses)</Label><Input type="number" {...register('tiempoEstimado', { valueAsNumber: true })} /></div>
        <div><Label>Inversión Estimada (COP)</Label><Input type="number" {...register('inversionEstimada', { valueAsNumber: true })} /></div>
        <div className="md:col-span-2"><Label>Resumen Ejecutivo</Label><Textarea {...register('resumenEjecutivo')} rows={4} /></div>
      </div>
    </CrmFormWrapper>
  )
}
