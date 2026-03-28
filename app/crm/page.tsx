import { cachedFetch } from '@/lib/sanity.server'
import { dashboardStatsQuery } from '@/lib/crm/queries'
import DashboardClient from "./DashboardClient"

export default async function CrmDashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stats = await cachedFetch<any>(dashboardStatsQuery)
  return <DashboardClient stats={stats} />
}
