import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AUDICO S.A.S. — Auditoría y Consultoría Empresarial',
  description: 'Auditoría y Consultoría en ISO 9001, 14001, 45001, gestión empresarial y proyectos. Cali, Valle del Cauca — Colombia.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b border-slate-800 sticky top-0 bg-[var(--bg)]/80 backdrop-blur z-50">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-semibold">AUDICO S.A.S.</a>
            <nav className="flex gap-6 text-sm">
              <a href="#servicios">Servicios</a>
              <a href="#valores">Valores</a>
              <a href="#contacto">Contacto</a>
              <a href="/register" className="px-3 py-1.5 rounded bg-accent text-black font-medium">Regístrate</a>
              <a href="/admin" className="px-3 py-1.5 rounded border border-slate-700">Admin</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-slate-800 mt-16">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
            © {new Date().getFullYear()} AUDICO S.A.S. — Cali, Colombia · audicoempresarial@gmail.com · +57 316 137 4657
          </div>
        </footer>
      </body>
    </html>
  )
}

