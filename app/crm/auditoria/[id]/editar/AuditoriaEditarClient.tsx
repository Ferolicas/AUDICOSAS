"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { auditoriaSchema } from "@/lib/crm/schemas"
import { Input } from "@/components/crm/ui/input"
import { Label } from "@/components/crm/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/crm/ui/select"
import { Checkbox } from "@/components/crm/ui/checkbox"
import { CrmFormWrapper } from "@/components/crm/shared/CrmFormWrapper"
import { ClienteSelector } from "@/components/crm/shared/ClienteSelector"
import { toast } from "sonner"
import type { CrmAuditoria } from "@/lib/crm/types"
import type { z } from "zod"

type FormData = z.infer<typeof auditoriaSchema>
const NORMAS = ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 27001:2022', 'ISO 50001:2018']
const TIPOS: FormData['tipo'][] = ['Primera parte (interna)', 'Segunda parte (proveedores)', 'Tercera parte (certificación)']

export default function AuditoriaEditarClient({ auditoria: a }: { auditoria: CrmAuditoria }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [normas, setNormas] = useState<string[]>(a.normas || [])
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(auditoriaSchema),
    defaultValues: {
      clienteId: a.cliente?._ref || '',
      clienteNombre: a.clienteNombre,
      tipo: a.tipo,
      normas: a.normas || [],
      fechaInicio: a.fechaInicio,
      fechaFin: a.fechaFin,
      auditorLider: a.auditorLider,
      estado: a.estado,
      numNCMayores: a.numNCMayores,
      numNCMenores: a.numNCMenores,
      numObservaciones: a.numObservaciones,
      resultado: a.resultado,
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
      const res = await fetch(`/api/crm/auditorias/${a._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rest, cliente: { _type: 'reference', _ref: clienteId } }),
      })
      if (!res.ok) throw new Error('Error al actualizar')
      toast.success('Auditoría actualizada')
      router.push(`/crm/auditoria/${a._id}`)
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title={`Editar: ${a.codigo}`} backHref={`/crm/auditoria/${a._id}`} onSubmit={handleSubmit(onSubmit)} loading={loading}>
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
          <Select defaultValue={a.tipo} onValueChange={v => setValue('tipo', v as FormData['tipo'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Auditor Líder</Label><Input {...register('auditorLider')} /></div>
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
        <div><Label>Fecha Inicio</Label><Input type="date" {...register('fechaInicio')} /></div>
        <div><Label>Fecha Fin</Label><Input type="date" {...register('fechaFin')} /></div>
        <div>
          <Label>Estado</Label>
          <Select defaultValue={a.estado} onValueChange={v => setValue('estado', v as FormData['estado'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Planificada', 'En ejecución', 'Completada', 'Cancelada'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>NC Mayores</Label><Input type="number" {...register('numNCMayores', { valueAsNumber: true })} min={0} /></div>
        <div><Label>NC Menores</Label><Input type="number" {...register('numNCMenores', { valueAsNumber: true })} min={0} /></div>
        <div><Label>Observaciones</Label><Input type="number" {...register('numObservaciones', { valueAsNumber: true })} min={0} /></div>
        <div>
          <Label>Resultado</Label>
          <Select defaultValue={a.resultado || ''} onValueChange={v => setValue('resultado', v as FormData['resultado'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>{['Conforme', 'No conforme', 'Conforme con observaciones'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
    </CrmFormWrapper>
  )
}
