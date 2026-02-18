import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'crmDesarrollo',
  title: 'CRM - Desarrollo',
  type: 'document',
  fields: [
    defineField({ name: 'codigo', title: 'Código', type: 'string', validation: r => r.required() }),
    defineField({ name: 'nombre', title: 'Nombre', type: 'string', validation: r => r.required() }),
    defineField({ name: 'descripcion', title: 'Descripción', type: 'text', validation: r => r.required() }),
    defineField({
      name: 'categoria', title: 'Categoría', type: 'string',
      options: { list: ['Mejora de servicios', 'Nuevo producto', 'Proceso interno', 'Marketing', 'Tecnología', 'Otro'] },
      validation: r => r.required()
    }),
    defineField({
      name: 'prioridad', title: 'Prioridad', type: 'string',
      options: { list: ['Urgente', 'Alta', 'Media', 'Baja'] },
      initialValue: 'Media'
    }),
    defineField({ name: 'responsable', title: 'Responsable', type: 'string' }),
    defineField({ name: 'fechaInicio', title: 'Fecha Inicio', type: 'date', validation: r => r.required() }),
    defineField({ name: 'fechaLimite', title: 'Fecha Límite', type: 'date', validation: r => r.required() }),
    defineField({ name: 'avance', title: 'Avance (%)', type: 'number', validation: r => r.min(0).max(100), initialValue: 0 }),
    defineField({
      name: 'estado', title: 'Estado', type: 'string',
      options: { list: ['Por hacer', 'En progreso', 'En revisión', 'Completado'] },
      initialValue: 'Por hacer'
    }),
    defineField({
      name: 'tareas', title: 'Tareas', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'nombre', title: 'Nombre', type: 'string' }),
          defineField({ name: 'responsable', title: 'Responsable', type: 'string' }),
          defineField({ name: 'estado', title: 'Estado', type: 'string', options: { list: ['Pendiente', 'En progreso', 'Completada'] } }),
          defineField({ name: 'fechaLimite', title: 'Fecha Límite', type: 'date' }),
        ]
      }]
    }),
  ],
  preview: {
    select: { title: 'nombre', subtitle: 'codigo' }
  }
})
