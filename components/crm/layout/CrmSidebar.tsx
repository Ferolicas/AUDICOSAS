"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardCheck,
  Award,
  Search,
  Briefcase,
  Users,
  TrendingUp,
  BookOpen,
} from "lucide-react"
import { Badge } from "@/components/crm/ui/badge"
import { ScrollArea } from "@/components/crm/ui/scroll-area"
import { useAuth } from "@/components/crm/providers/AuthProvider"

interface MenuItem {
  path: string
  label: string
  icon: React.ReactNode
  badge?: number
  roles?: string[] // if empty/undefined, all roles can see
}

const menuItems: MenuItem[] = [
  { path: "/crm", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: "/crm/diagnostico", label: "Diagnóstico", icon: <ClipboardCheck className="w-5 h-5" />, roles: ["admin", "consultor", "auditor"] },
  { path: "/crm/certificacion", label: "Certificación", icon: <Award className="w-5 h-5" />, roles: ["admin", "consultor", "auditor"] },
  { path: "/crm/auditoria", label: "Auditoría", icon: <Search className="w-5 h-5" />, roles: ["admin", "consultor", "auditor"] },
  { path: "/crm/consultoria", label: "Consultoría", icon: <Briefcase className="w-5 h-5" />, roles: ["admin", "consultor"] },
  { path: "/crm/clientes", label: "Clientes", icon: <Users className="w-5 h-5" />, roles: ["admin", "consultor", "auditor", "visor"] },
  { path: "/crm/desarrollo", label: "Desarrollo", icon: <TrendingUp className="w-5 h-5" />, roles: ["admin"] },
  { path: "/crm/capacitaciones", label: "Capacitaciones", icon: <BookOpen className="w-5 h-5" />, roles: ["admin", "consultor"] },
]

export function CrmSidebar({ open }: { open: boolean }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const rol = user?.rol || "visor"

  const visibleItems = menuItems.filter(item =>
    !item.roles || item.roles.includes(rol)
  )

  const isActive = (path: string) => {
    if (path === "/crm") return pathname === "/crm"
    return pathname.startsWith(path)
  }

  return (
    <aside
      className={`${
        open ? 'w-64' : 'w-0'
      } transition-all duration-300 border-r border-slate-700 bg-[#0F1B33] overflow-hidden crm-sidebar`}
    >
      <ScrollArea className="h-full">
        <nav className="p-4 space-y-1">
          {visibleItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}
