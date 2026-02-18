import { Progress } from "@/components/crm/ui/progress"

interface ProgressBarProps {
  value: number
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, showLabel = true, className = "" }: ProgressBarProps) {
  const getColor = () => {
    if (value < 25) return 'bg-red-500'
    if (value < 50) return 'bg-orange-500'
    if (value < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <Progress value={value} className="h-2">
        <div
          className={`h-full ${getColor()} transition-all`}
          style={{ width: `${value}%` }}
        />
      </Progress>
      {showLabel && (
        <p className="text-xs text-right">{value}%</p>
      )}
    </div>
  )
}
