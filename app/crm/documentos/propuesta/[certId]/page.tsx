"use client"
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/crm/ui/button'
import { toast } from 'sonner'

export default function PropuestaPage() {
  const { certId } = useParams<{ certId: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch(`/api/crm/propuesta/${certId}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Error generando documento')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const disposition = res.headers.get('Content-Disposition') ?? ''
      const match = disposition.match(/filename="?([^"]+)"?/)
      a.download = match ? match[1] : 'Propuesta.docx'
      a.href = url
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Propuesta descargada correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al generar la propuesta')
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
        <div className="w-20 h-20 rounded-full bg-amber-600/20 flex items-center justify-center mx-auto">
          <FileText className="w-10 h-10 text-amber-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">Propuesta Técnica de Consultoría</h1>
          <p className="text-slate-400 mt-2">
            Genera el documento .docx con los datos del Diagnóstico GAP y la Certificación.
          </p>
        </div>

        <div className="bg-slate-700/50 rounded-xl p-5 text-left space-y-2 text-sm text-slate-300">
          <p className="font-semibold text-slate-200 mb-3">Datos que se incluirán automáticamente:</p>
          <div className="grid grid-cols-2 gap-2">
            <span className="flex items-center gap-2">✓ Nombre de la empresa</span>
            <span className="flex items-center gap-2">✓ Mes y año actual</span>
            <span className="flex items-center gap-2">✓ Cumplimiento global (%)</span>
            <span className="flex items-center gap-2">✓ N.° No Cumple</span>
            <span className="flex items-center gap-2">✓ N.° Cumple Parcial</span>
            <span className="flex items-center gap-2">✓ Valor del proyecto</span>
            <span className="flex items-center gap-2">✓ % por cláusula (4 al 10)</span>
            <span className="flex items-center gap-2">✓ % Cláusula 8.1</span>
            <span className="flex items-center gap-2">✓ Recuento No Cumple 4-7</span>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          disabled={loading}
          className="w-full py-4 text-base bg-amber-600 hover:bg-amber-500 text-white font-bold"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generando documento...</>
          ) : (
            <><Download className="w-5 h-5 mr-2" />Descargar Propuesta.docx</>
          )}
        </Button>
      </div>
    </div>
  )
}
