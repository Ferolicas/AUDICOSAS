"use client"

import { usePathname } from "next/navigation"
import { AuthProvider } from "@/components/crm/providers/AuthProvider"
import { PusherProvider } from "@/components/crm/providers/PusherProvider"
import { CrmShell } from "@/components/crm/layout/CrmShell"

const AUTH_ROUTES = ["/crm/login", "/crm/restablecer", "/crm/cambiar-contrasena"]

export function CrmAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = AUTH_ROUTES.some(r => pathname.startsWith(r))

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <AuthProvider>
      <PusherProvider>
        <CrmShell>
          {children}
        </CrmShell>
      </PusherProvider>
    </AuthProvider>
  )
}
