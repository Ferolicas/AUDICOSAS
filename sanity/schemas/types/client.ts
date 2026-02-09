import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'client',
  title: 'Cliente',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: r => r.required() }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: r => r.required() }),
    defineField({ name: 'phone', title: 'WhatsApp', type: 'string' }),
    defineField({ name: 'company', title: 'Empresa', type: 'string' }),
    defineField({ name: 'employees', title: 'No. Empleados', type: 'string' }),
    defineField({ name: 'sector', title: 'Sector / Industria', type: 'string' }),
    defineField({ name: 'serviceInterest', title: 'Certificación de Interés', type: 'string' }),
    defineField({ name: 'message', title: 'Mensaje', type: 'text' }),
    defineField({ name: 'subscribed', title: 'Suscrito al boletín', type: 'boolean', initialValue: false }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] })
  ],
  preview: {
    select: { title: 'name', subtitle: 'company' }
  }
})

