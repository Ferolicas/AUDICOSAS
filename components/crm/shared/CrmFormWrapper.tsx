"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/crm/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/crm/ui/card"

interface CrmFormWrapperProps {
  title: string
  backHref: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  loading?: boolean
}

export function CrmFormWrapper({ title, backHref, children, onSubmit, loading }: CrmFormWrapperProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={backHref}>
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {children}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href={backHref}>
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
