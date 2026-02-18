import { NextResponse } from 'next/server'
import { sanityRead, sanityWrite, requireWrite } from '@/lib/sanity.server'
import { hashPassword, createSession, COOKIE_OPTIONS, COOKIE_NAME } from '@/lib/crm/auth'
import groq from 'groq'

const USER_EXISTS = groq`count(*[_type == "crmUsuario" && email == $email])`

export async function POST(req: Request) {
  try {
    requireWrite()
    const { nombre, email, password, confirmPassword } = await req.json()

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 })
    }

    const emailNorm = email.toLowerCase().trim()
    const exists = await sanityRead().fetch(USER_EXISTS, { email: emailNorm })

    if (exists > 0) {
      return NextResponse.json({ error: 'Ya existe una cuenta con este correo' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const doc = await sanityWrite().create({
      _type: 'crmUsuario',
      nombre: nombre.trim(),
      email: emailNorm,
      passwordHash,
      rol: 'consultor',
      estado: 'activo',
    })

    const token = await createSession({
      userId: doc._id,
      email: emailNorm,
      nombre: nombre.trim(),
      rol: 'consultor',
    })

    const response = NextResponse.json({
      ok: true,
      user: { nombre: nombre.trim(), email: emailNorm, rol: 'consultor' },
    })

    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS)

    return response
  } catch (e) {
    console.error('Register error:', e)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
