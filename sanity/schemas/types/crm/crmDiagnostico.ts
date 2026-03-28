import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'crmDiagnostico',
  title: 'CRM - Diagnóstico',
  type: 'document',
  groups: [
    { name: 'general', title: 'General' },
    { name: 'empresa', title: '1. Sobre la empresa' },
    { name: 'situacion', title: '2. Situación actual' },
    { name: 'necesidades', title: '3. Necesidades y objetivos' },
    { name: 'alcance', title: '4. Alcance y recursos' },
    { name: 'servicios', title: '5. Servicios buscados' },
    { name: 'resultados', title: 'Resultados' },
  ],
  fields: [
    // General
    defineField({ name: 'codigo', title: 'Código', type: 'string', validation: r => r.required(), group: 'general' }),
    defineField({ name: 'cliente', title: 'Cliente', type: 'reference', to: [{ type: 'crmCliente' }], validation: r => r.required(), group: 'general' }),
    defineField({ name: 'clienteNombre', title: 'Nombre Cliente', type: 'string', group: 'general' }),
    defineField({
      name: 'normas', title: 'Normas', type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 27001:2022', 'ISO 50001:2018'] },
      group: 'general'
    }),
    defineField({
      name: 'estado', title: 'Estado', type: 'string',
      options: { list: ['Programado', 'En ejecución', 'Completado', 'Cancelado'] },
      initialValue: 'Programado', group: 'general'
    }),
    defineField({ name: 'fechaVisita', title: 'Fecha de Visita', type: 'date', validation: r => r.required(), group: 'general' }),
    defineField({ name: 'consultorAsignado', title: 'Consultor Asignado', type: 'string', group: 'general' }),
    // Sección 1 - Sobre la empresa
    defineField({ name: 'actividadPrincipal', title: 'Actividad principal / Productos-servicios', type: 'text', rows: 2, group: 'empresa' }),
    defineField({ name: 'mercadosOperacion', title: 'Mercados/sectores donde opera', type: 'string', group: 'empresa' }),
    defineField({ name: 'numSedes', title: 'Número de sedes', type: 'number', group: 'empresa' }),
    defineField({
      name: 'nivelRegulacion', title: 'Nivel de regulación del sector', type: 'string',
      options: { list: ['Alto', 'Medio', 'Bajo'] }, group: 'empresa'
    }),
    // Sección 2 - Situación actual frente a normas
    defineField({ name: 'certificacionesExistentes', title: 'Certificaciones ISO existentes', type: 'text', rows: 2, group: 'situacion' }),
    defineField({ name: 'situacionCalidad', title: 'Situación en Calidad (ISO 9001)', type: 'text', rows: 3, group: 'situacion' }),
    defineField({ name: 'situacionAmbiental', title: 'Situación Ambiental (ISO 14001)', type: 'text', rows: 3, group: 'situacion' }),
    defineField({ name: 'situacionSST', title: 'Situación SST (ISO 45001)', type: 'text', rows: 3, group: 'situacion' }),
    defineField({ name: 'responsableInterno', title: 'Responsable interno del sistema de gestión', type: 'string', group: 'situacion' }),
    // Sección 3 - Necesidades y objetivos
    defineField({
      name: 'motivacion', title: 'Motivación para buscar el servicio', type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['Clientes / contratos', 'Licitaciones', 'Cumplimiento legal', 'Mejora interna', 'Imagen / reputación', 'Otro'] },
      group: 'necesidades'
    }),
    defineField({ name: 'objetivosPrincipales', title: 'Objetivos principales', type: 'text', rows: 3, group: 'necesidades' }),
    defineField({ name: 'fechaObjetivoCertificacion', title: 'Fecha objetivo de certificación', type: 'date', group: 'necesidades' }),
    defineField({ name: 'experienciaPrevia', title: 'Experiencia previa con consultores', type: 'text', rows: 3, group: 'necesidades' }),
    // Sección 4 - Alcance, recursos y restricciones
    defineField({ name: 'alcancePropuesto', title: 'Alcance propuesto (procesos/sedes)', type: 'text', rows: 3, group: 'alcance' }),
    defineField({ name: 'recursosInternos', title: 'Recursos internos disponibles', type: 'text', rows: 3, group: 'alcance' }),
    defineField({
      name: 'modalidadPreferida', title: 'Modalidad preferida', type: 'string',
      options: { list: ['Presencial', 'Virtual', 'Híbrido'] }, group: 'alcance'
    }),
    defineField({ name: 'restricciones', title: 'Restricciones relevantes', type: 'text', rows: 2, group: 'alcance' }),
    // Sección 5 - Servicios que buscan
    defineField({
      name: 'serviciosBuscados', title: 'Servicios buscados', type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['Implementación completa hasta certificación', 'Apoyo puntual (diagnóstico, documentación, capacitación)', 'Auditorías internas independientes', 'Acompañamiento en auditoría de certificación', 'Mantenimiento y mejora del sistema certificado'] },
      group: 'servicios'
    }),
    defineField({
      name: 'enfoqueAuditoria', title: 'Enfoque de auditoría interna', type: 'string',
      options: { list: ['Integral (9001, 14001, 45001)', 'Por norma', 'Procesos críticos'] }, group: 'servicios'
    }),
    defineField({ name: 'temasCapacitacion', title: 'Temas de capacitación prioritarios', type: 'text', rows: 2, group: 'servicios' }),
    // Resultados del diagnóstico
    defineField({ name: 'cumplimientoGlobal', title: 'Cumplimiento Global (%)', type: 'number', validation: r => r.min(0).max(100), group: 'resultados' }),
    defineField({
      name: 'viabilidad', title: 'Viabilidad', type: 'string',
      options: { list: ['Alta', 'Media', 'Baja'] }, group: 'resultados'
    }),
    defineField({ name: 'tiempoEstimado', title: 'Tiempo Estimado (meses)', type: 'number', group: 'resultados' }),
    defineField({ name: 'inversionEstimada', title: 'Inversión Estimada', type: 'number', group: 'resultados' }),
    defineField({ name: 'resumenEjecutivo', title: 'Resumen Ejecutivo', type: 'text', group: 'resultados' }),
    defineField({
      name: 'cotizacion', title: 'Cotización', type: 'array',
      of: [{
        type: 'object',
        name: 'itemCotizacion',
        fields: [
          defineField({ name: 'concepto', title: 'Concepto', type: 'string' }),
          defineField({ name: 'valor', title: 'Valor', type: 'number' }),
        ]
      }],
      group: 'resultados'
    }),
  ],
  preview: {
    select: { title: 'clienteNombre', subtitle: 'codigo' }
  }
})
