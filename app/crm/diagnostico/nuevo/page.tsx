"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { diagnosticoSchema } from "@/lib/crm/schemas"
import { Input } from "@/components/crm/ui/input"
import { Label } from "@/components/crm/ui/label"
import { Textarea } from "@/components/crm/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/crm/ui/select"
import { Checkbox } from "@/components/crm/ui/checkbox"
import { Button } from "@/components/crm/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/crm/ui/dialog"
import { CrmFormWrapper } from "@/components/crm/shared/CrmFormWrapper"
import { ClienteSelector } from "@/components/crm/shared/ClienteSelector"
import { toast } from "sonner"
import type { z } from "zod"
import { Send } from "lucide-react"

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

const TIERS = [
  { label: 'Microempresa (1-5 empleados)', value: 'micro', price: 8_000_000 },
  { label: 'Microempresa Plus (6-10 empleados)', value: 'micro_plus', price: 9_000_000 },
  { label: 'Pequeña empresa (11-25 empleados)', value: 'pequena', price: 15_000_000 },
  { label: 'Pequeña empresa Plus (26-50 empleados)', value: 'pequena_plus', price: 19_000_000 },
  { label: 'Mediana empresa (51-100 empleados)', value: 'mediana', price: 28_000_000 },
  { label: 'Mediana empresa Plus (101-200 empleados)', value: 'mediana_plus', price: 35_000_000 },
  { label: 'Mediana-Grande (201-300 empleados)', value: 'mediana_grande', price: 55_000_000 },
  { label: 'Mediana-Grande Plus (301-500 empleados)', value: 'mediana_grande_plus', price: 69_000_000 },
  { label: 'Gran empresa (+500 empleados)', value: 'gran', price: 95_000_000 },
]

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

