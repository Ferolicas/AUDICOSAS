import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'crmCapacitacion',
  title: 'CRM - Capacitación',
  type: 'document',
  fields: [
    defineField({ name: 'codigo', title: 'Código', type: 'string', validation: r => r.required() }),
    defineField({ name: 'cursoNombre', title: 'Nombre del Curso', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'tipo', title: 'Tipo', type: 'string',
      options: { list: ['Sensibilización', 'Implementación', 'Auditor interno', 'Interpretación norma', 'Herramientas', 'Otro'] },
      validation: r => r.required()
    }),
    defineField({ name: 'cliente', title: 'Cliente', type: 'reference', to: [{ type: 'crmCliente' }], validation: r => r.required() }),
    defineField({ name: 'clienteNombre', title: 'Nombre Cliente', type: 'string' }),
    defineField({ name: 'instructor', title: 'Instructor', type: 'string' }),
    defineField({ name: 'fecha', title: 'Fecha', type: 'date', validation: r => r.required() }),
    defineField({ name: 'duracionHoras', title: 'Duración (horas)', type: 'number', validation: r => r.required().positive() }),
    defineField({
      name: 'modalidad', title: 'Modalidad', type: 'string',
      options: { list: ['Presencial', 'Virtual', 'Híbrido'] }
    }),
    defineField({ name: 'numParticipantes', title: 'Número de Participantes', type: 'number' }),
    defineField({
      name: 'estado', title: 'Estado', type: 'string',
      options: { list: ['Programada', 'Ejecutada', 'Cancelada'] },
      initialValue: 'Programada'
    }),
    defineField({
      name: 'participantes', title: 'Participantes', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'nombre', title: 'Nombre', type: 'string' }),
          defineField({ name: 'cargo', title: 'Cargo', type: 'string' }),
          defineField({ name: 'email', title: 'Email', type: 'string' }),
          defineField({ name: 'asistio', title: 'Asistió', type: 'boolean', initialValue: false }),
          defineField({ name: 'calificacion', title: 'Calificación', type: 'number', validation: r => r.min(1).max(5) }),
        ]
      }]
    }),
    defineField({
      name: 'evaluacion', title: 'Evaluación', type: 'object',
      fields: [
        defineField({ name: 'satisfaccionPromedio', title: 'Satisfacción Promedio', type: 'number', validation: r => r.min(1).max(5) }),
        defineField({ name: 'comentarios', title: 'Comentarios', type: 'text' }),
      ]
    }),
  ],
  preview: {
    select: { title: 'cursoNombre', subtitle: 'codigo' }
  }
})
