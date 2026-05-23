import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    description: 'Utenti che possono accedere al pannello admin (Moreno e collaboratori).',
  },
  auth: true,
  fields: [
    {
      name: 'nome',
      type: 'text',
    },
    {
      name: 'ruolo',
      type: 'select',
      defaultValue: 'staff',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
      ],
    },
  ],
}
