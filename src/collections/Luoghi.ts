import type { CollectionConfig } from 'payload'

export const Luoghi: CollectionConfig = {
  slug: 'luoghi',
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'tipologia', 'sottocategoria'],
    description: 'Catalogo destinazioni usato dal form Preventivo Tour Operator e dalla Videogallery.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      label: 'Nome destinazione (es. Vietnam, Crociera Caraibi, Liguria)',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Usato per le URL della videogallery (es. /videogallery/maldive).',
      },
    },
    {
      name: 'tipologia',
      type: 'select',
      required: true,
      options: [
        { label: 'Lungo Raggio', value: 'lungo-raggio' },
        { label: 'Medio Raggio', value: 'medio-raggio' },
        { label: 'Italia Mare', value: 'italia-mare' },
        { label: 'Crociere', value: 'crociere' },
      ],
    },
    {
      name: 'sottocategoria',
      type: 'text',
      admin: {
        description: 'Compilare solo per Lungo Raggio / Medio Raggio.',
        condition: (data) =>
          data?.tipologia === 'lungo-raggio' || data?.tipologia === 'medio-raggio',
      },
    },
    {
      name: 'descrizione',
      type: 'richText',
    },
    {
      name: 'immaginiCopertina',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'attivo',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Se disattivato, non compare nel form preventivo.' },
    },
  ],
}
