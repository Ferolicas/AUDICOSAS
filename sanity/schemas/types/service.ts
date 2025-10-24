import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: r => r.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'text' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } })
  ]
})

