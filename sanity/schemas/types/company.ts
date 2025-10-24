import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'company',
  title: 'Empresa (Landing)',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string' }),
    defineField({ name: 'mission', title: 'Misión', type: 'text' }),
    defineField({ name: 'vision', title: 'Visión', type: 'text' }),
    defineField({ name: 'values', title: 'Valores', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'contactEmail', title: 'Correo', type: 'string' }),
    defineField({ name: 'phone', title: 'Teléfono', type: 'string' })
  ]
})

