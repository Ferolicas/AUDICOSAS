"use client"

import { useCrmData } from "@/components/crm/providers/SWRProvider"
import DashboardClient from "./DashboardClient"

export default function CrmDashboardPage() {
  const { stats } = useCrmData()
  return <DashboardClient stats={stats} />
}
