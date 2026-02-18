const PREFIXES: Record<string, string> = {
  crmCliente: 'CLI',
  crmDiagnostico: 'DX',
  crmCertificacion: 'CERT',
  crmAuditoria: 'AUD',
  crmConsultoria: 'CON',
  crmCapacitacion: 'CAP',
  crmDesarrollo: 'DEV',
}

export function generateCodigo(type: string, count: number): string {
  const prefix = PREFIXES[type] || 'GEN'
  const year = new Date().getFullYear()
  const num = String(count + 1).padStart(3, '0')
  return `${prefix}-${year}-${num}`
}
