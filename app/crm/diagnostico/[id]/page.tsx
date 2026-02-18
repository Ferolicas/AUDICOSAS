"use client"

import { useParams } from "next/navigation"
import { useCrmData } from "@/components/crm/providers/SWRProvider"
import DiagnosticoDetalleClient from "./DiagnosticoDetalleClient"
import { CrmNotFound } from "@/components/crm/shared/CrmLoading"

export default function DiagnosticoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { diagnosticos } = useCrmData()
  const diagnostico = (diagnosticos as any[]).find((d: any) => d._id === id)
  if (!diagnostico) return <CrmNotFound message="Diagnóstico no encontrado" />
  return <DiagnosticoDetalleClient diagnostico={diagnostico} />
}
