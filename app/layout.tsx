import './globals.css'
import type { Metadata } from 'next'
import { ModalProvider } from '@/components/ModalContext'
import RegisterModal from '@/components/RegisterModal'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'AUDICO S.A.S. — Auditoría y Consultoría Empresarial',
  description: 'Auditoría y Consultoría en ISO 9001, 14001, 45001, gestión empresarial y proyectos. Cali, Valle del Cauca — Colombia.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ModalProvider>
          <Header />
          <main>{children}</main>
          <footer style={{ background: '#0F1B33' }}>
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
              © {new Date().getFullYear()} AUDICO S.A.S. — Cali, Colombia · audicoempresarial@gmail.com · +57 316 137 4657
            </div>
          </footer>
          <RegisterModal />
        </ModalProvider>
      </body>
    </html>
  )
}
