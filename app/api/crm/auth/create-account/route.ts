import { NextResponse } from 'next/server'
import { sanityRead, sanityWrite, requireWrite } from '@/lib/sanity.server'
import { hashPassword } from '@/lib/crm/auth'
import { sendAccountCreatedEmail } from '@/lib/crm/email-auth'
import groq from 'groq'
import crypto from 'crypto'

const USER_EXISTS = groq`count(*[_type == "crmUsuario" && email == $email])`
const CLIENT_BY_ID = groq`*[_type == "crmCliente" && _id == $id][0]{
  _id, nombreComercial, razonSocial, email, telefono
}`

export async function POST(req: Request) {
  try {
    requireWrite()
    const { clienteId } = await req.json()

    if (!clienteId) {
      return NextResponse.json({ error: 'ID de cliente requerido' }, { status: 400 })
    }

    const cliente = await sanityRead().fetch(CLIENT_BY_ID, { id: clienteId })
    if (!cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
    }

    if (!cliente.email) {
      return NextResponse.json({ error: 'El cliente no tiene correo electrónico registrado' }, { status: 400 })
    }

    const exists = await sanityRead().fetch(USER_EXISTS, { email: cliente.email.toLowerCase().trim() })
    if (exists > 0) {
      return NextResponse.json({ error: 'Ya existe una cuenta con el correo de este cliente' }, { status: 409 })
    }

    // Generate a random 8-char password
    const tempPassword = crypto.randomBytes(4).toString('hex') // e.g. "a3f1b2c4"
    const passwordHash = await hashPassword(tempPassword)

    const doc = await sanityWrite().create({
      _type: 'crmUsuario',
      nombre: cliente.nombreComercial || cliente.razonSocial,
      email: cliente.email.toLowerCase().trim(),
      passwordHash,
      rol: 'visor',
      estado: 'activo',
      mustChangePassword: true,
      clienteRef: { _type: 'reference', _ref: cliente._id },
    })

    // Send email with credentials
    const emailResult = await sendAccountCreatedEmail({
      to: cliente.email,
      nombre: cliente.nombreComercial || cliente.razonSocial,
      tempPassword,
    })

    return NextResponse.json({
      ok: true,
      userId: doc._id,
      emailSent: emailResult.sent,
      emailError: emailResult.sent ? undefined : emailResult.reason,
    })
  } catch (e) {
    console.error('Create account error:', e)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
