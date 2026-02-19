"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { consultoriaSchema } from "@/lib/crm/schemas"
import { Input } from "@/components/crm/ui/input"
import { Label } from "@/components/crm/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/crm/ui/select"
import { Checkbox } from "@/components/crm/ui/checkbox"
import { CrmFormWrapper } from "@/components/crm/shared/CrmFormWrapper"
import { ClienteSelector } from "@/components/crm/shared/ClienteSelector"
import { toast } from "sonner"
import type { CrmConsultoria } from "@/lib/crm/types"
import type { z } from "zod"

type FormData = z.infer<typeof consultoriaSchema>
const NORMAS = ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 27001:2022', 'ISO 50001:2018']
const TIPOS: FormData['tipo'][] = ['Implementación SGC', 'Mantenimiento', 'Mejora continua', 'Integración normas', 'Otro']

export default function ConsultoriaEditarClient({ consultoria: c }: { consultoria: CrmConsultoria }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [normas, setNormas] = useState<string[]>(c.normas || [])
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(consultoriaSchema),
    defaultValues: {
      clienteId: c.cliente?._id || '',
      clienteNombre: c.clienteNombre,
      tipo: c.tipo,
      normas: c.normas || [],
      consultorLider: c.consultorLider,
      fechaInicio: c.fechaInicio,
      fechaFinPlan: c.fechaFinPlan,
      estado: c.estado,
      valorContratado: c.valorContratado,
      avance: c.avance,
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
      const res = await fetch(`/api/crm/consultorias/${c._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rest, cliente: { _type: 'reference', _ref: clienteId } }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Error al actualizar') }
      toast.success('Consultoría actualizada')
      router.push(`/crm/consultoria/${c._id}`)
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title={`Editar: ${c.codigo}`} backHref={`/crm/consultoria/${c._id}`} onSubmit={handleSubmit(onSubmit)} loading={loading}>
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
          <Label>Tipo</Label>
          <Select defaultValue={c.tipo} onValueChange={v => setValue('tipo', v as FormData['tipo'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Consultor Líder</Label><Input {...register('consultorLider')} /></div>
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
        <div>
          <Label>Estado</Label>
          <Select defaultValue={c.estado} onValueChange={v => setValue('estado', v as FormData['estado'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Propuesta', 'Activo', 'Pausado', 'Completado', 'Cancelado'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Fecha Inicio</Label><Input type="date" {...register('fechaInicio')} /></div>
        <div><Label>Fecha Fin Plan</Label><Input type="date" {...register('fechaFinPlan')} /></div>
        <div><Label>Valor Contratado (COP)</Label><Input type="number" {...register('valorContratado', { valueAsNumber: true })} /></div>
        <div><Label>Avance (%)</Label><Input type="number" {...register('avance', { valueAsNumber: true })} min={0} max={100} /></div>
      </div>
    </CrmFormWrapper>
  )
}
