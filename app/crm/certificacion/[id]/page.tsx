"use client"

import { useParams } from "next/navigation"
import { useCrmData } from "@/components/crm/providers/SWRProvider"
import CertificacionDetalleClient from "./CertificacionDetalleClient"
import { CrmNotFound } from "@/components/crm/shared/CrmLoading"

export default function CertificacionDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { certificaciones } = useCrmData()
  const certificacion = (certificaciones as any[]).find((c: any) => c._id === id)
  if (!certificacion) return <CrmNotFound message="Certificación no encontrada" />
  return <CertificacionDetalleClient certificacion={certificacion} />
}
