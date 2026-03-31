"use client"
import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded"
    >
      <Printer className="w-4 h-4" />Imprimir
    </button>
  )
}
