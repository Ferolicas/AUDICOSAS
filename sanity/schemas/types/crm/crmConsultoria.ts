import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'crmConsultoria',
  title: 'CRM - Consultoría',
  type: 'document',
  fields: [
    defineField({ name: 'codigo', title: 'Código', type: 'string', validation: r => r.required() }),
    defineField({ name: 'cliente', title: 'Cliente', type: 'reference', to: [{ type: 'crmCliente' }], validation: r => r.required() }),
    defineField({ name: 'clienteNombre', title: 'Nombre Cliente', type: 'string' }),
    defineField({
      name: 'tipo', title: 'Tipo', type: 'string',
      options: { list: ['Implementación SGC', 'Mantenimiento', 'Mejora continua', 'Integración normas', 'Otro'] },
      validation: r => r.required()
    }),
    defineField({
      name: 'normas', title: 'Normas', type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 27001:2022', 'ISO 50001:2018'] }
    }),
    defineField({ name: 'consultorLider', title: 'Consultor Líder', type: 'string' }),
    defineField({ name: 'fechaInicio', title: 'Fecha Inicio', type: 'date', validation: r => r.required() }),
    defineField({ name: 'fechaFinPlan', title: 'Fecha Fin Plan', type: 'date', validation: r => r.required() }),
    defineField({
      name: 'estado', title: 'Estado', type: 'string',
      options: { list: ['Propuesta', 'Activo', 'Pausado', 'Completado', 'Cancelado'] },
      initialValue: 'Propuesta'
    }),
    defineField({ name: 'valorContratado', title: 'Valor Contratado', type: 'number' }),
    defineField({ name: 'avance', title: 'Avance (%)', type: 'number', validation: r => r.min(0).max(100), initialValue: 0 }),
    defineField({
      name: 'sesiones', title: 'Sesiones', type: 'array',
      of: [{
        type: 'object',
        name: 'sesionConsultoria',
        fields: [
          defineField({ name: 'fecha', title: 'Fecha', type: 'datetime' }),
          defineField({ name: 'duracionHoras', title: 'Duración (horas)', type: 'number' }),
          defineField({ name: 'tema', title: 'Tema', type: 'string' }),
          defineField({ name: 'notas', title: 'Notas', type: 'text' }),
        ]
      }]
    }),
    defineField({
      name: 'entregables', title: 'Entregables', type: 'array',
      of: [{
        type: 'object',
        name: 'entregableConsultoria',
        fields: [
          defineField({ name: 'nombre', title: 'Nombre', type: 'string' }),
          defineField({ name: 'fechaEntrega', title: 'Fecha Entrega', type: 'date' }),
          defineField({ name: 'archivo', title: 'Archivo', type: 'file' }),
        ]
      }]
    }),
  ],
  preview: {
    select: { title: 'clienteNombre', subtitle: 'codigo' }
  }
})
