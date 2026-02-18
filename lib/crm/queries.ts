import groq from 'groq'

// Clientes
export const allClientesQuery = groq`*[_type == "crmCliente"] | order(fechaAlta desc) {
  _id, codigo, razonSocial, nombreComercial, nif, sector, tamano,
  numEmpleados, telefono, email, direccion, ciudad, pais,
  estado, consultorAsignado, fechaAlta, certificaciones
}`

export const clienteByIdQuery = groq`*[_type == "crmCliente" && _id == $id][0] {
  _id, codigo, razonSocial, nombreComercial, nif, sector, tamano,
  numEmpleados, telefono, email, direccion, ciudad, pais,
  estado, consultorAsignado, fechaAlta, certificaciones
}`

export const clienteCountQuery = groq`count(*[_type == "crmCliente"])`

// Diagnósticos
export const allDiagnosticosQuery = groq`*[_type == "crmDiagnostico"] | order(fechaVisita desc) {
  _id, codigo, cliente->{_id, nombreComercial},
  clienteNombre, normas, estado, fechaVisita,
  consultorAsignado, cumplimientoGlobal, viabilidad,
  tiempoEstimado, inversionEstimada
}`

export const diagnosticoByIdQuery = groq`*[_type == "crmDiagnostico" && _id == $id][0] {
  _id, codigo, cliente->{_id, nombreComercial},
  clienteNombre, normas, estado, fechaVisita,
  consultorAsignado, cumplimientoGlobal, viabilidad,
  tiempoEstimado, inversionEstimada, resumenEjecutivo, cotizacion
}`

export const diagnosticoCountQuery = groq`count(*[_type == "crmDiagnostico"])`

// Certificaciones
export const allCertificacionesQuery = groq`*[_type == "crmCertificacion"] | order(fechaInicio desc) {
  _id, codigo, cliente->{_id, nombreComercial},
  clienteNombre, normas, faseActual, avanceGlobal,
  consultorLider, fechaInicio, fechaObjetivo,
  estado, valorProyecto, prioridad, diagnosticoOrigen
}`

export const certificacionByIdQuery = groq`*[_type == "crmCertificacion" && _id == $id][0] {
  _id, codigo, cliente->{_id, nombreComercial},
  clienteNombre, normas, faseActual, avanceGlobal,
  consultorLider, fechaInicio, fechaObjetivo,
  estado, valorProyecto, prioridad, diagnosticoOrigen, fases
}`

export const certificacionCountQuery = groq`count(*[_type == "crmCertificacion"])`

// Auditorías
export const allAuditoriasQuery = groq`*[_type == "crmAuditoria"] | order(fechaInicio desc) {
  _id, codigo, cliente->{_id, nombreComercial},
  clienteNombre, tipo, normas, fechaInicio, fechaFin,
  auditorLider, estado, numNCMayores, numNCMenores,
  numObservaciones, resultado
}`

export const auditoriaByIdQuery = groq`*[_type == "crmAuditoria" && _id == $id][0] {
  _id, codigo, cliente->{_id, nombreComercial},
  clienteNombre, tipo, normas, fechaInicio, fechaFin,
  auditorLider, estado, numNCMayores, numNCMenores,
  numObservaciones, resultado, hallazgos, accionesCorrectivas,
  "informeUrl": informe.asset->url
}`

export const auditoriaCountQuery = groq`count(*[_type == "crmAuditoria"])`

// Consultoría
export const allConsultoriasQuery = groq`*[_type == "crmConsultoria"] | order(fechaInicio desc) {
  _id, codigo, cliente->{_id, nombreComercial},
  clienteNombre, tipo, normas, consultorLider,
  fechaInicio, fechaFinPlan, estado, valorContratado, avance
}`

export const consultoriaByIdQuery = groq`*[_type == "crmConsultoria" && _id == $id][0] {
  _id, codigo, cliente->{_id, nombreComercial},
  clienteNombre, tipo, normas, consultorLider,
  fechaInicio, fechaFinPlan, estado, valorContratado, avance,
  sesiones, entregables[] {
    _key, nombre, fechaEntrega,
    "archivoUrl": archivo.asset->url
  }
}`

export const consultoriaCountQuery = groq`count(*[_type == "crmConsultoria"])`

// Capacitaciones
export const allCapacitacionesQuery = groq`*[_type == "crmCapacitacion"] | order(fecha desc) {
  _id, codigo, cursoNombre, tipo,
  cliente->{_id, nombreComercial},
  clienteNombre, instructor, fecha,
  duracionHoras, modalidad, numParticipantes, estado
}`

export const capacitacionByIdQuery = groq`*[_type == "crmCapacitacion" && _id == $id][0] {
  _id, codigo, cursoNombre, tipo,
  cliente->{_id, nombreComercial},
  clienteNombre, instructor, fecha,
  duracionHoras, modalidad, numParticipantes, estado,
  participantes, evaluacion
}`

export const capacitacionCountQuery = groq`count(*[_type == "crmCapacitacion"])`

// Desarrollo
export const allDesarrolloQuery = groq`*[_type == "crmDesarrollo"] | order(fechaInicio desc) {
  _id, codigo, nombre, descripcion, categoria,
  prioridad, responsable, fechaInicio, fechaLimite,
  avance, estado
}`

export const desarrolloByIdQuery = groq`*[_type == "crmDesarrollo" && _id == $id][0] {
  _id, codigo, nombre, descripcion, categoria,
  prioridad, responsable, fechaInicio, fechaLimite,
  avance, estado, tareas
}`

export const desarrolloCountQuery = groq`count(*[_type == "crmDesarrollo"])`

// Dashboard aggregates
export const dashboardStatsQuery = groq`{
  "totalClientes": count(*[_type == "crmCliente"]),
  "clientesActivos": count(*[_type == "crmCliente" && estado == "Activo"]),
  "totalCertificaciones": count(*[_type == "crmCertificacion"]),
  "certificacionesActivas": count(*[_type == "crmCertificacion" && estado == "Activo"]),
  "totalAuditorias": count(*[_type == "crmAuditoria"]),
  "auditoriasPlaneadas": count(*[_type == "crmAuditoria" && estado == "Planificada"]),
  "totalDiagnosticos": count(*[_type == "crmDiagnostico"]),
  "diagnosticosPendientes": count(*[_type == "crmDiagnostico" && estado in ["Programado", "En ejecución"]]),
  "totalCapacitaciones": count(*[_type == "crmCapacitacion"]),
  "totalConsultorias": count(*[_type == "crmConsultoria"]),
  "recentCertificaciones": *[_type == "crmCertificacion"] | order(fechaInicio desc) [0...5] {
    _id, codigo, clienteNombre, normas, faseActual, avanceGlobal, estado, prioridad
  },
  "proximasAuditorias": *[_type == "crmAuditoria" && estado == "Planificada"] | order(fechaInicio asc) [0...5] {
    _id, codigo, clienteNombre, tipo, fechaInicio, auditorLider
  },
  "desarrolloEnProgreso": *[_type == "crmDesarrollo" && estado in ["En progreso", "Por hacer"]] | order(fechaInicio desc) [0...5] {
    _id, codigo, nombre, avance, estado, prioridad, responsable
  }
}`
