"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { getPusherClient, CRM_CHANNEL, CRM_EVENT } from "@/lib/pusher-client"
import { toast } from "sonner"

interface CrmChangeEvent {
  action: 'created' | 'updated' | 'deleted'
  type: string
}

const TYPE_LABELS: Record<string, string> = {
  crmCliente: 'Cliente',
  crmDiagnostico: 'Diagnóstico',
  crmCertificacion: 'Certificación',
  crmAuditoria: 'Auditoría',
  crmConsultoria: 'Consultoría',
  crmCapacitacion: 'Capacitación',
  crmDesarrollo: 'Proyecto',
}

const ACTION_LABELS: Record<string, string> = {
  created: 'creado',
  updated: 'actualizado',
  deleted: 'eliminado',
}

export function PusherProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const pusher = getPusherClient()
    const channel = pusher.subscribe(CRM_CHANNEL)

    channel.bind(CRM_EVENT, (data: CrmChangeEvent) => {
      // Debounce: coalesce rapid consecutive events into a single refresh
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        router.refresh()

        const label = TYPE_LABELS[data?.type] ?? 'Registro'
        const action = ACTION_LABELS[data?.action] ?? 'modificado'
        toast.success(`${label} ${action}`, {
          description: 'Datos sincronizados en tiempo real',
          duration: 2500,
        })
      }, 300)
    })

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      channel.unbind_all()
      pusher.unsubscribe(CRM_CHANNEL)
    }
  }, [router])

  return <>{children}</>
}
