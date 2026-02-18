"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  userId: string
  email: string
  nombre: string
  rol: string
}

interface AuthContextType {
  user: User | null
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({ user: null, logout: async () => {} })

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch("/api/crm/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user)
      })
      .catch(() => {})
  }, [pathname])

  async function logout() {
    await fetch("/api/crm/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/crm/login")
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
