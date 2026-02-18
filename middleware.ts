import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'audico-crm-secret-change-in-production'
)

const COOKIE_NAME = 'crm-session'

// Auth pages that don't require session
const AUTH_PAGES = ['/crm/login', '/crm/restablecer', '/crm/cambiar-contrasena']

// Legacy protected routes (landing admin + APIs)
const LEGACY_PREFIXES = ['/admin', '/api/clients', '/api/newsletters', '/api/processes']

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

  // ── CRM Auth routes (login, registro, restablecer) - allow if no session ──
  const isAuthPage = AUTH_PAGES.some(p => pathname.startsWith(p))
  const token = req.cookies.get(COOKIE_NAME)?.value

  if (isAuthPage) {
    // If already logged in, redirect to CRM dashboard
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET)
        return NextResponse.redirect(new URL('/crm', req.url))
      } catch {
        // Invalid token, let them access auth pages
      }
    }
    return NextResponse.next()
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
      // Add user info to headers for API routes
      const response = NextResponse.next()
      response.headers.set('x-user-id', payload.userId as string)
      response.headers.set('x-user-email', payload.email as string)
      response.headers.set('x-user-rol', payload.rol as string)
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
  ],
}
