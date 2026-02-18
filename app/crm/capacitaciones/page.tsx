"use client"

import { useCrmData } from "@/components/crm/providers/SWRProvider"
import CapacitacionesListaClient from "./CapacitacionesListaClient"

export default function CapacitacionesPage() {
  const { capacitaciones } = useCrmData()
  return <CapacitacionesListaClient capacitaciones={capacitaciones} />
}
