"use client"

import { useCrmData } from "@/components/crm/providers/SWRProvider"
import ConsultoriaListaClient from "./ConsultoriaListaClient"

export default function ConsultoriaPage() {
  const { consultorias } = useCrmData()
  return <ConsultoriaListaClient consultorias={consultorias} />
}
