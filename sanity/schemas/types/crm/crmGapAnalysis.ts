import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'crmGapAnalysis',
  title: 'CRM - Diagnóstico GAP',
  type: 'document',
  fields: [
    defineField({ name: 'certId', title: 'Certificación ID', type: 'string', validation: r => r.required() }),
    defineField({ name: 'clienteId', title: 'Cliente ID', type: 'string' }),
    defineField({ name: 'clienteNombre', title: 'Cliente', type: 'string' }),
    defineField({ name: 'analistaResponsable', title: 'Analista Responsable', type: 'string' }),
    defineField({ name: 'fechaAnalisis', title: 'Fecha de Análisis', type: 'date' }),
    defineField({ name: 'cumplimientoTotal', title: 'Cumplimiento Total (%)', type: 'number' }),
    defineField({ name: 'observacionesGenerales', title: 'Observaciones Generales', type: 'text' }),
    defineField({
      name: 'clauses',
      title: 'Cláusulas',
      type: 'array',
      of: [{
        type: 'object',
        name: 'gapClause',
        fields: [
          defineField({ name: 'clauseId', title: 'Cláusula', type: 'string' }),
          defineField({
            name: 'estado',
            title: 'Estado',
            type: 'string',
            options: { list: ['Cumple', 'Cumple Parcial', 'No Cumple', 'N/A'] }
          }),
          defineField({ name: 'porcentaje', title: '% Cumplimiento', type: 'number' }),
          defineField({ name: 'comentarios', title: 'Comentarios / Evidencias', type: 'text' }),
          defineField({ name: 'accionPropuesta', title: 'Acción Propuesta', type: 'text' }),
        ]
      }]
    }),
  ],
  preview: {
    select: { title: 'clienteNombre', subtitle: 'certId' }
  }
})
