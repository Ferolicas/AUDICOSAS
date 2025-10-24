import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: r => r.required() }),
    defineField({ name: 'role', title: 'Cargo', type: 'string' }),
    defineField({ name: 'quote', title: 'Cita', type: 'text', validation: r => r.required() })
  ]
})

