import { sanityRead } from '@/lib/sanity.server'
import { jsonOk } from '@/lib/crm/api-helpers'
import { getAllCache, setAllCache } from '@/lib/crm/cache'
import groq from 'groq'

// Una sola query GROQ que trae TODOS los datos del CRM
const ALL_CRM_QUERY = groq`{
  "clientes": *[_type == "crmCliente"] | order(fechaAlta desc) {
    _id, codigo, razonSocial, nombreComercial, nif, sector, tamano,
    numEmpleados, telefono, email, direccion, ciudad, pais,
    estado, consultorAsignado, fechaAlta, certificaciones
  },
  "diagnosticos": *[_type == "crmDiagnostico"] | order(fechaVisita desc) {
    _id, codigo, cliente->{_id, nombreComercial},
    clienteNombre, normas, estado, fechaVisita,
    consultorAsignado, cumplimientoGlobal, viabilidad,
    tiempoEstimado, inversionEstimada
  },
  "certificaciones": *[_type == "crmCertificacion"] | order(fechaInicio desc) {
    _id, codigo, cliente->{_id, nombreComercial},
    clienteNombre, normas, faseActual, avanceGlobal,
    consultorLider, fechaInicio, fechaObjetivo,
    estado, valorProyecto, prioridad, diagnosticoOrigen
  },
  "auditorias": *[_type == "crmAuditoria"] | order(fechaInicio desc) {
    _id, codigo, cliente->{_id, nombreComercial},
    clienteNombre, tipo, normas, fechaInicio, fechaFin,
    auditorLider, estado, numNCMayores, numNCMenores,
    numObservaciones, resultado
  },
  "consultorias": *[_type == "crmConsultoria"] | order(fechaInicio desc) {
    _id, codigo, cliente->{_id, nombreComercial},
    clienteNombre, tipo, normas, consultorLider,
    fechaInicio, fechaFinPlan, estado, valorContratado, avance
  },
  "capacitaciones": *[_type == "crmCapacitacion"] | order(fecha desc) {
    _id, codigo, cursoNombre, tipo,
    cliente->{_id, nombreComercial},
    clienteNombre, instructor, fecha,
    duracionHoras, modalidad, numParticipantes, estado
  },
  "desarrollo": *[_type == "crmDesarrollo"] | order(fechaInicio desc) {
    _id, codigo, nombre, descripcion, categoria,
    prioridad, responsable, fechaInicio, fechaLimite,
    avance, estado
  },
  "stats": {
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
  }
}`

export async function GET() {
  const cached = getAllCache()
  if (cached) return jsonOk(cached)

  const data = await sanityRead().fetch(ALL_CRM_QUERY)
  setAllCache(data)
  return jsonOk(data)
}
