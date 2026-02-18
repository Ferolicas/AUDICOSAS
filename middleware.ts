import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PREFIXES = ['/admin', '/api/clients', '/api/newsletters', '/api/processes', '/crm', '/api/crm']

export function middleware(req: NextRequest){
  const { pathname } = req.nextUrl
  const method = req.method

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))

  // Allow public registration endpoint
  if(pathname === '/api/clients' && method === 'POST'){
    return NextResponse.next()
  }
  // Allow public subscribers endpoint
  if(pathname === '/api/subscribers' && method === 'POST'){
    return NextResponse.next()
  }

  if(isProtected){
    const auth = req.headers.get('authorization')
    const user = process.env.BASIC_AUTH_USER
    const pass = process.env.BASIC_AUTH_PASS
    if(!user || !pass){
      return new NextResponse('Auth no configurada', { status: 500 })
    }
    if(!auth || !auth.startsWith('Basic ')){
      return new NextResponse('Auth requerida', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Restricted"' } })
    }
    const [, b64] = auth.split(' ')
    const decoded = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('utf8')
    const [u, p] = decoded.split(':')
    if(u !== user || p !== pass){
      return new NextResponse('Credenciales inválidas', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Restricted"' } })
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
    '/api/crm/:path*'
  ]
}
