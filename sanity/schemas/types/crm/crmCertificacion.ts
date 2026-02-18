import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'crmCertificacion',
  title: 'CRM - Certificación',
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
    defineField({ name: 'faseActual', title: 'Fase Actual', type: 'number', validation: r => r.required().min(1).max(5), initialValue: 1 }),
    defineField({ name: 'avanceGlobal', title: 'Avance Global (%)', type: 'number', validation: r => r.min(0).max(100), initialValue: 0 }),
    defineField({ name: 'consultorLider', title: 'Consultor Líder', type: 'string' }),
    defineField({ name: 'fechaInicio', title: 'Fecha Inicio', type: 'date', validation: r => r.required() }),
    defineField({ name: 'fechaObjetivo', title: 'Fecha Objetivo', type: 'date', validation: r => r.required() }),
    defineField({
      name: 'estado', title: 'Estado', type: 'string',
      options: { list: ['Activo', 'Pausado', 'Completado', 'Cancelado'] },
      initialValue: 'Activo'
    }),
    defineField({ name: 'valorProyecto', title: 'Valor del Proyecto', type: 'number' }),
    defineField({
      name: 'prioridad', title: 'Prioridad', type: 'string',
      options: { list: ['Urgente', 'Alta', 'Media', 'Baja'] },
      initialValue: 'Media'
    }),
    defineField({ name: 'diagnosticoOrigen', title: 'Diagnóstico Origen', type: 'string' }),
    defineField({
      name: 'fases', title: 'Fases', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'numero', title: 'Número', type: 'number' }),
          defineField({ name: 'nombre', title: 'Nombre', type: 'string' }),
          defineField({ name: 'avance', title: 'Avance (%)', type: 'number', validation: r => r.min(0).max(100) }),
          defineField({
            name: 'tareas', title: 'Tareas', type: 'array',
            of: [{
              type: 'object',
              fields: [
                defineField({ name: 'nombre', title: 'Nombre', type: 'string' }),
                defineField({ name: 'completada', title: 'Completada', type: 'boolean', initialValue: false }),
              ]
            }]
          }),
          defineField({
            name: 'entregables', title: 'Entregables', type: 'array',
            of: [{
              type: 'object',
              fields: [
                defineField({ name: 'nombre', title: 'Nombre', type: 'string' }),
                defineField({ name: 'completado', title: 'Completado', type: 'boolean', initialValue: false }),
              ]
            }]
          }),
        ]
      }]
    }),
  ],
  preview: {
    select: { title: 'clienteNombre', subtitle: 'codigo' }
  }
})
