import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityRead, sanityWrite } from '@/lib/sanity.server'
import groq from 'groq'

const ProcSchema = z.object({
  clientId: z.string(),
  title: z.string().min(2),
  stage: z.string().default('inicio'),
  status: z.string().default('pendiente'),
  dueDate: z.string().optional(),
  notes: z.string().optional()
})

export async function POST(req: NextRequest){
  try{
    const body = await req.json()
    const data = ProcSchema.parse(body)
    const doc = await sanityWrite().create({ _type: 'process', title: data.title, stage: data.stage, status: data.status, dueDate: data.dueDate || null, notes: data.notes || null, client: { _type: 'reference', _ref: data.clientId } })
    return NextResponse.json({ ok: true, id: doc._id })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 400 })
  }
}

export async function GET(req: NextRequest){
  try{
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')
    const q = clientId ? groq`*[_type=='process' && client._ref==$clientId]|order(_createdAt desc)` : groq`*[_type=='process']|order(_createdAt desc)`
    const data = await sanityRead().fetch(q, { clientId: clientId || undefined })
    return NextResponse.json({ processes: data })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 })
  }
}
