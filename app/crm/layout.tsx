import './crm.css'
import { Toaster } from '@/components/crm/ui/sonner'
import { CrmAppShell } from '@/components/crm/layout/CrmAppShell'

export const metadata = {
  title: 'CRM | AUDICO ISO',
  description: 'CRM de certificación ISO - AUDICO S.A.S.',
}

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <CrmAppShell>
      {children}
      <Toaster />
    </CrmAppShell>
  )
}
