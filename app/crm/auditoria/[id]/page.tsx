"use client"

import { useParams } from "next/navigation"
import { useCrmData } from "@/components/crm/providers/SWRProvider"
import AuditoriaDetalleClient from "./AuditoriaDetalleClient"
import { CrmNotFound } from "@/components/crm/shared/CrmLoading"

export default function AuditoriaDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { auditorias } = useCrmData()
  const auditoria = (auditorias as any[]).find((a: any) => a._id === id)
  if (!auditoria) return <CrmNotFound message="Auditoría no encontrada" />
  return <AuditoriaDetalleClient auditoria={auditoria} />
}
