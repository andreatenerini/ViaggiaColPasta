'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  async function logout() {
    setLoading(true)
    await fetch('/api/area-riservata/logout', { method: 'POST' })
    router.push('/area-riservata')
    router.refresh()
  }
  return (
    <button
      onClick={logout}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand transition-colors disabled:opacity-60"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      {loading ? 'Esco…' : 'Esci'}
    </button>
  )
}
