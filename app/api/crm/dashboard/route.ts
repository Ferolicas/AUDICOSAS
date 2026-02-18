import { dashboardStatsQuery } from '@/lib/crm/queries'
import { fetchAll, jsonOk } from '@/lib/crm/api-helpers'

export async function GET() {
  const data = await fetchAll(dashboardStatsQuery)
  return jsonOk(data)
}
