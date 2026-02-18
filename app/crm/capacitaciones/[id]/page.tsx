"use client"

import { useParams } from "next/navigation"
import { useCrmData } from "@/components/crm/providers/SWRProvider"
import CapacitacionDetalleClient from "./CapacitacionDetalleClient"
import { CrmNotFound } from "@/components/crm/shared/CrmLoading"

export default function CapacitacionDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { capacitaciones } = useCrmData()
  const capacitacion = (capacitaciones as any[]).find((c: any) => c._id === id)
  if (!capacitacion) return <CrmNotFound message="Capacitación no encontrada" />
  return <CapacitacionDetalleClient capacitacion={capacitacion} />
}
