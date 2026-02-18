import { NextRequest, NextResponse } from 'next/server'
import { sanityRead, sanityWrite, requireWrite } from '@/lib/sanity.server'
import { verifySession, hashPassword, COOKIE_NAME } from '@/lib/crm/auth'
import groq from 'groq'

const USER_BY_ID = groq`*[_type == "crmUsuario" && _id == $id][0]{ _id, passwordHash }`

export async function POST(req: NextRequest) {
  try {
    requireWrite()
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const session = await verifySession(token)
    if (!session) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
    }

    const { newPassword, confirmPassword } = await req.json()

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 })
    }

    const user = await sanityRead().fetch(USER_BY_ID, { id: session.userId })
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const newHash = await hashPassword(newPassword)
    await sanityWrite().patch(user._id).set({
      passwordHash: newHash,
      mustChangePassword: false,
    }).commit()

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Change password error:', e)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
