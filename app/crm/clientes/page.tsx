import { cachedFetch } from '@/lib/sanity.server'
import { allClientesQuery } from '@/lib/crm/queries'
import type { CrmCliente } from '@/lib/crm/types'
import ClientesDirectorioClient from "./ClientesDirectorioClient"

export default async function ClientesPage() {
  const clientes = await cachedFetch<CrmCliente[]>(allClientesQuery)
  return <ClientesDirectorioClient clientes={clientes} />
}
