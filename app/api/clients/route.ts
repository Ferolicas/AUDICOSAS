import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityRead, sanityWrite } from '@/lib/sanity.server'
import groq from 'groq'
import { sendClientConfirmation, sendAdminNotification } from '@/lib/email'
import { generateCodigo } from '@/lib/crm/idgen'
import { invalidateAllCaches } from '@/lib/crm/cache'

const ClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  employees: z.string().optional(),
  sector: z.string().optional(),
  serviceInterest: z.string().optional(),
  message: z.string().optional(),
  privacy: z.union([z.string(), z.boolean()]).optional(),
  subscribe: z.union([z.string(), z.boolean()]).optional()
})

const clienteCountQuery = groq`count(*[_type == "crmCliente"])`
const clienteExistsQuery = groq`count(*[_type == "crmCliente" && email == $email])`

function mapEmployees(range?: string): { tamano: string; numEmpleados: number } {
  switch (range) {
    case '1-10':   return { tamano: 'Micro', numEmpleados: 5 }
    case '11-25':  return { tamano: 'Pequeña', numEmpleados: 18 }
    case '26-50':  return { tamano: 'Pequeña', numEmpleados: 38 }
    case '51-100': return { tamano: 'Mediana', numEmpleados: 75 }
    case '100+':   return { tamano: 'Grande', numEmpleados: 150 }
    default:       return { tamano: 'Micro', numEmpleados: 1 }
  }
}

export async function POST(req: NextRequest){
  try{
    const body = await req.json()
    const data = ClientSchema.parse(body)
    const wants = (data.subscribe === true || data.subscribe === 'true')
    const writer = sanityWrite()

    // 1. Create landing lead document
    const doc = await writer.create({
      _type: 'client',
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      employees: data.employees || null,
      sector: data.sector || null,
      serviceInterest: data.serviceInterest || null,
      message: data.message || null,
      subscribed: wants
    })

    // 2. Create CRM client if one with same email doesn't exist
    const emailLower = data.email.toLowerCase().trim()
    const exists = await writer.fetch<number>(clienteExistsQuery, { email: emailLower })
    if (exists === 0) {
      const { tamano, numEmpleados } = mapEmployees(data.employees)
      const count = await writer.fetch<number>(clienteCountQuery)
      const codigo = generateCodigo('crmCliente', count)
      await writer.create({
        _type: 'crmCliente',
        codigo,
        razonSocial: data.company || data.name,
        nombreComercial: data.company || data.name,
        nombreContacto: data.name,
        nif: '',
        sector: data.sector || 'Por definir',
        tamano,
        numEmpleados,
        telefono: data.phone || '',
        email: emailLower,
        estado: 'Prospecto',
        servicioInteres: data.serviceInterest || '',
        observaciones: data.message || '',
        fechaAlta: new Date().toISOString().split('T')[0],
        certificaciones: [],
      })
      invalidateAllCaches()
    }

    // 3. Subscriber
    if(wants){
      const subId = `subscriber-${data.email.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      await writer.createIfNotExists({ _id: subId, _type: 'subscriber', email: data.email, name: data.name, client: { _type: 'reference', _ref: doc._id }, unsubscribed: false })
    }

    // 4. Send emails (non-blocking)
    Promise.all([
      sendClientConfirmation(data),
      sendAdminNotification(data),
    ]).catch(() => {})

    return NextResponse.json({ ok: true, id: doc._id })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 400 })
  }
}

export async function GET(){
  try{
    const query = groq`*[_type == "client"]|order(_createdAt desc){_id, name, email, phone, company, employees, sector, serviceInterest, message, subscribed, _createdAt}`
    const clients = await sanityRead().fetch(query)
    return NextResponse.json({ clients })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 })
  }
}
