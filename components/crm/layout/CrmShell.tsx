"use client"

import { useState } from "react"
import { CrmHeader } from "./CrmHeader"
import { CrmSidebar } from "./CrmSidebar"

export function CrmShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="h-screen flex flex-col crm-root">
      <CrmHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden">
        <CrmSidebar open={sidebarOpen} />
        <main className="flex-1 overflow-auto bg-gray-50 crm-main">
          {children}
        </main>
      </div>
    </div>
  )
}
