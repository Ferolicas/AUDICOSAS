import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'audico-crm-secret-change-in-production'
)

const COOKIE_NAME = 'crm-session'

// Auth pages that don't require session (login + reset only)
const AUTH_PAGES = ['/crm/login', '/crm/restablecer', '/portal/login']

// Legacy protected routes (landing admin + APIs)
const LEGACY_PREFIXES = ['/admin', '/api/clients', '/api/newsletters', '/api/processes']

// Role-based CRM route access (prefix matching)
// admin has full access, not listed here
const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  consultor: [
    '/crm/diagnostico', '/crm/certificacion', '/crm/auditoria',
    '/crm/consultoria', '/crm/clientes', '/crm/capacitaciones', '/crm/documentos',
  ],
  auditor: [
    '/crm/auditoria', '/crm/diagnostico', '/crm/certificacion', '/crm/clientes',
  ],
  visor: [
    '/crm/clientes',
  ],
}

// Write routes that visor cannot access
const WRITE_PATTERNS = ['/nuevo', '/editar']

function isRouteAllowedForRole(pathname: string, rol: string): boolean {
  if (rol === 'admin') return true
  if (pathname === '/crm') return true
  if (pathname === '/crm/cambiar-contrasena') return true

  // Visor cannot create or edit
  if (rol === 'visor' && WRITE_PATTERNS.some(p => pathname.includes(p))) {
    return false
  }

  const allowed = ROLE_ALLOWED_PREFIXES[rol]
  if (!allowed) return false
  return allowed.some(prefix => pathname.startsWith(prefix))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Legacy Basic Auth for admin/landing APIs ──
  const isLegacy = LEGACY_PREFIXES.some(p => pathname.startsWith(p))

  if (pathname === '/api/clients' && req.method === 'POST') return NextResponse.next()
  if (pathname === '/api/subscribers' && req.method === 'POST') return NextResponse.next()

  if (isLegacy) {
    const auth = req.headers.get('authorization')
    const user = process.env.BASIC_AUTH_USER
    const pass = process.env.BASIC_AUTH_PASS
    if (!user || !pass) return new NextResponse('Auth no configurada', { status: 500 })
    if (!auth || !auth.startsWith('Basic ')) {
      return new NextResponse('Auth requerida', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Restricted"' } })
    }
    const decoded = Buffer.from(auth.split(' ')[1], 'base64').toString('utf8')
    const [u, p] = decoded.split(':')
    if (u !== user || p !== pass) {
      return new NextResponse('Credenciales inválidas', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Restricted"' } })
    }
    return NextResponse.next()
  }

  // ── CRM Auth routes (login, restablecer) - allow if no session ──
  const isAuthPage = AUTH_PAGES.some(p => pathname.startsWith(p))
  const token = req.cookies.get(COOKIE_NAME)?.value

  if (isAuthPage) {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        const hasClienteRef = !!payload.clienteRef
        const mustChange = !!payload.mustChangePassword

        // Force password change before anything else
        if (mustChange) {
          const changeDest = hasClienteRef ? '/portal/cambiar-contrasena' : '/crm/cambiar-contrasena'
          return NextResponse.redirect(new URL(changeDest, req.url))
        }

        // Redirect to correct area based on whether user has clienteRef
        const dest = hasClienteRef ? '/portal' : '/crm'
        return NextResponse.redirect(new URL(dest, req.url))
      } catch {
        // Invalid token, let them access auth pages
      }
    }
    return NextResponse.next()
  }

  // ── Portal protected routes + API routes ──
  const isPortalPage = pathname.startsWith('/portal')
  const isPortalApi = pathname.startsWith('/api/portal')

  if (isPortalPage || isPortalApi) {
    if (!token) {
      if (isPortalApi) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/portal/login', req.url))
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      const clienteRef = payload.clienteRef as string | undefined
      const mustChangePassword = payload.mustChangePassword as boolean

      // Force password change
      if (mustChangePassword && pathname !== '/portal/cambiar-contrasena') {
        if (isPortalApi) {
          return NextResponse.json({ error: 'Debe cambiar su contraseña primero' }, { status: 403 })
        }
        return NextResponse.redirect(new URL('/portal/cambiar-contrasena', req.url))
      }

      // Portal requires clienteRef
      if (!clienteRef && isPortalPage) {
        return NextResponse.redirect(new URL('/crm', req.url))
      }

      const response = NextResponse.next()
      response.headers.set('x-user-id', payload.userId as string)
      response.headers.set('x-user-email', payload.email as string)
      response.headers.set('x-user-rol', payload.rol as string)
      if (clienteRef) response.headers.set('x-cliente-ref', clienteRef)
      return response
    } catch {
      if (isPortalApi) {
        return NextResponse.json({ error: 'Sesión expirada' }, { status: 401 })
      }
      const response = NextResponse.redirect(new URL('/portal/login', req.url))
      response.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 })
      return response
    }
  }

  // ── CRM protected routes + API routes ──
  const isCrmPage = pathname.startsWith('/crm')
  const isCrmApi = pathname.startsWith('/api/crm')

  // Allow auth API routes without session
  if (pathname.startsWith('/api/crm/auth')) {
    return NextResponse.next()
  }

  if (isCrmPage || isCrmApi) {
    if (!token) {
      if (isCrmApi) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/crm/login', req.url))
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      const rol = payload.rol as string
      const mustChangePassword = payload.mustChangePassword as boolean

      // Force password change — redirect everywhere except cambiar-contrasena page itself
      if (mustChangePassword && pathname !== '/crm/cambiar-contrasena') {
        if (isCrmApi) {
          return NextResponse.json({ error: 'Debe cambiar su contraseña primero' }, { status: 403 })
        }
        // Portal clients go to portal's password change page
        const changeDest = payload.clienteRef ? '/portal/cambiar-contrasena' : '/crm/cambiar-contrasena'
        return NextResponse.redirect(new URL(changeDest, req.url))
      }

      // RBAC check for CRM pages
      if (isCrmPage && !isRouteAllowedForRole(pathname, rol)) {
        return NextResponse.redirect(new URL('/crm', req.url))
      }

      // Add user info to headers for API routes
      const response = NextResponse.next()
      response.headers.set('x-user-id', payload.userId as string)
      response.headers.set('x-user-email', payload.email as string)
      response.headers.set('x-user-rol', rol)
      return response
    } catch {
      // Invalid/expired token
      if (isCrmApi) {
        return NextResponse.json({ error: 'Sesión expirada' }, { status: 401 })
      }
      const response = NextResponse.redirect(new URL('/crm/login', req.url))
      response.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 })
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/clients/:path*',
    '/api/newsletters/:path*',
    '/api/processes/:path*',
    '/crm/:path*',
    '/api/crm/:path*',
    '/portal/:path*',
    '/api/portal/:path*',
  ],
}
