import { Badge } from "@/components/crm/ui/badge"

interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', className: string }> = {
      'Programado': { variant: 'default', className: 'bg-blue-500 text-white hover:bg-blue-600' },
      'Planificada': { variant: 'default', className: 'bg-blue-500 text-white hover:bg-blue-600' },
      'En ejecución': { variant: 'default', className: 'bg-orange-500 text-white hover:bg-orange-600' },
      'En progreso': { variant: 'default', className: 'bg-orange-500 text-white hover:bg-orange-600' },
      'Completado': { variant: 'default', className: 'bg-green-500 text-white hover:bg-green-600' },
      'Completada': { variant: 'default', className: 'bg-green-500 text-white hover:bg-green-600' },
      'Ejecutada': { variant: 'default', className: 'bg-green-500 text-white hover:bg-green-600' },
      'Cancelado': { variant: 'destructive', className: '' },
      'Cancelada': { variant: 'destructive', className: '' },
      'Pendiente': { variant: 'secondary', className: '' },
      'Activo': { variant: 'default', className: 'bg-green-500 text-white hover:bg-green-600' },
      'Inactivo': { variant: 'secondary', className: '' },
      'Pausado': { variant: 'outline', className: '' },
      'Prospecto': { variant: 'outline', className: 'border-blue-500 text-blue-400' },
      'Vigente': { variant: 'default', className: 'bg-green-500 text-white hover:bg-green-600' },
      'Vencido': { variant: 'destructive', className: '' },
      'En proceso': { variant: 'default', className: 'bg-orange-500 text-white hover:bg-orange-600' },
      'Conforme': { variant: 'default', className: 'bg-green-500 text-white hover:bg-green-600' },
      'No conforme': { variant: 'destructive', className: '' },
      'Conforme con observaciones': { variant: 'default', className: 'bg-yellow-500 text-white hover:bg-yellow-600' },
      'Propuesta': { variant: 'outline', className: 'border-purple-500 text-purple-400' },
      'Por hacer': { variant: 'secondary', className: '' },
      'En revisión': { variant: 'default', className: 'bg-yellow-500 text-white hover:bg-yellow-600' },
    }
    return configs[status] || { variant: 'default' as const, className: '' }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  )
}
