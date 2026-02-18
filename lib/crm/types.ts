export interface CrmCliente {
  _id: string
  codigo: string
  razonSocial: string
  nombreComercial: string
  nif: string
  sector: string
  tamano: 'Micro' | 'Pequeña' | 'Mediana' | 'Grande'
  numEmpleados: number
  telefono: string
  email: string
  direccion: string
  ciudad: string
  pais: string
  estado: 'Prospecto' | 'Activo' | 'Inactivo' | 'Ex-cliente'
  consultorAsignado: string
  fechaAlta: string
  certificaciones: CrmCertificacionCliente[]
}

export interface CrmCertificacionCliente {
  norma: string
  organismo: string
  fechaEmision: string
  vigenciaHasta: string
  numeroCertificado: string
  estado: 'Vigente' | 'Vencido' | 'En proceso'
}

export interface CrmDiagnostico {
  _id: string
  codigo: string
  cliente: { _ref: string }
  clienteNombre: string
  normas: string[]
  estado: 'Programado' | 'En ejecución' | 'Completado' | 'Cancelado'
  fechaVisita: string
  consultorAsignado: string
  cumplimientoGlobal?: number
  viabilidad?: 'Alta' | 'Media' | 'Baja'
  tiempoEstimado?: number
  inversionEstimada?: number
  resumenEjecutivo?: string
  cotizacion?: {
    concepto: string
    valor: number
  }[]
}

export interface CrmCertificacion {
  _id: string
  codigo: string
  cliente: { _ref: string }
  clienteNombre: string
  normas: string[]
  faseActual: 1 | 2 | 3 | 4 | 5
  avanceGlobal: number
  consultorLider: string
  fechaInicio: string
  fechaObjetivo: string
  estado: 'Activo' | 'Pausado' | 'Completado' | 'Cancelado'
  valorProyecto: number
  prioridad: 'Urgente' | 'Alta' | 'Media' | 'Baja'
  diagnosticoOrigen?: string
  fases?: CrmFaseCertificacion[]
}

export interface CrmFaseCertificacion {
  _key: string
  numero: number
  nombre: string
  avance: number
  tareas: { nombre: string; completada: boolean }[]
  entregables: { nombre: string; completado: boolean }[]
}

export interface CrmAuditoria {
  _id: string
  codigo: string
  cliente: { _ref: string }
  clienteNombre: string
  tipo: 'Primera parte (interna)' | 'Segunda parte (proveedores)' | 'Tercera parte (certificación)'
  normas: string[]
  fechaInicio: string
  fechaFin: string
  auditorLider: string
  estado: 'Planificada' | 'En ejecución' | 'Completada' | 'Cancelada'
  numNCMayores?: number
  numNCMenores?: number
  numObservaciones?: number
  resultado?: 'Conforme' | 'No conforme' | 'Conforme con observaciones'
  hallazgos?: CrmHallazgo[]
  accionesCorrectivas?: CrmAccionCorrectiva[]
  informe?: { _type: 'file'; asset: { _ref: string } }
}

export interface CrmHallazgo {
  _key: string
  tipo: 'NC Mayor' | 'NC Menor' | 'Observación' | 'Oportunidad de mejora'
  clausula: string
  descripcion: string
  evidencia: string
}

export interface CrmAccionCorrectiva {
  _key: string
  hallazgoRef: string
  descripcion: string
  responsable: string
  fechaLimite: string
  estado: 'Pendiente' | 'En proceso' | 'Cerrada'
}

export interface CrmConsultoria {
  _id: string
  codigo: string
  cliente: { _ref: string }
  clienteNombre: string
  tipo: 'Implementación SGC' | 'Mantenimiento' | 'Mejora continua' | 'Integración normas' | 'Otro'
  normas: string[]
  consultorLider: string
  fechaInicio: string
  fechaFinPlan: string
  estado: 'Propuesta' | 'Activo' | 'Pausado' | 'Completado' | 'Cancelado'
  valorContratado: number
  avance: number
  sesiones?: CrmSesionConsultoria[]
  entregables?: CrmEntregableConsultoria[]
}

export interface CrmSesionConsultoria {
  _key: string
  fecha: string
  duracionHoras: number
  tema: string
  notas: string
}

export interface CrmEntregableConsultoria {
  _key: string
  nombre: string
  fechaEntrega: string
  archivo?: { _type: 'file'; asset: { _ref: string } }
}

export interface CrmCapacitacion {
  _id: string
  codigo: string
  cursoNombre: string
  tipo: 'Sensibilización' | 'Implementación' | 'Auditor interno' | 'Interpretación norma' | 'Herramientas' | 'Otro'
  cliente: { _ref: string }
  clienteNombre: string
  instructor: string
  fecha: string
  duracionHoras: number
  modalidad: 'Presencial' | 'Virtual' | 'Híbrido'
  numParticipantes: number
  estado: 'Programada' | 'Ejecutada' | 'Cancelada'
  participantes?: CrmParticipante[]
  evaluacion?: {
    satisfaccionPromedio: number
    comentarios: string
  }
}

export interface CrmParticipante {
  _key: string
  nombre: string
  cargo: string
  email: string
  asistio: boolean
  calificacion?: number
}

export interface CrmDesarrollo {
  _id: string
  codigo: string
  nombre: string
  descripcion: string
  categoria: 'Mejora de servicios' | 'Nuevo producto' | 'Proceso interno' | 'Marketing' | 'Tecnología' | 'Otro'
  prioridad: 'Urgente' | 'Alta' | 'Media' | 'Baja'
  responsable: string
  fechaInicio: string
  fechaLimite: string
  avance: number
  estado: 'Por hacer' | 'En progreso' | 'En revisión' | 'Completado'
  tareas?: CrmTareaDesarrollo[]
}

export interface CrmTareaDesarrollo {
  _key: string
  nombre: string
  responsable: string
  estado: 'Pendiente' | 'En progreso' | 'Completada'
  fechaLimite: string
}
