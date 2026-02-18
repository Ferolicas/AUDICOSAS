"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/crm/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/crm/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/crm/ui/command"
import { cn } from "@/lib/utils"

interface Cliente {
  _id: string
  nombreComercial: string
  razonSocial: string
  codigo: string
  ciudad?: string
}

interface ClienteSelectorProps {
  value?: string
  clienteNombre?: string
  onSelect: (clienteId: string, clienteNombre: string) => void
  error?: string
}

export function ClienteSelector({ value, clienteNombre, onSelect, error }: ClienteSelectorProps) {
  const [open, setOpen] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const loadClientes = async () => {
    if (loaded) return
    setLoading(true)
    try {
      const res = await fetch('/api/crm/clientes')
      if (res.ok) {
        const data = await res.json()
        setClientes(data)
      }
    } catch { /* silently fail */ }
    finally { setLoading(false); setLoaded(true) }
  }

  useEffect(() => {
    if (open && !loaded) loadClientes()
  }, [open])

  const selectedLabel = value
    ? (clientes.find(c => c._id === value)?.nombreComercial || clienteNombre || value)
    : null

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between font-normal", !selectedLabel && "text-muted-foreground")}
          >
            {selectedLabel || "Seleccionar cliente..."}
            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar cliente..." />
            <CommandList>
              <CommandEmpty>{loading ? "Cargando..." : "No se encontraron clientes"}</CommandEmpty>
              <CommandGroup>
                {clientes.map(c => (
                  <CommandItem
                    key={c._id}
                    value={`${c.nombreComercial} ${c.razonSocial} ${c.codigo}`}
                    onSelect={() => {
                      onSelect(c._id, c.nombreComercial)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === c._id ? "opacity-100" : "opacity-0")} />
                    <div className="flex flex-col">
                      <span className="font-medium">{c.nombreComercial}</span>
                      <span className="text-xs text-muted-foreground">{c.codigo} {c.ciudad ? `· ${c.ciudad}` : ''}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
