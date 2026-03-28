"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { usePortalAuth } from "./PortalAuthProvider"
import {
  LayoutDashboard, FileSearch, Award, ClipboardCheck,
  Briefcase, GraduationCap, Building2, LogOut, Menu, X, ChevronRight,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/portal", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/portal/diagnostico", label: "Diagnósticos", icon: FileSearch },
  { href: "/portal/certificacion", label: "Certificaciones", icon: Award },
  { href: "/portal/auditoria", label: "Auditorías", icon: ClipboardCheck },
  { href: "/portal/consultoria", label: "Consultorías", icon: Briefcase },
  { href: "/portal/capacitaciones", label: "Capacitaciones", icon: GraduationCap },
]

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = usePortalAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="portal-root flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <div className="portal-root flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0F1B33] text-white z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/portal" onClick={() => setSidebarOpen(false)}>
            <Image src="/logoaudico.png" alt="AUDICO" width={150} height={40} priority />
          </Link>
          <p className="text-blue-300 text-xs mt-2 font-medium tracking-wider">PORTAL DE CLIENTE</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.nombre?.charAt(0)?.toUpperCase() || "C"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.nombre}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-red-600/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-semibold text-slate-800 truncate">
              {user?.nombre || "Portal de Cliente"}
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
