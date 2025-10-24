import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID || ''
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2023-10-10'
const token = process.env.SANITY_WRITE_TOKEN

export const sanityRead = createClient({ projectId, dataset, apiVersion, useCdn: false })
export const sanityWrite = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

export function requireWrite(){
  if(!token) throw new Error('SANITY_WRITE_TOKEN no configurado')
}

