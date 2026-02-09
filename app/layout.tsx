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
            <div className="mx-auto max-w-7xl px-4 py-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-sm text-slate-400">
                  &copy; {new Date().getFullYear()} AUDICO S.A.S. &mdash; Cali, Valle del Cauca, Colombia
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <a href="mailto:audicoempresarial@gmail.com" className="hover:text-white transition-colors">audicoempresarial@gmail.com</a>
                  <a href="tel:+573161374657" className="hover:text-white transition-colors">+57 316 137 4657</a>
                  <a href="https://wa.me/573161374657" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">WhatsApp</a>
                </div>
              </div>
            </div>
          </footer>
          <RegisterModal />
        </ModalProvider>
      </body>
    </html>
  )
}
