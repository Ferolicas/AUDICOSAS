"use client"

import { useCrmData } from "@/components/crm/providers/SWRProvider"
import DesarrolloKanbanClient from "./DesarrolloKanbanClient"

export default function DesarrolloPage() {
  const { desarrollo } = useCrmData()
  return <DesarrolloKanbanClient proyectos={desarrollo} />
}
