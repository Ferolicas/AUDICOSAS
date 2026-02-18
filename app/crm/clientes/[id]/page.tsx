"use client"

import { useParams } from "next/navigation"
import { useCrmData } from "@/components/crm/providers/SWRProvider"
import ClienteDetalleClient from "./ClienteDetalleClient"
import { CrmNotFound } from "@/components/crm/shared/CrmLoading"

export default function ClienteDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { clientes } = useCrmData()
  const cliente = (clientes as any[]).find((c: any) => c._id === id)
  if (!cliente) return <CrmNotFound message="Cliente no encontrado" />
  return <ClienteDetalleClient cliente={cliente} />
}
