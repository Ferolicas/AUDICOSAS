import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AUDICO S.A.S. — Auditoría y Consultoría Empresarial',
  description: 'Auditoría y Consultoría en ISO 9001, 14001, 45001, gestión empresarial y proyectos. Cali, Valle del Cauca — Colombia.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="dns-prefetch" href="//api.sanity.io" />
        <link rel="dns-prefetch" href="//cdn.sanity.io" />
        <link rel="preconnect" href="https://api.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
