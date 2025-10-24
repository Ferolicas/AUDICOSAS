import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'subscriber',
  title: 'Suscriptor',
  type: 'document',
  fields: [
    defineField({ name: 'email', title: 'Email', type: 'string', validation: r => r.required() }),
    defineField({ name: 'name', title: 'Nombre', type: 'string' }),
    defineField({ name: 'client', title: 'Cliente', type: 'reference', to: [{ type: 'client' }] }),
    defineField({ name: 'unsubscribed', title: 'Desuscrito', type: 'boolean', initialValue: false })
  ]
})

