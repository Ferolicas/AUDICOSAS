// Auth pages (login, cambiar-contrasena) render standalone without shell
export default function PortalAuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
