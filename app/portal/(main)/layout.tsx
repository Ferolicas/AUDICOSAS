import { PortalAuthProvider } from '@/components/portal/PortalAuthProvider'
import PortalShell from '@/components/portal/PortalShell'

export default function PortalMainLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalAuthProvider>
      <PortalShell>{children}</PortalShell>
    </PortalAuthProvider>
  )
}
