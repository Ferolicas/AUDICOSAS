"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface PortalUser {
  userId: string
  email: string
  nombre: string
  rol: string
  clienteRef?: string
  mustChangePassword?: boolean
}

interface PortalAuthContextType {
  user: PortalUser | null
  loading: boolean
  logout: () => Promise<void>
}

const PortalAuthContext = createContext<PortalAuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
})

export function usePortalAuth() {
  return useContext(PortalAuthContext)
}

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch("/api/crm/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user)
        else setUser(null)
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [pathname])

  async function logout() {
    await fetch("/api/crm/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/portal/login")
    router.refresh()
  }

  return (
    <PortalAuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </PortalAuthContext.Provider>
  )
}
