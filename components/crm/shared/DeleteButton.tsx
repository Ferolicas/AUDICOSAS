"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/crm/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/crm/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

interface DeleteButtonProps {
  id: string
  apiPath: string
  entityName: string
  redirectPath: string
  compact?: boolean
}

export function DeleteButton({ id, apiPath, entityName, redirectPath, compact }: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiPath}/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.error || `Error al eliminar ${entityName}`)
      }
      toast.success(`${entityName} eliminado exitosamente`)
      router.refresh()
      router.push(redirectPath)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Error al eliminar ${entityName}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={loading} title={`Eliminar ${entityName.toLowerCase()}`}>
          <Trash2 className={compact ? "h-4 w-4" : "h-4 w-4 mr-2"} />
          {!compact && "Eliminar"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente este {entityName.toLowerCase()}. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
