import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'crmUsuario',
  title: 'CRM - Usuario',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre completo',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'email',
      title: 'Correo electrónico',
      type: 'string',
      validation: r => r.required().email(),
    }),
    defineField({
      name: 'passwordHash',
      title: 'Contraseña (hash)',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'rol',
      title: 'Rol',
      type: 'string',
      options: {
        list: [
          { title: 'Administrador', value: 'admin' },
          { title: 'Consultor', value: 'consultor' },
          { title: 'Auditor', value: 'auditor' },
          { title: 'Visor', value: 'visor' },
        ],
      },
      initialValue: 'consultor',
    }),
    defineField({
      name: 'estado',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Activo', value: 'activo' },
          { title: 'Inactivo', value: 'inactivo' },
        ],
      },
      initialValue: 'activo',
    }),
    defineField({
      name: 'resetToken',
      title: 'Token de restablecimiento',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'resetTokenExpiry',
      title: 'Expiración del token',
      type: 'datetime',
      hidden: true,
    }),
  ],
  preview: {
    select: { title: 'nombre', subtitle: 'email' },
  },
})
