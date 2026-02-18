import { Badge } from "@/components/crm/ui/badge"

interface PriorityIndicatorProps {
  priority: 'Urgente' | 'Alta' | 'Media' | 'Baja'
}

export function PriorityIndicator({ priority }: PriorityIndicatorProps) {
  const getConfig = () => {
    switch (priority) {
      case 'Urgente':
        return { color: 'bg-red-500', text: 'text-white', label: 'Urgente' }
      case 'Alta':
        return { color: 'bg-orange-500', text: 'text-white', label: 'Alta' }
      case 'Media':
        return { color: 'bg-yellow-500', text: 'text-white', label: 'Media' }
      case 'Baja':
        return { color: 'bg-green-500', text: 'text-white', label: 'Baja' }
    }
  }

  const config = getConfig()

  return (
    <Badge className={`${config.color} ${config.text} hover:${config.color}`}>
      {config.label}
    </Badge>
  )
}
