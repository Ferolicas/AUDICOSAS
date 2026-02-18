"use client"

import Link from "next/link"
import {
  Award,
  Bell,
  Calendar,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/crm/ui/button"
import { Avatar, AvatarFallback } from "@/components/crm/ui/avatar"
import { Input } from "@/components/crm/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/crm/ui/dropdown-menu"
import { Badge } from "@/components/crm/ui/badge"

interface CrmHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function CrmHeader({ sidebarOpen, onToggleSidebar }: CrmHeaderProps) {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50 crm-header">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        <Link href="/crm" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-xl text-blue-900">AUDICOISO</h1>
            <p className="text-xs text-gray-600">CRM Certificación ISO</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 max-w-xl mx-6 hidden md:block">
        <Input
          placeholder="Buscar cliente, auditoría, documento..."
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Calendar className="w-5 h-5" />
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-[10px]">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">Juan Pérez</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Mi perfil</DropdownMenuItem>
            <DropdownMenuItem>Configuración</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
