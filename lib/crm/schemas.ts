import { z } from 'zod'

export const clienteSchema = z.object({
  razonSocial: z.string().min(1, 'Razón social requerida'),
  nombreComercial: z.string().min(1, 'Nombre comercial requerido'),
  nombreContacto: z.string().optional().default(''),
  nif: z.string().min(1, 'NIF requerido'),
  sector: z.string().min(1, 'Sector requerido'),
  tamano: z.enum(['Micro', 'Pequeña', 'Mediana', 'Grande']),
  numEmpleados: z.number().int().positive(),
  telefono: z.string().optional().default(''),
  email: z.string().email('Email inválido'),
  direccion: z.string().optional().default(''),
  ciudad: z.string().optional().default(''),
  pais: z.string().optional().default('Colombia'),
  estado: z.enum(['Prospecto', 'Activo', 'Inactivo', 'Ex-cliente']).default('Prospecto'),
  servicioInteres: z.string().optional().default(''),
  observaciones: z.string().optional().default(''),
  consultorAsignado: z.string().min(1, 'Consultor asignado requerido'),
})

export const diagnosticoSchema = z.object({
  clienteId: z.string().min(1, 'Cliente requerido'),
  clienteNombre: z.string().min(1),
  normas: z.array(z.string()).min(1, 'Al menos una norma requerida'),
  estado: z.enum(['Programado', 'En ejecución', 'Completado', 'Cancelado']).default('Programado'),
  fechaVisita: z.string().min(1, 'Fecha de visita requerida'),
  consultorAsignado: z.string().min(1),
  // Sección 1 - Sobre la empresa
  actividadPrincipal: z.string().optional(),
  mercadosOperacion: z.string().optional(),
  numSedes: z.number().int().positive().optional(),
  numProcesos: z.number().int().min(1).optional(),
  tierEmpleados: z.string().optional(),
  empleadosAdicionales: z.number().int().min(0).optional(),
  porcentajeProcesos: z.number().min(0).max(100).optional(),
  aplicarProcesos: z.boolean().optional().default(false),
  nivelRegulacion: z.enum(['Alto', 'Medio', 'Bajo']).optional(),
  // Sección 2 - Situación actual frente a normas
  certificacionesExistentes: z.string().optional(),
  situacionCalidad: z.string().optional(),
  situacionAmbiental: z.string().optional(),
  situacionSST: z.string().optional(),
  responsableInterno: z.string().optional(),
  // Sección 3 - Necesidades y objetivos
  motivacion: z.array(z.string()).optional(),
  objetivosPrincipales: z.string().optional(),
  fechaObjetivoCertificacion: z.string().optional(),
  experienciaPrevia: z.string().optional(),
  // Sección 4 - Alcance, recursos y restricciones
  alcancePropuesto: z.string().optional(),
  recursosInternos: z.string().optional(),
  modalidadPreferida: z.enum(['Presencial', 'Virtual', 'Híbrido']).optional(),
  restricciones: z.string().optional(),
  // Sección 5 - Servicios que buscan
  serviciosBuscados: z.array(z.string()).optional(),
  enfoqueAuditoria: z.enum(['Integral (9001, 14001, 45001)', 'Por norma', 'Procesos críticos']).optional(),
  temasCapacitacion: z.string().optional(),
  // Resultados del diagnóstico (se rellenan al completar)
  incrementoRiesgos: z.number().min(0).max(100).optional(),
  cumplimientoGlobal: z.number().min(0).max(100).optional(),
  viabilidad: z.enum(['Alta', 'Media', 'Baja']).optional(),
  tiempoEstimado: z.number().positive().optional(),
  inversionEstimada: z.number().min(0).optional(),
  resumenEjecutivo: z.string().optional(),
})

export const certificacionSchema = z.object({
  clienteId: z.string().min(1, 'Cliente requerido'),
  clienteNombre: z.string().min(1),
  normas: z.array(z.string()).min(1),
  faseActual: z.number().int().min(1).max(5).default(1),
  avanceGlobal: z.number().min(0).max(100).default(0),
  consultorLider: z.string().min(1),
  fechaInicio: z.string().min(1),
  fechaObjetivo: z.string().min(1),
  estado: z.enum(['Activo', 'Pausado', 'Completado', 'Cancelado']).default('Activo'),
  valorProyecto: z.number().positive(),
  prioridad: z.enum(['Urgente', 'Alta', 'Media', 'Baja']).default('Media'),
  diagnosticoOrigen: z.string().optional(),
})

export const auditoriaSchema = z.object({
  clienteId: z.string().min(1, 'Cliente requerido'),
  clienteNombre: z.string().min(1),
  tipo: z.enum(['Primera parte (interna)', 'Segunda parte (proveedores)', 'Tercera parte (certificación)']),
  normas: z.array(z.string()).min(1),
  fechaInicio: z.string().min(1),
  fechaFin: z.string().min(1),
  auditorLider: z.string().min(1),
  estado: z.enum(['Planificada', 'En ejecución', 'Completada', 'Cancelada']).default('Planificada'),
  numNCMayores: z.number().int().min(0).optional(),
  numNCMenores: z.number().int().min(0).optional(),
  numObservaciones: z.number().int().min(0).optional(),
  resultado: z.enum(['Conforme', 'No conforme', 'Conforme con observaciones']).optional(),
})

export const consultoriaSchema = z.object({
  clienteId: z.string().min(1, 'Cliente requerido'),
  clienteNombre: z.string().min(1),
  tipo: z.enum(['Implementación SGC', 'Mantenimiento', 'Mejora continua', 'Integración normas', 'Otro']),
  normas: z.array(z.string()).min(1),
  consultorLider: z.string().min(1),
  fechaInicio: z.string().min(1),
  fechaFinPlan: z.string().min(1),
  estado: z.enum(['Propuesta', 'Activo', 'Pausado', 'Completado', 'Cancelado']).default('Propuesta'),
  valorContratado: z.number().positive(),
  avance: z.number().min(0).max(100).default(0),
})

export const capacitacionSchema = z.object({
  cursoNombre: z.string().min(1, 'Nombre del curso requerido'),
  tipo: z.enum(['Sensibilización', 'Implementación', 'Auditor interno', 'Interpretación norma', 'Herramientas', 'Otro']),
  clienteId: z.string().min(1, 'Cliente requerido'),
  clienteNombre: z.string().min(1),
  instructor: z.string().min(1),
  fecha: z.string().min(1),
  duracionHoras: z.number().positive(),
  modalidad: z.enum(['Presencial', 'Virtual', 'Híbrido']),
  numParticipantes: z.number().int().positive(),
  estado: z.enum(['Programada', 'Ejecutada', 'Cancelada']).default('Programada'),
})

export const desarrolloSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  descripcion: z.string().min(1, 'Descripción requerida'),
  categoria: z.enum(['Mejora de servicios', 'Nuevo producto', 'Proceso interno', 'Marketing', 'Tecnología', 'Otro']),
  prioridad: z.enum(['Urgente', 'Alta', 'Media', 'Baja']).default('Media'),
  responsable: z.string().min(1),
  fechaInicio: z.string().min(1),
  fechaLimite: z.string().min(1),
  avance: z.number().min(0).max(100).default(0),
  estado: z.enum(['Por hacer', 'En progreso', 'En revisión', 'Completado']).default('Por hacer'),
})
