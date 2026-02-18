import './crm.css'
import { CrmShell } from '@/components/crm/layout/CrmShell'
import { CrmDataProvider } from '@/components/crm/providers/SWRProvider'
import { Toaster } from '@/components/crm/ui/sonner'

export const metadata = {
  title: 'CRM | AUDICO ISO',
  description: 'CRM de certificación ISO - AUDICO S.A.S.',
}

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <CrmDataProvider>
      <CrmShell>
        {children}
        <Toaster />
      </CrmShell>
    </CrmDataProvider>
  )
}
