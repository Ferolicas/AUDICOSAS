"use client"

import { useParams } from "next/navigation"
import { useCrmData } from "@/components/crm/providers/SWRProvider"
import ConsultoriaDetalleClient from "./ConsultoriaDetalleClient"
import { CrmNotFound } from "@/components/crm/shared/CrmLoading"

export default function ConsultoriaDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { consultorias } = useCrmData()
  const consultoria = (consultorias as any[]).find((c: any) => c._id === id)
  if (!consultoria) return <CrmNotFound message="Consultoría no encontrada" />
  return <ConsultoriaDetalleClient consultoria={consultoria} />
}
