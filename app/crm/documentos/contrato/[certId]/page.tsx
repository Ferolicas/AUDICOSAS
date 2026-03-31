"use client"
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/crm/ui/button'
import { toast } from 'sonner'

export default function ContratoPage() {
  const { certId } = useParams<{ certId: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/contrato/${certId}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Error generando documento')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const disposition = res.headers.get('Content-Disposition') ?? ''
      const match = disposition.match(/filename="?([^"]+)"?/)
      a.download = match ? match[1] : 'Contrato.docx'
      a.href = url
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Contrato descargado correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al generar el contrato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-6 text-slate-400" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />Volver
      </Button>

      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto">
          <FileText className="w-10 h-10 text-purple-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">Contrato de Prestación de Servicios</h1>
          <p className="text-slate-400 mt-2">
            Genera el contrato .docx con los datos del cliente y la certificación.
          </p>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-5 text-left space-y-2 text-sm text-slate-300">
          <p className="font-semibold text-slate-200 mb-3">Datos que se incluirán automáticamente:</p>
          <div className="grid grid-cols-2 gap-2">
            <span>✓ Nombre empresa / NIT</span>
            <span>✓ Dirección y contacto</span>
            <span>✓ Fecha actual (día, mes, año)</span>
            <span>✓ Valor del proyecto</span>
            <span>✓ Valor en letras</span>
            <span>✓ Cumplimiento global</span>
            <span>✓ N.° No Cumple / Cumple Parcial</span>
            <span>✓ Recuento No Cumple 4-7</span>
            <span>✓ Mes siguiente al actual</span>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          disabled={loading}
          className="w-full py-4 text-base bg-purple-600 hover:bg-purple-500 text-white font-bold"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generando contrato...</>
          ) : (
            <><Download className="w-5 h-5 mr-2" />Descargar Contrato.docx</>
          )}
        </Button>
      </div>
    </div>
  )
}
