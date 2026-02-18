import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'crmCliente',
  title: 'CRM - Cliente',
  type: 'document',
  fields: [
    defineField({ name: 'codigo', title: 'Código', type: 'string', validation: r => r.required() }),
    defineField({ name: 'razonSocial', title: 'Razón Social', type: 'string', validation: r => r.required() }),
    defineField({ name: 'nombreComercial', title: 'Nombre Comercial', type: 'string', validation: r => r.required() }),
    defineField({ name: 'nif', title: 'NIF / NIT', type: 'string', validation: r => r.required() }),
    defineField({ name: 'sector', title: 'Sector', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'tamano', title: 'Tamaño', type: 'string',
      options: { list: ['Micro', 'Pequeña', 'Mediana', 'Grande'] },
      validation: r => r.required()
    }),
    defineField({ name: 'numEmpleados', title: 'Número de Empleados', type: 'number', validation: r => r.required().positive() }),
    defineField({ name: 'telefono', title: 'Teléfono', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: r => r.required().email() }),
    defineField({ name: 'direccion', title: 'Dirección', type: 'string' }),
    defineField({ name: 'ciudad', title: 'Ciudad', type: 'string' }),
    defineField({ name: 'pais', title: 'País', type: 'string', initialValue: 'Colombia' }),
    defineField({
      name: 'estado', title: 'Estado', type: 'string',
      options: { list: ['Prospecto', 'Activo', 'Inactivo', 'Ex-cliente'] },
      initialValue: 'Prospecto',
      validation: r => r.required()
    }),
    defineField({ name: 'consultorAsignado', title: 'Consultor Asignado', type: 'string' }),
    defineField({ name: 'fechaAlta', title: 'Fecha de Alta', type: 'date' }),
    defineField({
      name: 'certificaciones', title: 'Certificaciones', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'norma', title: 'Norma', type: 'string' }),
          defineField({ name: 'organismo', title: 'Organismo', type: 'string' }),
          defineField({ name: 'fechaEmision', title: 'Fecha Emisión', type: 'date' }),
          defineField({ name: 'vigenciaHasta', title: 'Vigencia Hasta', type: 'date' }),
          defineField({ name: 'numeroCertificado', title: 'Nº Certificado', type: 'string' }),
          defineField({
            name: 'estado', title: 'Estado', type: 'string',
            options: { list: ['Vigente', 'Vencido', 'En proceso'] }
          }),
        ]
      }]
    }),
  ],
  preview: {
    select: { title: 'nombreComercial', subtitle: 'codigo' }
  }
})
