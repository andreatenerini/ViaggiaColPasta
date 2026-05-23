import type { CollectionConfig } from 'payload'

export const Video: CollectionConfig = {
  slug: 'video',
  admin: {
    useAsTitle: 'titolo',
    defaultColumns: ['titolo', 'luogo', 'pubblicato', 'updatedAt'],
    description: 'Video della galleria. Possono essere caricati direttamente o linkati (YouTube/Vimeo).',
  },
  access: {
    read: ({ req }) => {
      // Pubblico solo i video con pubblicato=true; admin vede tutto
      if (req.user) return true
      return { pubblicato: { equals: true } }
    },
  },
  fields: [
    { name: 'titolo', type: 'text', required: true },
    {
      name: 'luogo',
      type: 'relationship',
      relationTo: 'luoghi',
      required: true,
    },
    {
      name: 'tipoSorgente',
      type: 'radio',
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'File caricato', value: 'upload' },
      ],
    },
    {
      name: 'urlEsterno',
      type: 'text',
      admin: {
        condition: (data) => data?.tipoSorgente === 'youtube' || data?.tipoSorgente === 'vimeo',
        description: 'URL pubblico del video.',
      },
    },
    {
      name: 'fileVideo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.tipoSorgente === 'upload',
      },
    },
    {
      name: 'copertina',
      type: 'upload',
      relationTo: 'media',
      label: 'Immagine di copertina (opzionale)',
    },
    {
      name: 'descrizione',
      type: 'textarea',
    },
    {
      name: 'pubblicato',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Se disattivato, il video non appare nella galleria pubblica.' },
    },
    {
      name: 'mittente',
      type: 'group',
      label: 'Mittente (se inviato da un utente)',
      admin: { description: 'Solo informativo, utile se Moreno carica un video ricevuto da un cliente.' },
      fields: [
        { name: 'nome', type: 'text' },
        { name: 'email', type: 'email' },
      ],
    },
  ],
}
