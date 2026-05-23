import type { CollectionConfig } from 'payload'

export const Offerte: CollectionConfig = {
  slug: 'offerte',
  admin: {
    useAsTitle: 'titolo',
    defaultColumns: ['titolo', 'attiva', 'updatedAt'],
    description: 'Offerte mostrate in vetrina. NIENTE carrello: ogni card ha un bottone WhatsApp che apre la chat con Moreno.',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'titolo', type: 'text', required: true },
    {
      name: 'immagine',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'descrizioneBreve',
      type: 'textarea',
      maxLength: 300,
      required: true,
    },
    {
      name: 'testoWhatsapp',
      type: 'text',
      label: 'Testo precompilato del messaggio WhatsApp',
      defaultValue: 'Ciao Moreno! Vorrei più informazioni sull\'offerta:',
    },
    {
      name: 'attiva',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'ordine',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Più basso = appare prima.' },
    },
  ],
}
