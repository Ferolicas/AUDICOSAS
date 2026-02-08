"use client"
import Image from 'next/image'
import { useModal } from './ModalContext'

export default function Header() {
  const { setOpen } = useModal()

  return (
    <header className="sticky top-0 z-50 shadow-md" style={{ background: '#1B2A4A' }}>
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <a href="/">
          <Image src="/logoaudico.png" alt="AUDICO S.A.S." width={199} height={53} priority />
        </a>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="#servicios" className="text-slate-200 hover:text-white transition-colors">Servicios</a>
          <a href="#valores" className="text-slate-200 hover:text-white transition-colors">Valores</a>
          <a href="#contacto" className="text-slate-200 hover:text-white transition-colors">Contacto</a>
          <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors cursor-pointer">Regístrate</button>
          <a href="/admin" className="px-4 py-2 rounded-md border border-slate-400 text-slate-200 hover:bg-white/10 transition-colors">Admin</a>
        </nav>
      </div>
    </header>
  )
}
