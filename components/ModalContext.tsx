"use client"
import { createContext, useContext, useState, type ReactNode } from 'react'

const ModalContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} })

export function ModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <ModalContext.Provider value={{ open, setOpen }}>{children}</ModalContext.Provider>
}

export function useModal() {
  return useContext(ModalContext)
}
