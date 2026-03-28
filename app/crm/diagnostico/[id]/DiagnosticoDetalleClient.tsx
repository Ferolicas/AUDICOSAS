"use client"

import Link from "next/link"
import { ArrowLeft, FileText, Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Progress } from "@/components/crm/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/crm/ui/table"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import { DeleteButton } from "@/components/crm/shared/DeleteButton"
import type { CrmDiagnostico } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

function InfoField({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm text-slate-200">{value}</p>
    </div>
  )
}

function TextAreaField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="md:col-span-2">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm text-slate-200 whitespace-pre-wrap">{value}</p>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-slate-300">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DiagnosticoDetalleClient({ diagnostico: d }: { diagnostico: CrmDiagnostico }) {
  const hasSec1 = d.actividadPrincipal || d.mercadosOperacion || d.numSedes || d.nivelRegulacion
  const hasSec2 = d.certificacionesExistentes || d.situacionCalidad || d.situacionAmbiental || d.situacionSST || d.responsableInterno
  const hasSec3 = (d.motivacion?.length) || d.objetivosPrincipales || d.fechaObjetivoCertificacion || d.experienciaPrevia
  const hasSec4 = d.alcancePropuesto || d.recursosInternos || d.modalidadPreferida || d.restricciones
  const hasSec5 = (d.serviciosBuscados?.length) || d.enfoqueAuditoria || d.temasCapacitacion

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/crm/diagnostico">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">{d.clienteNombre}</h1>
            <StatusBadge status={d.estado} />
          </div>
          <p className="text-slate-400">{d.codigo}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/crm/diagnostico/${d._id}/editar`}>
            <Button variant="outline"><Pencil className="w-4 h-4 mr-2" />Editar</Button>
          </Link>
          {d.estado === 'Completado' && (
            <Link href={`/crm/certificacion/nuevo?diagnosticoId=${d._id}`}>
              <Button><FileText className="w-4 h-4 mr-2" />Convertir a Certificación</Button>
            </Link>
          )}
          <DeleteButton id={d._id} apiPath="/api/crm/diagnosticos" entityName="Diagnóstico" redirectPath="/crm/diagnostico" />
        </div>
      </div>

      {/* Info general */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">Normas</p>
            <div className="flex gap-1 flex-wrap mt-1">
              {d.normas?.map(n => <Badge key={n} variant="outline">{n}</Badge>)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">Fecha de Visita</p>
            <p className="text-lg font-semibold">{d.fechaVisita ? format(new Date(d.fechaVisita), 'dd MMMM yyyy', { locale: es }) : '-'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">Consultor Asignado</p>
            <p className="text-lg font-semibold">{d.consultorAsignado}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-400">Viabilidad</p>
            <p className="text-lg font-semibold">{d.viabilidad || '-'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sección 1 */}
      {hasSec1 && (
        <SectionCard title="1. Sobre la empresa">
          <TextAreaField label="Actividad principal / Productos o servicios" value={d.actividadPrincipal} />
          <InfoField label="Mercados / sectores donde opera" value={d.mercadosOperacion} />
          <InfoField label="Número de sedes" value={d.numSedes} />
          <InfoField label="Nivel de regulación del sector" value={d.nivelRegulacion} />
        </SectionCard>
      )}

      {/* Sección 2 */}
      {hasSec2 && (
        <SectionCard title="2. Situación actual frente a las normas">
          <TextAreaField label="Certificaciones ISO existentes" value={d.certificacionesExistentes} />
          <InfoField label="Responsable interno del sistema de gestión" value={d.responsableInterno} />
          <TextAreaField label="Situación en Calidad (ISO 9001)" value={d.situacionCalidad} />
          <TextAreaField label="Situación Ambiental (ISO 14001)" value={d.situacionAmbiental} />
          <TextAreaField label="Situación SST (ISO 45001)" value={d.situacionSST} />
        </SectionCard>
      )}

      {/* Sección 3 */}
      {hasSec3 && (
        <SectionCard title="3. Necesidades y objetivos">
          {d.motivacion && d.motivacion.length > 0 && (
            <div className="md:col-span-2">
              <p className="text-xs text-slate-400 mb-1">Motivación</p>
              <div className="flex gap-2 flex-wrap">
                {d.motivacion.map(m => <Badge key={m} variant="secondary">{m}</Badge>)}
              </div>
            </div>
          )}
          <TextAreaField label="Objetivos principales" value={d.objetivosPrincipales} />
          <InfoField
            label="Fecha objetivo de certificación"
            value={d.fechaObjetivoCertificacion ? format(new Date(d.fechaObjetivoCertificacion), 'dd MMMM yyyy', { locale: es }) : undefined}
          />
          <TextAreaField label="Experiencia previa con consultores" value={d.experienciaPrevia} />
        </SectionCard>
      )}

      {/* Sección 4 */}
      {hasSec4 && (
        <SectionCard title="4. Alcance, recursos y restricciones">
          <TextAreaField label="Alcance propuesto" value={d.alcancePropuesto} />
          <TextAreaField label="Recursos internos disponibles" value={d.recursosInternos} />
          <InfoField label="Modalidad preferida" value={d.modalidadPreferida} />
          <TextAreaField label="Restricciones relevantes" value={d.restricciones} />
        </SectionCard>
      )}

      {/* Sección 5 */}
      {hasSec5 && (
        <SectionCard title="5. Servicios buscados">
          {d.serviciosBuscados && d.serviciosBuscados.length > 0 && (
            <div className="md:col-span-2">
              <p className="text-xs text-slate-400 mb-1">Servicios buscados</p>
              <div className="flex flex-col gap-1">
                {d.serviciosBuscados.map(s => (
                  <span key={s} className="text-sm text-slate-200">• {s}</span>
                ))}
              </div>
            </div>
          )}
          <InfoField label="Enfoque de auditoría interna" value={d.enfoqueAuditoria} />
          <TextAreaField label="Temas de capacitación prioritarios" value={d.temasCapacitacion} />
        </SectionCard>
      )}

      {/* Resultados */}
      {d.estado === 'Completado' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-400">Cumplimiento Global</p>
                <p className="text-4xl font-bold text-blue-600 mt-1">{d.cumplimientoGlobal ?? 0}%</p>
                <Progress value={d.cumplimientoGlobal ?? 0} className="h-2 mt-2" />
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-400">Tiempo Estimado</p>
                <p className="text-4xl font-bold text-green-600 mt-1">{d.tiempoEstimado ?? '-'}</p>
                <p className="text-sm text-slate-400">meses</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-400">Inversión Estimada</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{d.inversionEstimada ? formatCOP(d.inversionEstimada) : '-'}</p>
              </CardContent>
            </Card>
          </div>

          {d.resumenEjecutivo && (
            <Card>
              <CardHeader><CardTitle>Resumen Ejecutivo</CardTitle></CardHeader>
              <CardContent>
                <p className="text-slate-300 whitespace-pre-wrap">{d.resumenEjecutivo}</p>
              </CardContent>
            </Card>
          )}

          {d.cotizacion && d.cotizacion.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Cotización</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepto</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {d.cotizacion.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.concepto}</TableCell>
                        <TableCell className="text-right font-medium">{formatCOP(item.valor)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{formatCOP(d.cotizacion.reduce((s, c) => s + c.valor, 0))}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
