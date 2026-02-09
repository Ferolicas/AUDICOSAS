import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityWrite } from '@/lib/sanity.server'

const SubSchema = z.object({ email: z.string().email(), name: z.string().optional() })

export async function POST(req: NextRequest){
  try{
    const data = SubSchema.parse(await req.json())
    const id = `subscriber-${data.email.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    await sanityWrite().createOrReplace({ _id: id, _type: 'subscriber', email: data.email, name: data.name || null, unsubscribed: false })
    return NextResponse.json({ ok: true, id })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 400 })
  }
}
