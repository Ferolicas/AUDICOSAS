import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityRead, sanityWrite } from '@/lib/sanity.server'
import groq from 'groq'
import { sendMail } from '@/lib/email'

const NewsSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
  recipients: z.union([z.literal('all'), z.array(z.string().email())])
})

export async function POST(req: NextRequest){
  try{
    const data = NewsSchema.parse(await req.json())
    let emails: string[] = []
    if(data.recipients === 'all'){
      const subs = await sanityRead.fetch(groq`*[_type=='subscriber' && !unsubscribed]{email}`)
      const clients = await sanityRead.fetch(groq`*[_type=='client' && defined(email)]{email}`)
      const all = [...subs.map((s:any)=>s.email), ...clients.map((c:any)=>c.email)] as string[]
      emails = Array.from(new Set(all))
    }else{
      emails = data.recipients
    }
    const doc = await sanityWrite.create({ _type: 'newsletter', title: data.title, content: data.content, recipients: emails, sentAt: null })
    let sent = 0
    const html = `<div style="font-family:system-ui,Segoe UI,Arial"><h2>${data.title}</h2>${data.content}</div>`
    try{
      if(emails.length){
        // Simple batch send (not optimized); in producción usar cola/segmentación
        await sendMail(emails, data.title, html)
        sent = emails.length
        await sanityWrite.patch(doc._id).set({ sentAt: new Date().toISOString() }).commit()
      }
    }catch{}
    return NextResponse.json({ ok: true, id: doc._id, recipients: emails.length, status: sent ? 'sent' : 'queued-or-stored' })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 400 })
  }
}

export async function GET(){
  try{
    const items = await sanityRead.fetch(groq`*[_type=='newsletter']|order(_createdAt desc)`)
    return NextResponse.json({ newsletters: items })
  }catch(err:any){
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 })
  }
}

