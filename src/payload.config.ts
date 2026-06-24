import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { it } from '@payloadcms/translations/languages/it'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { PreventiviTourOperator } from './collections/PreventiviTourOperator'
import { PreventiviItinerarioLibero } from './collections/PreventiviItinerarioLibero'
import { Offerte } from './collections/Offerte'
import { Luoghi } from './collections/Luoghi'
import { Video } from './collections/Video'
import { Clienti } from './collections/Clienti'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Admin (CMS) in italiano
  i18n: {
    supportedLanguages: { it },
    fallbackLanguage: 'it',
  },
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Si Travel Perugia',
    },
  },
  collections: [
    Users,
    Media,
    PreventiviTourOperator,
    PreventiviItinerarioLibero,
    Offerte,
    Luoghi,
    Video,
    Clienti,
  ],
  editor: lexicalEditor({}),
  sharp,
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  email: process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL
    ? resendAdapter({
        defaultFromAddress: process.env.RESEND_FROM_EMAIL,
        defaultFromName: 'Si Travel Perugia',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
