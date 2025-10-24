import { NextRequest, NextResponse } from 'next/server'
import { sanityWrite } from '@/lib/sanity.server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }){
  try{
    const body = await req.json()
    const id = params.id
    await sanityWrite.patch(id).set(body).commit()
    return NextResponse.json({ ok: true })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }){
  try{
    await sanityWrite.delete(params.id)
    return NextResponse.json({ ok: true })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 400 })
  }
}

