import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export type OperatingHour = { day: string; time: string }

export type SiteSettings = {
  store_name: string
  description: string
  our_story: string
  address: string
  phone: string
  email: string
  operating_hours: OperatingHour[]
  map_embed_url: string
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error) console.warn('site_settings error:', error.message)
        if (data) setSettings(data as SiteSettings)
      })
  }, [])

  return settings
}
