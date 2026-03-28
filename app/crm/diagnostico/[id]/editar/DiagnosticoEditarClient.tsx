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

const MOTIVACIONES = [
  'Clientes / contratos',
  'Licitaciones',
  'Cumplimiento legal',
  'Mejora interna',
  'Imagen / reputación',
  'Otro',
]

const SERVICIOS = [
  'Implementación completa hasta certificación',
  'Apoyo puntual (diagnóstico, documentación, capacitación)',
  'Auditorías internas independientes',
  'Acompañamiento en auditoría de certificación',
  'Mantenimiento y mejora del sistema certificado',
]

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="md:col-span-2 border-b border-slate-700 pb-2 mt-4">
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}

export default function DiagnosticoEditarClient({ diagnostico: d }: { diagnostico: CrmDiagnostico }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [normas, setNormas] = useState<string[]>(d.normas || [])
  const [motivacion, setMotivacion] = useState<string[]>(d.motivacion || [])
  const [serviciosBuscados, setServiciosBuscados] = useState<string[]>(d.serviciosBuscados || [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(diagnosticoSchema) as any,
    defaultValues: {
      clienteId: d.cliente?._id || '',
      clienteNombre: d.clienteNombre,
      normas: d.normas || [],
      estado: d.estado,
      fechaVisita: d.fechaVisita,
      consultorAsignado: d.consultorAsignado,
      // Sección 1
      actividadPrincipal: d.actividadPrincipal,
      mercadosOperacion: d.mercadosOperacion,
      numSedes: d.numSedes,
      nivelRegulacion: d.nivelRegulacion,
      // Sección 2
      certificacionesExistentes: d.certificacionesExistentes,
      situacionCalidad: d.situacionCalidad,
      situacionAmbiental: d.situacionAmbiental,
      situacionSST: d.situacionSST,
      responsableInterno: d.responsableInterno,
      // Sección 3
      motivacion: d.motivacion || [],
      objetivosPrincipales: d.objetivosPrincipales,
      fechaObjetivoCertificacion: d.fechaObjetivoCertificacion,
      experienciaPrevia: d.experienciaPrevia,
      // Sección 4
      alcancePropuesto: d.alcancePropuesto,
      recursosInternos: d.recursosInternos,
      modalidadPreferida: d.modalidadPreferida,
      restricciones: d.restricciones,
      // Sección 5
      serviciosBuscados: d.serviciosBuscados || [],
      enfoqueAuditoria: d.enfoqueAuditoria,
      temasCapacitacion: d.temasCapacitacion,
      // Resultados
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

  const toggleMotivacion = (item: string) => {
    const updated = motivacion.includes(item) ? motivacion.filter(m => m !== item) : [...motivacion, item]
    setMotivacion(updated)
    setValue('motivacion', updated)
  }

  const toggleServicio = (item: string) => {
    const updated = serviciosBuscados.includes(item) ? serviciosBuscados.filter(s => s !== item) : [...serviciosBuscados, item]
    setServiciosBuscados(updated)
    setValue('serviciosBuscados', updated)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { clienteId, ...rest } = data
      const res = await fetch(`/api/crm/diagnosticos/${d._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rest, cliente: { _type: 'reference', _ref: clienteId } }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Error al actualizar') }
      toast.success('Diagnóstico actualizado')
      router.push(`/crm/diagnostico/${d._id}`)
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title={`Editar: ${d.codigo}`} backHref={`/crm/diagnostico/${d._id}`} onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* — General — */}
        <SectionHeader title="General" />

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
            <SelectContent>
              {['Programado', 'En ejecución', 'Completado', 'Cancelado'].map(e => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label>Normas de interés</Label>
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

        <div>
          <Label>Fecha de visita / llamada</Label>
          <Input type="date" {...register('fechaVisita')} />
        </div>

        <div>
          <Label>Consultor asignado</Label>
          <Input {...register('consultorAsignado')} />
        </div>

        {/* — Sección 1: Sobre la empresa — */}
        <SectionHeader title="1. Sobre la empresa" subtitle="Actividad, mercados, tamaño y nivel de regulación" />

        <div className="md:col-span-2">
          <Label>Actividad principal / Productos o servicios</Label>
          <Textarea {...register('actividadPrincipal')} rows={2} />
        </div>

        <div>
          <Label>Mercados / sectores donde opera</Label>
          <Input {...register('mercadosOperacion')} />
        </div>

        <div>
          <Label>Número de sedes</Label>
          <Input type="number" min={1} {...register('numSedes', { valueAsNumber: true })} />
        </div>

        <div>
          <Label>Nivel de regulación del sector</Label>
          <Select defaultValue={d.nivelRegulacion || ''} onValueChange={v => setValue('nivelRegulacion', v as FormData['nivelRegulacion'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              {['Alto', 'Medio', 'Bajo'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* — Sección 2: Situación actual — */}
        <SectionHeader title="2. Situación actual frente a las normas" subtitle="Certificaciones existentes, estado en calidad, ambiental y SST" />

        <div className="md:col-span-2">
          <Label>Certificaciones ISO ya obtenidas</Label>
          <Textarea {...register('certificacionesExistentes')} rows={2} />
        </div>

        <div>
          <Label>Responsable interno del sistema de gestión</Label>
          <Input {...register('responsableInterno')} />
        </div>

        <div className="md:col-span-2">
          <Label>Situación en Calidad (ISO 9001)</Label>
          <Textarea {...register('situacionCalidad')} rows={3} />
        </div>

        <div className="md:col-span-2">
          <Label>Situación Ambiental (ISO 14001)</Label>
          <Textarea {...register('situacionAmbiental')} rows={3} />
        </div>

        <div className="md:col-span-2">
          <Label>Situación SST (ISO 45001)</Label>
          <Textarea {...register('situacionSST')} rows={3} />
        </div>

        {/* — Sección 3: Necesidades y objetivos — */}
        <SectionHeader title="3. Necesidades y objetivos" subtitle="Motivación, metas, fecha objetivo y experiencia previa" />

        <div className="md:col-span-2">
          <Label>Motivación para buscar el servicio</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {MOTIVACIONES.map(m => (
              <label key={m} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={motivacion.includes(m)} onCheckedChange={() => toggleMotivacion(m)} />
                <span className="text-sm">{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <Label>Objetivos principales</Label>
          <Textarea {...register('objetivosPrincipales')} rows={3} />
        </div>

        <div>
          <Label>Fecha objetivo de certificación</Label>
          <Input type="date" {...register('fechaObjetivoCertificacion')} />
        </div>

        <div className="md:col-span-2">
          <Label>Experiencia previa con consultores o auditorías externas</Label>
          <Textarea {...register('experienciaPrevia')} rows={3} />
        </div>

        {/* — Sección 4: Alcance, recursos y restricciones — */}
        <SectionHeader title="4. Alcance, recursos y restricciones" subtitle="Procesos a incluir, recursos disponibles y modalidad de trabajo" />

        <div className="md:col-span-2">
          <Label>Alcance propuesto (procesos y/o sedes)</Label>
          <Textarea {...register('alcancePropuesto')} rows={3} />
        </div>

        <div className="md:col-span-2">
          <Label>Recursos internos disponibles</Label>
          <Textarea {...register('recursosInternos')} rows={3} />
        </div>

        <div>
          <Label>Modalidad preferida</Label>
          <Select defaultValue={d.modalidadPreferida || ''} onValueChange={v => setValue('modalidadPreferida', v as FormData['modalidadPreferida'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              {['Presencial', 'Virtual', 'Híbrido'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label>Restricciones relevantes</Label>
          <Textarea {...register('restricciones')} rows={2} />
        </div>

        {/* — Sección 5: Servicios que buscan — */}
        <SectionHeader title="5. Servicios que buscan" subtitle="Tipo de servicio, enfoque de auditoría y capacitación" />

        <div className="md:col-span-2">
          <Label>Servicios buscados</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {SERVICIOS.map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={serviciosBuscados.includes(s)} onCheckedChange={() => toggleServicio(s)} />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label>Enfoque de auditoría interna</Label>
          <Select defaultValue={d.enfoqueAuditoria || ''} onValueChange={v => setValue('enfoqueAuditoria', v as FormData['enfoqueAuditoria'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar (si aplica)" /></SelectTrigger>
            <SelectContent>
              {['Integral (9001, 14001, 45001)', 'Por norma', 'Procesos críticos'].map(v => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label>Temas de capacitación prioritarios</Label>
          <Textarea {...register('temasCapacitacion')} rows={2} />
        </div>

        {/* — Resultados del diagnóstico — */}
        <SectionHeader title="Resultados del diagnóstico" subtitle="Completar tras finalizar el análisis" />

        <div>
          <Label>Cumplimiento Global (%)</Label>
          <Input type="number" min={0} max={100} {...register('cumplimientoGlobal', { valueAsNumber: true })} />
        </div>

        <div>
          <Label>Viabilidad</Label>
          <Select defaultValue={d.viabilidad || ''} onValueChange={v => setValue('viabilidad', v as FormData['viabilidad'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              {['Alta', 'Media', 'Baja'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tiempo Estimado (meses)</Label>
          <Input type="number" {...register('tiempoEstimado', { valueAsNumber: true })} />
        </div>

        <div>
          <Label>Inversión Estimada (COP)</Label>
          <Input type="number" {...register('inversionEstimada', { valueAsNumber: true })} />
        </div>

        <div className="md:col-span-2">
          <Label>Resumen Ejecutivo</Label>
          <Textarea {...register('resumenEjecutivo')} rows={4} />
        </div>

      </div>
    </CrmFormWrapper>
  )
}
