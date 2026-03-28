import { NextRequest, NextResponse } from 'next/server'
import { sanityRead } from '@/lib/sanity.server'
import groq from 'groq'

const CLIENTE_INFO = groq`*[_type == "crmCliente" && _id == $clienteId][0]{
  _id, codigo, razonSocial, nombreComercial, nif, sector, tamano,
  numEmpleados, telefono, email, direccion, ciudad, pais, estado,
  consultorAsignado, fechaAlta, certificaciones
}`

const DIAGNOSTICOS = groq`*[_type == "crmDiagnostico" && cliente._ref == $clienteId] | order(fechaVisita desc) {
  _id, codigo, normas, estado, fechaVisita, consultorAsignado,
  cumplimientoGlobal, viabilidad, tiempoEstimado, resumenEjecutivo
}`

const CERTIFICACIONES = groq`*[_type == "crmCertificacion" && cliente._ref == $clienteId] | order(fechaInicio desc) {
  _id, codigo, normas, faseActual, avanceGlobal, consultorLider,
  fechaInicio, fechaObjetivo, estado, prioridad, fases
}`

const AUDITORIAS = groq`*[_type == "crmAuditoria" && cliente._ref == $clienteId] | order(fechaInicio desc) {
  _id, codigo, tipo, normas, fechaInicio, fechaFin, auditorLider,
  estado, numNCMayores, numNCMenores, numObservaciones, resultado
}`

const CONSULTORIAS = groq`*[_type == "crmConsultoria" && cliente._ref == $clienteId] | order(fechaInicio desc) {
  _id, codigo, tipo, normas, consultorLider, fechaInicio, fechaFinPlan,
  estado, avance
}`

const CAPACITACIONES = groq`*[_type == "crmCapacitacion" && cliente._ref == $clienteId] | order(fecha desc) {
  _id, codigo, cursoNombre, tipo, instructor, fecha, duracionHoras,
  modalidad, numParticipantes, estado
}`

export async function GET(req: NextRequest) {
  const clienteId = req.headers.get('x-cliente-ref')

  if (!clienteId) {
    return NextResponse.json({ error: 'No se encontró referencia de cliente' }, { status: 403 })
  }

  try {
    const client = sanityRead()
    const [empresa, diagnosticos, certificaciones, auditorias, consultorias, capacitaciones] =
      await Promise.all([
        client.fetch(CLIENTE_INFO, { clienteId }),
        client.fetch(DIAGNOSTICOS, { clienteId }),
        client.fetch(CERTIFICACIONES, { clienteId }),
        client.fetch(AUDITORIAS, { clienteId }),
        client.fetch(CONSULTORIAS, { clienteId }),
        client.fetch(CAPACITACIONES, { clienteId }),
      ])

    return NextResponse.json({
      empresa,
      diagnosticos,
      certificaciones,
      auditorias,
      consultorias,
      capacitaciones,
    })
  } catch (e) {
    console.error('Portal mis-casos error:', e)
    return NextResponse.json({ error: 'Error al cargar datos' }, { status: 500 })
  }
}
