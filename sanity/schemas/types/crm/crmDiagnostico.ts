import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'crmDiagnostico',
  title: 'CRM - Diagnóstico',
  type: 'document',
  fields: [
    defineField({ name: 'codigo', title: 'Código', type: 'string', validation: r => r.required() }),
    defineField({ name: 'cliente', title: 'Cliente', type: 'reference', to: [{ type: 'crmCliente' }], validation: r => r.required() }),
    defineField({ name: 'clienteNombre', title: 'Nombre Cliente', type: 'string' }),
    defineField({
      name: 'normas', title: 'Normas', type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 27001:2022', 'ISO 50001:2018'] }
    }),
    defineField({
      name: 'estado', title: 'Estado', type: 'string',
      options: { list: ['Programado', 'En ejecución', 'Completado', 'Cancelado'] },
      initialValue: 'Programado'
    }),
    defineField({ name: 'fechaVisita', title: 'Fecha de Visita', type: 'date', validation: r => r.required() }),
    defineField({ name: 'consultorAsignado', title: 'Consultor Asignado', type: 'string' }),
    defineField({ name: 'cumplimientoGlobal', title: 'Cumplimiento Global (%)', type: 'number', validation: r => r.min(0).max(100) }),
    defineField({
      name: 'viabilidad', title: 'Viabilidad', type: 'string',
      options: { list: ['Alta', 'Media', 'Baja'] }
    }),
    defineField({ name: 'tiempoEstimado', title: 'Tiempo Estimado (meses)', type: 'number' }),
    defineField({ name: 'inversionEstimada', title: 'Inversión Estimada', type: 'number' }),
    defineField({ name: 'resumenEjecutivo', title: 'Resumen Ejecutivo', type: 'text' }),
    defineField({
      name: 'cotizacion', title: 'Cotización', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'concepto', title: 'Concepto', type: 'string' }),
          defineField({ name: 'valor', title: 'Valor', type: 'number' }),
        ]
      }]
    }),
  ],
  preview: {
    select: { title: 'clienteNombre', subtitle: 'codigo' }
  }
})
