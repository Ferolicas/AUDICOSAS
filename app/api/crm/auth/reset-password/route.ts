import { NextResponse } from 'next/server'
import { sanityRead, sanityWrite, requireWrite } from '@/lib/sanity.server'
import { hashPassword } from '@/lib/crm/auth'
import groq from 'groq'
import crypto from 'crypto'

const USER_BY_EMAIL = groq`*[_type == "crmUsuario" && email == $email][0]{ _id, nombre, email }`
const USER_BY_TOKEN = groq`*[_type == "crmUsuario" && resetToken == $token && resetTokenExpiry > now()][0]{ _id, email, nombre }`

// Request password reset
export async function POST(req: Request) {
  try {
    requireWrite()
    const { email, token, newPassword } = await req.json()

    // If token + newPassword → confirm reset
    if (token && newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
      }

      const user = await sanityRead().fetch(USER_BY_TOKEN, { token })
      if (!user) {
        return NextResponse.json({ error: 'Token inválido o expirado. Solicita un nuevo enlace.' }, { status: 400 })
      }

      const passwordHash = await hashPassword(newPassword)
      await sanityWrite().patch(user._id).set({
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      }).commit()

      return NextResponse.json({ ok: true, message: 'Contraseña actualizada. Ya puedes iniciar sesión.' })
    }

    // If only email → generate reset token
    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }

    const emailNorm = email.toLowerCase().trim()
    const user = await sanityRead().fetch(USER_BY_EMAIL, { email: emailNorm })

    // Always respond success to prevent email enumeration
    const successMsg = 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.'

    if (!user) {
      return NextResponse.json({ ok: true, message: successMsg })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour

    await sanityWrite().patch(user._id).set({ resetToken, resetTokenExpiry }).commit()

    // TODO: Send email with reset link when email service is configured
    // For now, log it (visible in Vercel logs)
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://audicoiso.com'}/crm/restablecer?token=${resetToken}`
    console.log(`[Password Reset] User: ${user.email}, URL: ${resetUrl}`)

    return NextResponse.json({ ok: true, message: successMsg })
  } catch (e) {
    console.error('Reset password error:', e)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
