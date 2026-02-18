"use client"

import { useCrmData } from "@/components/crm/providers/SWRProvider"
import ClientesDirectorioClient from "./ClientesDirectorioClient"

export default function ClientesPage() {
  const { clientes } = useCrmData()
  return <ClientesDirectorioClient clientes={clientes} />
}
