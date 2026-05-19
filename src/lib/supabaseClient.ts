import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_project_url'
)

if (!isConfigured) {
  console.warn(
    'Supabase environment variables are not set. ' +
    'Using demo mode. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local to enable live data.'
  )
}

const emptyResult = { data: null, error: null }

// Chainable dummy that resolves to empty data for any method chain
function createChainable(): any {
  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      if (prop === 'then') {
        // Make it thenable — resolves to emptyResult
        return (resolve: (v: any) => void) => resolve(emptyResult)
      }
      // Any method call returns another chainable
      return () => new Proxy({}, handler)
    },
  }
  return new Proxy({}, handler)
}

const dummyClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (prop === 'auth') {
      return {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Not configured') }),
        signOut: () => Promise.resolve(),
      }
    }
    if (prop === 'storage') {
      return {
        from: () => ({
          upload: () => Promise.resolve({ error: new Error('Not configured') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      }
    }
    // .from('table') returns chainable
    return () => createChainable()
  },
})

export const supabase: SupabaseClient = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : dummyClient

export type MenuItem = {
  id: number
  name: string
  category: string
  variant: string | null
  price: number
  stock: number
  is_active: boolean
  created_at: string
}

export type ContactSubmission = {
  name: string
  email: string
  message: string
}
