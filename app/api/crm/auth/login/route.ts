import { NextResponse } from 'next/server'
import { sanityRead } from '@/lib/sanity.server'
import { verifyPassword, createSession, COOKIE_OPTIONS, COOKIE_NAME } from '@/lib/crm/auth'
import groq from 'groq'

const USER_BY_EMAIL = groq`*[_type == "crmUsuario" && email == $email][0]{
  _id, nombre, email, passwordHash, rol, estado, mustChangePassword
}`

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 })
    }

    const user = await sanityRead().fetch(USER_BY_EMAIL, { email: email.toLowerCase().trim() })

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    if (user.estado === 'inactivo') {
      return NextResponse.json({ error: 'Tu cuenta está inactiva. Contacta al administrador.' }, { status: 403 })
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = await createSession({
      userId: user._id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
    })

    const response = NextResponse.json({
      ok: true,
      mustChangePassword: !!user.mustChangePassword,
      user: { nombre: user.nombre, email: user.email, rol: user.rol },
    })

    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS)

    return response
  } catch (e) {
    console.error('Login error:', e)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
