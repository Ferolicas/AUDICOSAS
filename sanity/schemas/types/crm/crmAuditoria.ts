import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'crmAuditoria',
  title: 'CRM - Auditoría',
  type: 'document',
  fields: [
    defineField({ name: 'codigo', title: 'Código', type: 'string', validation: r => r.required() }),
    defineField({ name: 'cliente', title: 'Cliente', type: 'reference', to: [{ type: 'crmCliente' }], validation: r => r.required() }),
    defineField({ name: 'clienteNombre', title: 'Nombre Cliente', type: 'string' }),
    defineField({
      name: 'tipo', title: 'Tipo', type: 'string',
      options: { list: ['Primera parte (interna)', 'Segunda parte (proveedores)', 'Tercera parte (certificación)'] },
      validation: r => r.required()
    }),
    defineField({
      name: 'normas', title: 'Normas', type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'ISO 27001:2022', 'ISO 50001:2018'] }
    }),
    defineField({ name: 'fechaInicio', title: 'Fecha Inicio', type: 'date', validation: r => r.required() }),
    defineField({ name: 'fechaFin', title: 'Fecha Fin', type: 'date', validation: r => r.required() }),
    defineField({ name: 'auditorLider', title: 'Auditor Líder', type: 'string' }),
    defineField({
      name: 'estado', title: 'Estado', type: 'string',
      options: { list: ['Planificada', 'En ejecución', 'Completada', 'Cancelada'] },
      initialValue: 'Planificada'
    }),
    defineField({ name: 'numNCMayores', title: 'NC Mayores', type: 'number', initialValue: 0 }),
    defineField({ name: 'numNCMenores', title: 'NC Menores', type: 'number', initialValue: 0 }),
    defineField({ name: 'numObservaciones', title: 'Observaciones', type: 'number', initialValue: 0 }),
    defineField({
      name: 'resultado', title: 'Resultado', type: 'string',
      options: { list: ['Conforme', 'No conforme', 'Conforme con observaciones'] }
    }),
    defineField({
      name: 'hallazgos', title: 'Hallazgos', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'tipo', title: 'Tipo', type: 'string', options: { list: ['NC Mayor', 'NC Menor', 'Observación', 'Oportunidad de mejora'] } }),
          defineField({ name: 'clausula', title: 'Cláusula', type: 'string' }),
          defineField({ name: 'descripcion', title: 'Descripción', type: 'text' }),
          defineField({ name: 'evidencia', title: 'Evidencia', type: 'text' }),
        ]
      }]
    }),
    defineField({
      name: 'accionesCorrectivas', title: 'Acciones Correctivas', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'hallazgoRef', title: 'Referencia Hallazgo', type: 'string' }),
          defineField({ name: 'descripcion', title: 'Descripción', type: 'text' }),
          defineField({ name: 'responsable', title: 'Responsable', type: 'string' }),
          defineField({ name: 'fechaLimite', title: 'Fecha Límite', type: 'date' }),
          defineField({ name: 'estado', title: 'Estado', type: 'string', options: { list: ['Pendiente', 'En proceso', 'Cerrada'] } }),
        ]
      }]
    }),
    defineField({ name: 'informe', title: 'Informe', type: 'file' }),
  ],
  preview: {
    select: { title: 'clienteNombre', subtitle: 'codigo' }
  }
})
