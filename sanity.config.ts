import { defineConfig } from 'sanity'
import { deskTool } from '@sanity/desk'
import { visionTool } from '@sanity/vision'
import schemas from './sanity/schemas'

export default defineConfig({
  name: 'audico',
  title: 'AUDICO CMS',
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],
  schema: { types: schemas }
})
