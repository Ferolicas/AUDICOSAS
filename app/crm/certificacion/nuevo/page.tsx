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
import type { z } from "zod"

type FormData = z.infer<typeof certificacionSchema>
const NORMAS = ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 27001:2022', 'ISO 50001:2018']

export default function NuevaCertificacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [normas, setNormas] = useState<string[]>([])
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(certificacionSchema),
    defaultValues: { estado: 'Activo', faseActual: 1, avanceGlobal: 0, prioridad: 'Media', normas: [], clienteId: '', clienteNombre: '' },
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
      const res = await fetch('/api/crm/certificaciones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      toast.success('Proyecto de certificación creado')
      router.push('/crm/certificacion')
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title="Nueva Certificación" backHref="/crm/certificacion" onSubmit={handleSubmit(onSubmit)} loading={loading}>
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
        <div><Label>Consultor Líder *</Label><Input {...register('consultorLider')} placeholder="Nombre" /></div>
        <div>
          <Label>Prioridad</Label>
          <Select defaultValue="Media" onValueChange={v => setValue('prioridad', v as FormData['prioridad'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{['Urgente', 'Alta', 'Media', 'Baja'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Fecha Inicio *</Label><Input type="date" {...register('fechaInicio')} /></div>
        <div><Label>Fecha Objetivo *</Label><Input type="date" {...register('fechaObjetivo')} /></div>
        <div><Label>Valor Proyecto (COP) *</Label><Input type="number" {...register('valorProyecto', { valueAsNumber: true })} placeholder="0" /></div>
        <div><Label>Diagnóstico Origen (ID)</Label><Input {...register('diagnosticoOrigen')} placeholder="Opcional" /></div>
      </div>
    </CrmFormWrapper>
  )
}
