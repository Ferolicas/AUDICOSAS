import { NextRequest, NextResponse } from 'next/server'
import { sanityRead, sanityWrite, requireWrite } from '@/lib/sanity.server'
import { verifySession, hashPassword, createSession, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/crm/auth'
import groq from 'groq'

const USER_BY_ID = groq`*[_type == "crmUsuario" && _id == $id][0]{ _id, passwordHash, "clienteRef": clienteRef->_id }`

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

    // Issue new JWT without mustChangePassword flag, preserve clienteRef
    const newToken = await createSession({
      userId: session.userId,
      email: session.email,
      nombre: session.nombre,
      rol: session.rol,
      mustChangePassword: false,
      ...(user.clienteRef ? { clienteRef: user.clienteRef } : {}),
    })

    const response_data: Record<string, unknown> = { ok: true }
    if (user.clienteRef) response_data.clienteRef = user.clienteRef

    const response = NextResponse.json(response_data)
    response.cookies.set(COOKIE_NAME, newToken, COOKIE_OPTIONS)
    return response
  } catch (e) {
    console.error('Change password error:', e)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
