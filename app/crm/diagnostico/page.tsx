"use client"

import { useCrmData } from "@/components/crm/providers/SWRProvider"
import DiagnosticoListaClient from "./DiagnosticoListaClient"

export default function DiagnosticoPage() {
  const { diagnosticos } = useCrmData()
  return <DiagnosticoListaClient diagnosticos={diagnosticos} />
}
