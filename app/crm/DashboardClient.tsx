"use client"

import Link from "next/link"
import {
  Users,
  Search,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"
import { Progress } from "@/components/crm/ui/progress"
import { Badge } from "@/components/crm/ui/badge"
import { Button } from "@/components/crm/ui/button"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts"

interface DashboardStats {
  totalClientes: number
  clientesActivos: number
  totalCertificaciones: number
  certificacionesActivas: number
  totalAuditorias: number
  auditoriasPlaneadas: number
  totalDiagnosticos: number
  diagnosticosPendientes: number
  totalCapacitaciones: number
  totalConsultorias: number
  recentCertificaciones: Array<{
    _id: string; codigo: string; clienteNombre: string; normas: string[];
    faseActual: number; avanceGlobal: number; estado: string; prioridad: string
  }>
  proximasAuditorias: Array<{
    _id: string; codigo: string; clienteNombre: string; tipo: string;
    fechaInicio: string; auditorLider: string
  }>
  desarrolloEnProgreso: Array<{
    _id: string; codigo: string; nombre: string; avance: number;
    estado: string; prioridad: string; responsable: string
  }>
}

const normaData = [
  { name: 'ISO 9001', value: 15, color: '#3b82f6' },
  { name: 'ISO 14001', value: 8, color: '#10b981' },
  { name: 'ISO 45001', value: 5, color: '#f59e0b' },
]

const actividadReciente = [
  { id: 1, tipo: 'Diagnóstico', descripcion: 'Completado diagnóstico para TechSolutions IT S.L.', icono: CheckCircle2, color: 'text-green-600' },
  { id: 2, tipo: 'Auditoría', descripcion: 'Programada auditoría interna en Alimentaria Fresh Foods', icono: Calendar, color: 'text-blue-600' },
  { id: 3, tipo: 'Certificación', descripcion: 'Fase 3 iniciada en proyecto CERT-2026-002', icono: Award, color: 'text-purple-600' },
  { id: 4, tipo: 'Capacitación', descripcion: 'Ejecutada formación ISO 14001 en EcoVerde', icono: BookOpen, color: 'text-orange-600' },
]

export default function DashboardClient({ stats }: { stats: DashboardStats | null }) {
  const s = stats ?? {
    totalClientes: 0, clientesActivos: 0, totalCertificaciones: 0,
    certificacionesActivas: 0, totalAuditorias: 0, auditoriasPlaneadas: 0,
    totalDiagnosticos: 0, diagnosticosPendientes: 0, totalCapacitaciones: 0,
    totalConsultorias: 0, recentCertificaciones: [], proximasAuditorias: [],
    desarrolloEnProgreso: [],
  }

  const faseData = [1, 2, 3, 4, 5].map(n => ({
    fase: `Fase ${n}`,
    proyectos: s.recentCertificaciones.filter(c => c.faseActual === n).length,
  }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vista general del estado de operaciones</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/crm/clientes">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Clientes Activos</CardTitle>
              <Users className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{s.clientesActivos}</div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
                <TrendingUp className="w-4 h-4" /><span>de {s.totalClientes} total</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/crm/auditoria">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Auditorías Planificadas</CardTitle>
              <Search className="w-5 h-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{s.auditoriasPlaneadas}</div>
              <div className="text-sm text-gray-600 mt-2">de {s.totalAuditorias} total</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/crm/certificacion">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Certificaciones Activas</CardTitle>
              <Award className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{s.certificacionesActivas}</div>
              <div className="text-sm text-gray-600 mt-2">de {s.totalCertificaciones} total</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/crm/capacitaciones">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Capacitaciones</CardTitle>
              <BookOpen className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{s.totalCapacitaciones}</div>
              <div className="text-sm text-gray-600 mt-2">Diagnósticos: {s.diagnosticosPendientes} pendientes</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Proyectos por Fase de Certificación</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={faseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fase" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="proyectos" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Distribución por Norma ISO</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={normaData} cx="50%" cy="50%" labelLine={false}
                  label={(e) => `${e.name} (${e.value})`} outerRadius={80} dataKey="value">
                  {normaData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Actividad Reciente</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actividadReciente.map((a) => (
                <div key={a.id} className="flex gap-3">
                  <div className={`${a.color} mt-1`}><a.icono className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{a.descripcion}</p>
                    <Badge variant="outline" className="text-xs mt-1">{a.tipo}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Desarrollo en Progreso
              <Link href="/crm/desarrollo"><Button variant="outline" size="sm">Ver todo</Button></Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(s.desarrolloEnProgreso.length > 0 ? s.desarrolloEnProgreso : [
                { _id: '1', codigo: 'DEV-2026-001', nombre: 'Sin proyectos de desarrollo', avance: 0, estado: 'Por hacer', prioridad: 'Media', responsable: '' }
              ]).map((d) => (
                <div key={d._id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-gray-900">{d.nombre}</p>
                    <StatusBadge status={d.estado} />
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{d.responsable}</span><span>{d.avance}%</span>
                    </div>
                    <Progress value={d.avance} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificaciones activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Proyectos de Certificación Activos
            <Link href="/crm/certificacion"><Button variant="outline" size="sm">Ver todos</Button></Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(s.recentCertificaciones.length > 0 ? s.recentCertificaciones.slice(0, 3) : []).map((p) => (
              <Link key={p._id} href={`/crm/certificacion/${p._id}`}>
                <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{p.clienteNombre}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {p.normas.map(n => <Badge key={n} variant="outline">{n}</Badge>)}
                      </div>
                    </div>
                    <StatusBadge status={p.estado} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Avance global</span>
                      <span className="font-medium">{p.avanceGlobal}%</span>
                    </div>
                    <Progress value={p.avanceGlobal} className="h-2" />
                    <div className="text-xs text-gray-500">Fase {p.faseActual} · {p.codigo}</div>
                  </div>
                </div>
              </Link>
            ))}
            {s.recentCertificaciones.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No hay certificaciones activas</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
