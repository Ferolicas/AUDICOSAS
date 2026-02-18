import { ModalProvider } from '@/components/ModalContext'
import RegisterModal from '@/components/RegisterModal'
import Header from '@/components/Header'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <Header />
      <main className="pt-[60px]">{children}</main>
      <footer style={{ background: '#0F1B33' }}>
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} AUDICO S.A.S. &mdash; Cali, Valle del Cauca, Colombia
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <a href="mailto:contacto@audicoiso.com" className="hover:text-white transition-colors">contacto@audicoiso.com</a>
              <a href="tel:+573161374657" className="hover:text-white transition-colors">+57 316 137 4657</a>
              <a href="https://wa.me/573161374657" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>
      </footer>
      <RegisterModal />
    </ModalProvider>
  )
}
