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

interface DiagnosticoOption {
  _id: string
  codigo: string
  normas: string[]
  fechaVisita: string
  inversionEstimada?: number
}

export default function NuevaCertificacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [normas, setNormas] = useState<string[]>([])
  const [diagnosticosCliente, setDiagnosticosCliente] = useState<DiagnosticoOption[]>([])

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

  async function fetchDiagnosticosCliente(id: string) {
    if (!id) { setDiagnosticosCliente([]); return }
    try {
      const res = await fetch(`/api/crm/clientes/${id}/diagnosticos`)
      if (res.ok) {
        const data = await res.json()
        setDiagnosticosCliente(data.diagnosticos || [])
      }
    } catch {
      setDiagnosticosCliente([])
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/crm/certificaciones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      toast.success('Proyecto de certificacion creado')
      router.push('/crm/certificacion')
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title="Nueva Certificacion" backHref="/crm/certificacion" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Cliente *</Label>
          <ClienteSelector
            value={clienteId}
            clienteNombre={clienteNombre}
            onSelect={(id, nombre) => {
              setValue('clienteId', id)
              setValue('clienteNombre', nombre)
              fetchDiagnosticosCliente(id)
            }}
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
        <div><Label>Consultor Lider *</Label><Input {...register('consultorLider')} placeholder="Nombre" /></div>
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
        <div>
          <Label>Diagnostico de Origen</Label>
          <Select
            onValueChange={v => {
              setValue('diagnosticoOrigen', v)
              const diag = diagnosticosCliente.find(d => d._id === v)
              if (diag?.inversionEstimada) {
                setValue('valorProyecto', diag.inversionEstimada)
              }
            }}
            disabled={!clienteId || diagnosticosCliente.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={clienteId ? (diagnosticosCliente.length === 0 ? 'Sin diagnosticos' : 'Seleccionar diagnostico') : 'Primero selecciona un cliente'} />
            </SelectTrigger>
            <SelectContent>
              {diagnosticosCliente.map(d => (
                <SelectItem key={d._id} value={d._id}>
                  {d.codigo} — {d.normas?.join(', ')} ({d.fechaVisita})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CrmFormWrapper>
  )
}
