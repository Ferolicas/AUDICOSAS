import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityRead, sanityWrite } from '@/lib/sanity.server'
import groq from 'groq'
import { sendMail } from '@/lib/email'

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

export async function POST(req: NextRequest){
  try{
    const body = await req.json()
    const data = ClientSchema.parse(body)
    const wants = (data.subscribe === true || data.subscribe === 'true')
    const doc = await sanityWrite.create({
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
    if(wants){
      await sanityWrite.createIfNotExists({ _id: `subscriber-${data.email}`, _type: 'subscriber', email: data.email, name: data.name, client: { _type: 'reference', _ref: doc._id }, unsubscribed: false })
    }
    const welcome = `
      <h2>¡Gracias por registrarte en AUDICO S.A.S.!</h2>
      <p>Hemos recibido tu solicitud y un consultor te contactará pronto.</p>
      <p><b>Interés:</b> ${data.serviceInterest || '—'}</p>
      <p>Si deseas escribirnos directo: audicoempresarial@gmail.com</p>
    `
    try{ await sendMail(data.email, 'Bienvenido a AUDICO S.A.S.', welcome) }catch{}
    return NextResponse.json({ ok: true, id: doc._id })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 400 })
  }
}

export async function GET(){
  try{
    const query = groq`*[_type == "client"]|order(_createdAt desc){_id, name, email, phone, company, employees, sector, serviceInterest, message, subscribed, _createdAt}`
    const clients = await sanityRead.fetch(query)
    return NextResponse.json({ clients })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 })
  }
}

