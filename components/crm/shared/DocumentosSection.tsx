"use client"

import { useRef, useState } from 'react'
import { Upload, FileText, Trash2, Download, Loader2, Paperclip } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/crm/ui/button'
import { Badge } from '@/components/crm/ui/badge'

export interface Documento {
  _key: string
  nombre: string
  url: string
  assetId?: string
  fechaSubida?: string
  tipo?: string
}

interface Props {
  docId: string
  documentos: Documento[]
}

const EXT_COLORS: Record<string, string> = {
  pdf: 'bg-red-500/20 text-red-400',
  doc: 'bg-blue-500/20 text-blue-400',
  docx: 'bg-blue-500/20 text-blue-400',
  xls: 'bg-green-500/20 text-green-400',
  xlsx: 'bg-green-500/20 text-green-400',
  jpg: 'bg-purple-500/20 text-purple-400',
  jpeg: 'bg-purple-500/20 text-purple-400',
  png: 'bg-purple-500/20 text-purple-400',
}

function formatFecha(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DocumentosSection({ docId, documentos: inicial }: Props) {
  const [docs, setDocs] = useState<Documento[]>(inicial)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of files) {
        const form = new FormData()
        form.append('docId', docId)
        form.append('file', file)
        const res = await fetch('/api/crm/documentos/upload', { method: 'POST', body: form })
        if (!res.ok) throw new Error('Error al subir')
        const data = await res.json()
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
        setDocs(prev => [...prev, {
          _key: crypto.randomUUID(),
          nombre: file.name,
          url: data.url,
          fechaSubida: new Date().toISOString(),
          tipo: ext,
        }])
        toast.success(`"${file.name}" subido correctamente`)
      }
    } catch {
      toast.error('Error al subir el archivo')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleDelete(doc: Documento) {
    setDeleting(doc._key)
    try {
      const res = await fetch('/api/crm/documentos/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, key: doc._key, assetId: doc.assetId }),
      })
      if (!res.ok) throw new Error()
      setDocs(prev => prev.filter(d => d._key !== doc._key))
      toast.success(`"${doc.nombre}" eliminado`)
    } catch {
      toast.error('No se pudo eliminar el documento')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-900/10 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt,.zip"
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Subiendo...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Upload className="w-8 h-8" />
            <p className="text-sm font-medium">Haz clic para subir documentos</p>
            <p className="text-xs">PDF, Word, Excel, imágenes — máx. 20MB</p>
          </div>
        )}
      </div>

      {/* Document list */}
      {docs.length === 0 ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-2">
          <Paperclip className="w-4 h-4" />
          <span>No hay documentos adjuntos</span>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map(doc => (
            <div key={doc._key} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 border border-slate-600 group">
              <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{doc.nombre}</p>
                {doc.fechaSubida && (
                  <p className="text-xs text-slate-500">{formatFecha(doc.fechaSubida)}</p>
                )}
              </div>
              {doc.tipo && (
                <Badge className={`text-xs uppercase ${EXT_COLORS[doc.tipo] ?? 'bg-slate-500/20 text-slate-400'}`}>
                  {doc.tipo}
                </Badge>
              )}
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                download={doc.nombre}
                className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-blue-900/30 transition-colors"
                title="Descargar"
              >
                <Download className="w-4 h-4" />
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-slate-500 hover:text-red-400 hover:bg-red-900/20"
                disabled={deleting === doc._key}
                onClick={() => handleDelete(doc)}
                title="Eliminar"
              >
                {deleting === doc._key
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Trash2 className="w-4 h-4" />
                }
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
