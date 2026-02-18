"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { certificacionSchema } from "@/lib/crm/schemas"
import { Input } from "@/components/crm/ui/input"
import { Label } from "@/components/crm/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/crm/ui/select"
import { Checkbox } from "@/components/crm/ui/checkbox"
import { CrmFormWrapper } from "@/components/crm/shared/CrmFormWrapper"
import { ClienteSelector } from "@/components/crm/shared/ClienteSelector"
import { toast } from "sonner"
import type { CrmCertificacion } from "@/lib/crm/types"
import type { z } from "zod"

type FormData = z.infer<typeof certificacionSchema>
const NORMAS = ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 27001:2022', 'ISO 50001:2018']

export default function CertificacionEditarClient({ certificacion: c }: { certificacion: CrmCertificacion }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [normas, setNormas] = useState<string[]>(c.normas || [])
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(certificacionSchema),
    defaultValues: {
      clienteId: c.cliente?._ref || '',
      clienteNombre: c.clienteNombre,
      normas: c.normas || [],
      faseActual: c.faseActual,
      avanceGlobal: c.avanceGlobal,
      consultorLider: c.consultorLider,
      fechaInicio: c.fechaInicio,
      fechaObjetivo: c.fechaObjetivo,
      estado: c.estado,
      valorProyecto: c.valorProyecto,
      prioridad: c.prioridad,
      diagnosticoOrigen: c.diagnosticoOrigen,
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
      const res = await fetch(`/api/crm/certificaciones/${c._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rest, cliente: { _type: 'reference', _ref: clienteId } }),
      })
      if (!res.ok) throw new Error('Error al actualizar')
      toast.success('Certificación actualizada')
      router.push(`/crm/certificacion/${c._id}`)
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title={`Editar: ${c.codigo}`} backHref={`/crm/certificacion/${c._id}`} onSubmit={handleSubmit(onSubmit)} loading={loading}>
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
          <Select defaultValue={c.estado} onValueChange={v => setValue('estado', v as FormData['estado'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Activo', 'Pausado', 'Completado', 'Cancelado'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
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
        <div><Label>Fase Actual (1-5)</Label><Input type="number" {...register('faseActual', { valueAsNumber: true })} min={1} max={5} /></div>
        <div><Label>Avance Global (%)</Label><Input type="number" {...register('avanceGlobal', { valueAsNumber: true })} min={0} max={100} /></div>
        <div><Label>Consultor Líder</Label><Input {...register('consultorLider')} /></div>
        <div>
          <Label>Prioridad</Label>
          <Select defaultValue={c.prioridad} onValueChange={v => setValue('prioridad', v as FormData['prioridad'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Urgente', 'Alta', 'Media', 'Baja'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Fecha Inicio</Label><Input type="date" {...register('fechaInicio')} /></div>
        <div><Label>Fecha Objetivo</Label><Input type="date" {...register('fechaObjetivo')} /></div>
        <div><Label>Valor Proyecto (COP)</Label><Input type="number" {...register('valorProyecto', { valueAsNumber: true })} /></div>
        <div><Label>Diagnóstico Origen (ID)</Label><Input {...register('diagnosticoOrigen')} /></div>
      </div>
    </CrmFormWrapper>
  )
}
