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
import type { z } from "zod"

type FormData = z.infer<typeof auditoriaSchema>
const NORMAS = ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 27001:2022', 'ISO 50001:2018']
const TIPOS: FormData['tipo'][] = ['Primera parte (interna)', 'Segunda parte (proveedores)', 'Tercera parte (certificación)']

export default function NuevaAuditoriaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [normas, setNormas] = useState<string[]>([])
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(auditoriaSchema),
    defaultValues: { estado: 'Planificada', normas: [], clienteId: '', clienteNombre: '' },
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
      const res = await fetch('/api/crm/auditorias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      toast.success('Auditoría creada')
      router.push('/crm/auditoria')
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title="Nueva Auditoría" backHref="/crm/auditoria" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Cliente *</Label>
          <ClienteSelector
            value={clienteId}
            clienteNombre={clienteNombre}
            onSelect={(id, nombre) => { setValue('clienteId', id); setValue('clienteNombre', nombre) }}
            error={errors.clienteId?.message}
          />
        </div>
        <div>
          <Label>Tipo *</Label>
          <Select onValueChange={v => setValue('tipo', v as FormData['tipo'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
            <SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          {errors.tipo && <p className="text-sm text-red-500 mt-1">{errors.tipo.message}</p>}
        </div>
        <div><Label>Auditor Líder *</Label><Input {...register('auditorLider')} placeholder="Nombre del auditor" /></div>
        <div className="md:col-span-2">
          <Label>Normas *</Label>
          <div className="flex gap-4 flex-wrap mt-2">
            {NORMAS.map(n => (
              <label key={n} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={normas.includes(n)} onCheckedChange={() => toggleNorma(n)} />
                <span className="text-sm">{n}</span>
              </label>
            ))}
          </div>
          {errors.normas && <p className="text-sm text-red-500 mt-1">{errors.normas.message}</p>}
        </div>
        <div><Label>Fecha Inicio *</Label><Input type="date" {...register('fechaInicio')} /></div>
        <div><Label>Fecha Fin *</Label><Input type="date" {...register('fechaFin')} /></div>
      </div>
    </CrmFormWrapper>
  )
}
