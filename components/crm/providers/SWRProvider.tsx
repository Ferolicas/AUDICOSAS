"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"

interface CrmData {
  clientes: unknown[]
  diagnosticos: unknown[]
  certificaciones: unknown[]
  auditorias: unknown[]
  consultorias: unknown[]
  capacitaciones: unknown[]
  desarrollo: unknown[]
  stats: unknown | null
}

interface CrmDataContextValue extends CrmData {
  refresh: () => void
}

const EMPTY: CrmData = {
  clientes: [], diagnosticos: [], certificaciones: [],
  auditorias: [], consultorias: [], capacitaciones: [],
  desarrollo: [], stats: null,
}

const CrmDataContext = createContext<CrmDataContextValue>({ ...EMPTY, refresh: () => {} })

export function useCrmData() {
  return useContext(CrmDataContext)
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full border-4 border-transparent border-t-primary border-r-primary/40 animate-spin" />
          <div
            className="absolute -inset-2 rounded-full border-2 border-transparent border-b-primary/60 border-l-primary/20"
            style={{ animation: "spin 1.5s linear infinite reverse" }}
          />
          <div className="relative w-20 h-20 animate-pulse">
            <Image
              src="/logocarga.png"
              alt="AUDICO ISO"
              width={80}
              height={80}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Cargando CRM</p>
          <div className="flex justify-center gap-1 mt-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CrmDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CrmData | null>(null)
  const pathname = usePathname()

  const fetchData = useCallback(() => {
    fetch('/api/crm/all')
      .then(r => r.json())
      .then(d => setData({
        clientes: d.clientes ?? [],
        diagnosticos: d.diagnosticos ?? [],
        certificaciones: d.certificaciones ?? [],
        auditorias: d.auditorias ?? [],
        consultorias: d.consultorias ?? [],
        capacitaciones: d.capacitaciones ?? [],
        desarrollo: d.desarrollo ?? [],
        stats: d.stats ?? null,
      }))
      .catch(() => setData(EMPTY))
  }, [])

  // Fetch inicial
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refrescar datos cuando la ruta cambia a una página de listado
  // (después de crear/editar/eliminar y navegar de vuelta)
  useEffect(() => {
    if (!data) return // no refrescar durante la carga inicial

    const isListPage = pathname && (
      pathname === '/crm' ||
      pathname === '/crm/clientes' ||
      pathname === '/crm/diagnosticos' ||
      pathname === '/crm/certificaciones' ||
      pathname === '/crm/auditorias' ||
      pathname === '/crm/consultorias' ||
      pathname === '/crm/capacitaciones' ||
      pathname === '/crm/desarrollo'
    )

    if (isListPage) {
      fetchData()
    }
  }, [pathname, fetchData]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) return <LoadingScreen />

  return (
    <CrmDataContext.Provider value={{ ...data, refresh: fetchData }}>
      {children}
    </CrmDataContext.Provider>
  )
}