function calcPrecio(
  tierValue: string,
  empleadosAdicionales: number,
  numSedes: number,
  porcentajeProcesos: number,
  aplicarProcesos: boolean,
  incrementoRiesgos: number
): number {
  const tier = TIERS.find(t => t.value === tierValue)
  if (!tier) return 0

  const base = tier.price
  let total = base

  // Gran empresa: each 200 additional employees = +20% of base
  if (tierValue === 'gran' && empleadosAdicionales > 0) {
    const tramos = Math.ceil(empleadosAdicionales / 200)
    total += base * tramos * 0.20
  }

  // Sedes: each additional sede = +10% of running total
  if (numSedes > 1) {
    total = total * (1 + (numSedes - 1) * 0.10)
  }

  // Procesos: % of base
  if (aplicarProcesos && porcentajeProcesos > 0) {
    total += base * (porcentajeProcesos / 100)
  }

  // Riesgos: % of base
  if (incrementoRiesgos > 0) {
    total += base * (incrementoRiesgos / 100)
  }

  return Math.round(total)
}

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

  // Email modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [savedDiagId, setSavedDiagId] = useState<string | null>(null)
  const [clienteEmail, setClienteEmail] = useState<string>('')
  const [emailOption, setEmailOption] = useState<'stored' | 'custom'>('stored')
  const [customEmail, setCustomEmail] = useState('')
  const [saveCustomEmail, setSaveCustomEmail] = useState(false)
  const [sendingPropuesta, setSendingPropuesta] = useState(false)

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
      aplicarProcesos: false,
    },
  })

  const clienteId = watch('clienteId')
  const clienteNombre = watch('clienteNombre')

  // Pricing fields
  const tierEmpleados = watch('tierEmpleados') ?? ''
  const empleadosAdicionales = watch('empleadosAdicionales') ?? 0
  const numSedes = watch('numSedes') ?? 1
  const porcentajeProcesos = watch('porcentajeProcesos') ?? 0
  const aplicarProcesos = watch('aplicarProcesos') ?? false
  const incrementoRiesgos = watch('incrementoRiesgos') ?? 0

  const precioCalculado = useMemo(
    () => calcPrecio(tierEmpleados, Number(empleadosAdicionales), Number(numSedes), Number(porcentajeProcesos), Boolean(aplicarProcesos), Number(incrementoRiesgos)),
    [tierEmpleados, empleadosAdicionales, numSedes, porcentajeProcesos, aplicarProcesos, incrementoRiesgos]
  )

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

  async function fetchClienteEmail(clienteId: string) {
    try {
      const res = await fetch(`/api/crm/clientes/${clienteId}`)
      if (res.ok) {
        const data = await res.json()
        setClienteEmail(data.email || data.cliente?.email || '')
      }
    } catch {
      // ignore - email stays empty
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const finalData = { ...data, inversionEstimada: precioCalculado > 0 ? precioCalculado : data.inversionEstimada }
      const res = await fetch('/api/crm/diagnosticos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      const saved = await res.json()
      setSavedDiagId(saved._id || saved.id || null)
      toast.success('Diagnostico creado')
      setEmailModalOpen(true)
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error') }
    finally { setLoading(false) }
  }

  const handleEnviarPropuesta = async () => {
    if (!savedDiagId) return
    const email = emailOption === 'stored' ? clienteEmail : customEmail
    if (!email) { toast.error('Ingresa un correo'); return }
    setSendingPropuesta(true)
    try {
      const res = await fetch('/api/crm/propuesta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosticoId: savedDiagId, email, saveEmail: emailOption === 'custom' && saveCustomEmail }),
      })
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Error al enviar') }
      toast.success('Propuesta enviada correctamente')
      router.push('/crm/diagnostico')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al enviar')
      router.push('/crm/diagnostico')
    } finally {
      setSendingPropuesta(false)
    }
  }

  function onInvalid(errs: Record<string, unknown>) {
    const first = Object.values(errs)[0] as { message?: string } | undefined
    toast.error(first?.message || 'Revisa los campos requeridos antes de guardar')
  }

  return (
    <>
      <CrmFormWrapper title="Nuevo Diagnostico" backHref="/crm/diagnostico" onSubmit={handleSubmit(onSubmit, onInvalid)} loading={loading}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* General */}
          <SectionHeader title="General" />

          <div className="md:col-span-2">
            <Label>Cliente *</Label>
            <ClienteSelector
              value={clienteId}
              clienteNombre={clienteNombre}
              onSelect={(id, nombre) => {
                setValue('clienteId', id)
                setValue('clienteNombre', nombre)
                fetchClienteEmail(id)
              }}
              error={errors.clienteId?.message}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Normas de interes *</Label>
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

          {/* Seccion 1: Sobre la empresa (with pricing calculator) */}
          <SectionHeader
            title="1. Sobre la empresa"
            subtitle="Cotizacion, actividad, mercados, tamano y nivel de regulacion"
          />

          {/* Pricing: Numero de procesos */}
          <div>
            <Label>Numero de procesos</Label>
            <Input type="number" min={1} {...register('numProcesos', { valueAsNumber: true })} placeholder="Ej: 8" />
          </div>

          {/* Pricing: Porcentaje procesos + checkbox */}
          <div>
            <Label>Porcentaje adicional por procesos (%)</Label>
            <div className="flex items-center gap-3 mt-1">
              <Input
                type="number"
                min={0}
                max={100}
                className="w-28"
                {...register('porcentajeProcesos', { valueAsNumber: true })}
                placeholder="0"
              />
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  checked={Boolean(aplicarProcesos)}
                  onCheckedChange={checked => setValue('aplicarProcesos', Boolean(checked))}
                />
                Aplicar incremento por procesos
              </label>
            </div>
          </div>

          {/* Pricing: Tier de empleados */}
          <div className="md:col-span-2">
            <Label>Tier de empleados (base de cotizacion)</Label>
            <Select onValueChange={v => setValue('tierEmpleados', v)}>
              <SelectTrigger><SelectValue placeholder="Seleccionar tier" /></SelectTrigger>
              <SelectContent>
                {TIERS.map(t => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label} — {formatCOP(t.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Empleados adicionales (solo si tier === gran) */}
          {tierEmpleados === 'gran' && (
            <div>
              <Label>Empleados adicionales (por encima de 500)</Label>
              <Input type="number" min={0} {...register('empleadosAdicionales', { valueAsNumber: true })} placeholder="0" />
            </div>
          )}

          {/* Numero de sedes */}
          <div>
            <Label>Numero de sedes</Label>
            <Input type="number" min={1} {...register('numSedes', { valueAsNumber: true })} placeholder="1" />
          </div>

          {/* Live price preview */}
          {precioCalculado > 0 && (
            <div className="md:col-span-2">
              <div className="rounded-lg bg-blue-950/40 border border-blue-800/50 px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-slate-300">Precio base calculado</span>
                <span className="text-lg font-bold text-blue-400">{formatCOP(precioCalculado)}</span>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <Label>Actividad principal / Productos o servicios</Label>
            <Textarea {...register('actividadPrincipal')} rows={2} placeholder="A que se dedica la organizacion?" />
          </div>

          <div>
            <Label>Mercados / sectores donde opera</Label>
            <Input {...register('mercadosOperacion')} placeholder="Ej: construccion, salud, manufactura..." />
          </div>

          <div>
            <Label>Nivel de regulacion del sector</Label>
            <Select onValueChange={v => setValue('nivelRegulacion', v as FormData['nivelRegulacion'])}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                {['Alto', 'Medio', 'Bajo'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Seccion 2: Situacion actual */}
          <SectionHeader
            title="2. Situacion actual frente a las normas"
            subtitle="Certificaciones existentes, estado en calidad, ambiental y SST"
          />

          <div className="md:col-span-2">
            <Label>Certificaciones ISO ya obtenidas</Label>
            <Textarea {...register('certificacionesExistentes')} rows={2} placeholder="Tienen alguna certificacion ISO vigente? Cual? Con que organismo?" />
          </div>

          <div>
            <Label>Responsable interno del sistema de gestion</Label>
            <Input {...register('responsableInterno')} placeholder="Nombre y cargo" />
          </div>

          <div className="md:col-span-2">
            <Label>Situacion en Calidad (ISO 9001)</Label>
            <Textarea {...register('situacionCalidad')} rows={3} placeholder="Procesos definidos y documentados? Medicion de satisfaccion del cliente? Gestion de quejas/no conformidades?" />
          </div>

          <div className="md:col-span-2">
            <Label>Situacion Ambiental (ISO 14001)</Label>
            <Textarea {...register('situacionAmbiental')} rows={3} placeholder="Aspectos e impactos identificados? Permisos/licencias ambientales vigentes?" />
          </div>

          <div className="md:col-span-2">
            <Label>Situacion SST (ISO 45001)</Label>
            <Textarea {...register('situacionSST')} rows={3} placeholder="Matriz de peligros actualizada? Investigacion de incidentes? Programas de capacitacion en SST?" />
          </div>

          {/* Seccion 3: Necesidades y objetivos */}
          <SectionHeader
            title="3. Necesidades y objetivos"
            subtitle="Motivacion, metas, fecha objetivo y experiencia previa"
          />

          <div className="md:col-span-2">
            <Label>Motivacion para buscar el servicio</Label>
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
            <Label>Fecha objetivo de certificacion</Label>
            <Input type="date" {...register('fechaObjetivoCertificacion')} />
          </div>

          <div className="md:col-span-2">
            <Label>Experiencia previa con consultores o auditorias externas</Label>
            <Textarea {...register('experienciaPrevia')} rows={3} placeholder="Han trabajado antes con consultores? Que les gusto y que les gustaria evitar esta vez?" />
          </div>

          {/* Seccion 4: Alcance, recursos y restricciones */}
          <SectionHeader
            title="4. Alcance, recursos y restricciones"
            subtitle="Procesos a incluir, recursos disponibles y modalidad de trabajo"
          />

          <div className="md:col-span-2">
            <Label>Alcance propuesto (procesos y/o sedes)</Label>
            <Textarea {...register('alcancePropuesto')} rows={3} placeholder="Que procesos y sedes desean incluir en el alcance de certificacion?" />
          </div>

          <div className="md:col-span-2">
            <Label>Recursos internos disponibles</Label>
            <Textarea {...register('recursosInternos')} rows={3} placeholder="Tiempo de la direccion, responsable del sistema, apoyo de jefes de area, presupuesto aproximado..." />
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
            <Textarea {...register('restricciones')} rows={2} placeholder="Turnos, operacion en campo, idiomas, requisitos de seguridad industrial para visitas, etc." />
          </div>

          {/* Seccion 5: Servicios que buscan */}
          <SectionHeader
            title="5. Servicios que buscan"
            subtitle="Tipo de servicio, enfoque de auditoria y capacitacion"
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
            <Label>Enfoque de auditoria interna</Label>
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
            <Label>Temas de capacitacion prioritarios</Label>
            <Textarea {...register('temasCapacitacion')} rows={2} placeholder="Interpretacion de normas, formacion de auditores internos, enfoque basado en riesgos, gestion de incidentes..." />
          </div>

          {/* Resultados del diagnostico */}
          <SectionHeader title="Resultados del Diagnostico" subtitle="Completar tras finalizar el analisis" />

          <div>
            <Label>Cumplimiento Global (%)</Label>
            <Input type="number" min={0} max={100} {...register('cumplimientoGlobal', { valueAsNumber: true })} />
          </div>

          <div>
            <Label>Viabilidad</Label>
            <Select onValueChange={v => setValue('viabilidad', v as FormData['viabilidad'])}>
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
            <Label>Incremento por riesgos (%)</Label>
            <div className="flex items-center gap-3">
              <Input type="number" min={0} max={100} className="w-28" {...register('incrementoRiesgos', { valueAsNumber: true })} placeholder="0" />
              {precioCalculado > 0 && (
                <span className="text-sm text-amber-400">
                  Total estimado: {formatCOP(precioCalculado)}
                </span>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <Label>Resumen Ejecutivo</Label>
            <Textarea {...register('resumenEjecutivo')} rows={4} />
          </div>

        </div>
      </CrmFormWrapper>

      {/* Email Proposal Modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Propuesta al Cliente</DialogTitle>
            <DialogDescription>
              Puedes enviar la propuesta comercial al correo del cliente ahora, o hacerlo mas tarde.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {clienteEmail && (
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
                <input
                  type="radio"
                  name="emailOpt"
                  className="mt-0.5 accent-blue-500"
                  checked={emailOption === 'stored'}
                  onChange={() => setEmailOption('stored')}
                />
                <div>
                  <p className="text-sm font-medium text-slate-200">Correo del cliente</p>
                  <p className="text-xs text-slate-400 mt-0.5">{clienteEmail}</p>
                </div>
              </label>
            )}

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
              <input
                type="radio"
                name="emailOpt"
                className="mt-0.5 accent-blue-500"
                checked={emailOption === 'custom' || !clienteEmail}
                onChange={() => setEmailOption('custom')}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">Otro correo</p>
                {(emailOption === 'custom' || !clienteEmail) && (
                  <div className="mt-2 space-y-2">
                    <Input
                      type="email"
                      placeholder="correo@empresa.com"
                      value={customEmail}
                      onChange={e => setCustomEmail(e.target.value)}
                    />
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                      <Checkbox
                        checked={saveCustomEmail}
                        onCheckedChange={checked => setSaveCustomEmail(Boolean(checked))}
                      />
                      Guardar este correo en el sistema
                    </label>
                  </div>
                )}
              </div>
            </label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => { setEmailModalOpen(false); router.push('/crm/diagnostico') }}
            >
              Guardar sin enviar
            </Button>
            <Button
              onClick={handleEnviarPropuesta}
              disabled={sendingPropuesta}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              {sendingPropuesta ? 'Enviando...' : 'Enviar Propuesta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
