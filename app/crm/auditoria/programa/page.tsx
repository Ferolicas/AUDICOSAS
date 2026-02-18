"use client"

import { useCrmData } from "@/components/crm/providers/SWRProvider"
import AuditoriaProgramaClient from "./AuditoriaProgramaClient"

export default function AuditoriaProgramaPage() {
  const { auditorias } = useCrmData()
  return <AuditoriaProgramaClient auditorias={auditorias} />
}
