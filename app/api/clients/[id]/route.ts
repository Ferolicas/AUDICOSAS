import { NextRequest, NextResponse } from 'next/server'
import { sanityWrite } from '@/lib/sanity.server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
  try{
    const body = await req.json()
    const { id } = await params
    await sanityWrite().patch(id).set(body).commit()
    return NextResponse.json({ ok: true })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }){
  try{
    const { id } = await params
    await sanityWrite().delete(id)
    return NextResponse.json({ ok: true })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 400 })
  }
}
