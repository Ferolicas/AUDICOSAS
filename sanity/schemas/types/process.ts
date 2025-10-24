import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'process',
  title: 'Proceso',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: r => r.required() }),
    defineField({ name: 'stage', title: 'Etapa', type: 'string' }),
    defineField({ name: 'status', title: 'Estado', type: 'string' }),
    defineField({ name: 'dueDate', title: 'Vencimiento', type: 'datetime' }),
    defineField({ name: 'notes', title: 'Notas', type: 'text' }),
    defineField({ name: 'client', title: 'Cliente', type: 'reference', to: [{ type: 'client' }], validation: r => r.required() }),
  ]
})

