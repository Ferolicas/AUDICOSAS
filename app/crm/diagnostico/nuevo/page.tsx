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

export default function NuevoDiagnosticoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [normas, setNormas] = useState<string[]>([])
  const [motivacion, setMotivacion] = useState<string[]>([])
  const [serviciosBuscados, setServiciosBuscados] = useState<string[]>([])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(diagnosticoSchema) as any,
    defaultValues: {
      estado: 'Programado',
      normas: [],
      clienteId: '',
      clienteNombre: '',
      motivacion: [],
      serviciosBuscados: [],
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
      const res = await fetch('/api/crm/diagnosticos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      toast.success('Diagnóstico creado')
      router.push('/crm/diagnostico')
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  return (
    <CrmFormWrapper title="Nuevo Diagnóstico" backHref="/crm/diagnostico" onSubmit={handleSubmit(onSubmit)} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* — General — */}
        <SectionHeader title="General" />

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
          <Label>Normas de interés *</Label>
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
          <Label>Fecha de visita / llamada *</Label>
          <Input type="date" {...register('fechaVisita')} />
          {errors.fechaVisita && <p className="text-sm text-red-500 mt-1">{errors.fechaVisita.message}</p>}
        </div>

        <div>
          <Label>Consultor asignado *</Label>
          <Input {...register('consultorAsignado')} placeholder="Nombre del consultor" />
          {errors.consultorAsignado && <p className="text-sm text-red-500 mt-1">{errors.consultorAsignado.message}</p>}
        </div>

        {/* — Sección 1: Sobre la empresa — */}
        <SectionHeader
          title="1. Sobre la empresa"
          subtitle="Actividad, mercados, tamaño y nivel de regulación"
        />

        <div className="md:col-span-2">
          <Label>Actividad principal / Productos o servicios</Label>
          <Textarea {...register('actividadPrincipal')} rows={2} placeholder="¿A qué se dedica la organización?" />
        </div>

        <div>
          <Label>Mercados / sectores donde opera</Label>
          <Input {...register('mercadosOperacion')} placeholder="Ej: construcción, salud, manufactura..." />
        </div>

        <div>
          <Label>Número de sedes</Label>
          <Input type="number" min={1} {...register('numSedes', { valueAsNumber: true })} placeholder="1" />
        </div>

        <div>
          <Label>Nivel de regulación del sector</Label>
          <Select onValueChange={v => setValue('nivelRegulacion', v as FormData['nivelRegulacion'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              {['Alto', 'Medio', 'Bajo'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* — Sección 2: Situación actual — */}
        <SectionHeader
          title="2. Situación actual frente a las normas"
          subtitle="Certificaciones existentes, estado en calidad, ambiental y SST"
        />

        <div className="md:col-span-2">
          <Label>Certificaciones ISO ya obtenidas</Label>
          <Textarea {...register('certificacionesExistentes')} rows={2} placeholder="¿Tienen alguna certificación ISO vigente? ¿Cuál? ¿Con qué organismo?" />
        </div>

        <div>
          <Label>Responsable interno del sistema de gestión</Label>
          <Input {...register('responsableInterno')} placeholder="Nombre y cargo" />
        </div>

        <div className="md:col-span-2">
          <Label>Situación en Calidad (ISO 9001)</Label>
          <Textarea {...register('situacionCalidad')} rows={3} placeholder="¿Procesos definidos y documentados? ¿Medición de satisfacción del cliente? ¿Gestión de quejas/no conformidades?" />
        </div>

        <div className="md:col-span-2">
          <Label>Situación Ambiental (ISO 14001)</Label>
          <Textarea {...register('situacionAmbiental')} rows={3} placeholder="¿Aspectos e impactos identificados? ¿Permisos/licencias ambientales vigentes?" />
        </div>

        <div className="md:col-span-2">
          <Label>Situación SST (ISO 45001)</Label>
          <Textarea {...register('situacionSST')} rows={3} placeholder="¿Matriz de peligros actualizada? ¿Investigación de incidentes? ¿Programas de capacitación en SST?" />
        </div>

        {/* — Sección 3: Necesidades y objetivos — */}
        <SectionHeader
          title="3. Necesidades y objetivos"
          subtitle="Motivación, metas, fecha objetivo y experiencia previa"
        />

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
          <Textarea {...register('objetivosPrincipales')} rows={3} placeholder="Ej: reducir reprocesos, disminuir impactos ambientales, mejorar la seguridad, acceder a nuevos mercados..." />
        </div>

        <div>
          <Label>Fecha objetivo de certificación</Label>
          <Input type="date" {...register('fechaObjetivoCertificacion')} />
        </div>

        <div className="md:col-span-2">
          <Label>Experiencia previa con consultores o auditorías externas</Label>
          <Textarea {...register('experienciaPrevia')} rows={3} placeholder="¿Han trabajado antes con consultores? ¿Qué les gustó y qué les gustaría evitar esta vez?" />
        </div>

        {/* — Sección 4: Alcance, recursos y restricciones — */}
        <SectionHeader
          title="4. Alcance, recursos y restricciones"
          subtitle="Procesos a incluir, recursos disponibles y modalidad de trabajo"
        />

        <div className="md:col-span-2">
          <Label>Alcance propuesto (procesos y/o sedes)</Label>
          <Textarea {...register('alcancePropuesto')} rows={3} placeholder="¿Qué procesos y sedes desean incluir en el alcance de certificación?" />
        </div>

        <div className="md:col-span-2">
          <Label>Recursos internos disponibles</Label>
          <Textarea {...register('recursosInternos')} rows={3} placeholder="Tiempo de la dirección, responsable del sistema, apoyo de jefes de área, presupuesto aproximado..." />
        </div>

        <div>
          <Label>Modalidad preferida</Label>
          <Select onValueChange={v => setValue('modalidadPreferida', v as FormData['modalidadPreferida'])}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              {['Presencial', 'Virtual', 'Híbrido'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label>Restricciones relevantes</Label>
          <Textarea {...register('restricciones')} rows={2} placeholder="Turnos, operación en campo, idiomas, requisitos de seguridad industrial para visitas, etc." />
        </div>

        {/* — Sección 5: Servicios que buscan — */}
        <SectionHeader
          title="5. Servicios que buscan"
          subtitle="Tipo de servicio, enfoque de auditoría y capacitación"
        />

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
          <Select onValueChange={v => setValue('enfoqueAuditoria', v as FormData['enfoqueAuditoria'])}>
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
          <Textarea {...register('temasCapacitacion')} rows={2} placeholder="Interpretación de normas, formación de auditores internos, enfoque basado en riesgos, gestión de incidentes..." />
        </div>

      </div>
    </CrmFormWrapper>
  )
}
