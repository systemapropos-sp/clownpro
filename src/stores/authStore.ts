import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type User = Database['public']['tables']['users']['Row']
type Tenant = Database['public']['tables']['tenants']['Row']

interface AuthState {
  user: User | null
  tenant: Tenant | null
  isLoading: boolean
  isAuthenticated: boolean
  theme: 'light' | 'dark'
  language: 'es' | 'en'
  
  setUser: (user: User | null) => void
  setTenant: (tenant: Tenant | null) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (lang: 'es' | 'en') => void
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  loadSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenant: null,
      isLoading: true,
      isAuthenticated: false,
      theme: 'light',
      language: 'es',

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTenant: (tenant) => set({ tenant }),
      setTheme: (theme) => {
        set({ theme })
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
      setLanguage: (language) => set({ language }),

      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { error }
        if (data.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single()
          set({ user: profile as User, isAuthenticated: true })
          if (profile?.tenant_id) {
            const { data: tenant } = await supabase
              .from('tenants')
              .select('*')
              .eq('id', profile.tenant_id)
              .single()
            set({ tenant: tenant as Tenant })
          }
        }
        return { error: null }
      },

      signUp: async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) return { error }
        if (data.user) {
          await supabase.from('users').insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role: 'admin',
          })
        }
        return { error: null }
      },

      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, tenant: null, isAuthenticated: false })
      },

      loadSession: async () => {
        set({ isLoading: true })
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          set({ user: profile as User, isAuthenticated: true })
          if (profile?.tenant_id) {
            const { data: tenant } = await supabase
              .from('tenants')
              .select('*')
              .eq('id', profile.tenant_id)
              .single()
            set({ tenant: tenant as Tenant })
          }
        }
        set({ isLoading: false })
      },
    }),
    {
      name: 'clownpro-auth',
      partialize: (state) => ({ theme: state.theme, language: state.language }),
    }
  )
)
