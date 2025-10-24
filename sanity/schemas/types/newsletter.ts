import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'newsletter',
  title: 'Newsletter',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: r => r.required() }),
    defineField({ name: 'content', title: 'Contenido', type: 'text' }),
    defineField({ name: 'recipients', title: 'Destinatarios', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'sentAt', title: 'Enviado el', type: 'datetime' })
  ]
})

