import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'client',
  title: 'Cliente',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: r => r.required() }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: r => r.required() }),
    defineField({ name: 'phone', title: 'Teléfono', type: 'string' }),
    defineField({ name: 'company', title: 'Empresa', type: 'string' }),
    defineField({ name: 'serviceInterest', title: 'Interés', type: 'string' }),
    defineField({ name: 'message', title: 'Mensaje', type: 'text' }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] })
  ]
})

