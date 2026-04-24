import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function useAuth() {
  const store = useAuthStore()
  const queryClient = useQueryClient()

  const { isLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      await store.loadSession()
      return store.user
    },
    staleTime: Infinity,
  })

  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await store.signIn(email, password)
      if (result.error) throw result.error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-session'] })
      toast.success('¡Bienvenido a CLOWNPRO!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al iniciar sesión')
    },
  })

  const signUp = useMutation({
    mutationFn: async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
      const result = await store.signUp(email, password, fullName)
      if (result.error) throw result.error
      return result
    },
    onSuccess: () => {
      toast.success('Cuenta creada. Verifica tu email.')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al registrarse')
    },
  })

  const signOut = useMutation({
    mutationFn: async () => {
      await store.signOut()
    },
    onSuccess: () => {
      queryClient.clear()
      toast.success('Sesión cerrada')
    },
  })

  const createTenant = useMutation({
    mutationFn: async (tenantData: { name: string; subdomain: string }) => {
      const { data, error } = await supabase
        .from('tenants')
        .insert({
          ...tenantData,
          primary_color: '#7C3AED',
          secondary_color: '#F97316',
          currency: 'DOP',
          tax_rate: 0.18,
        })
        .select()
        .single()
      if (error) throw error
      
      if (store.user) {
        await supabase
          .from('users')
          .update({ tenant_id: data.id, role: 'admin' })
          .eq('id', store.user.id)
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-session'] })
      toast.success('Negocio configurado correctamente')
    },
  })

  return {
    user: store.user,
    tenant: store.tenant,
    isLoading,
    isAuthenticated: store.isAuthenticated,
    theme: store.theme,
    language: store.language,
    setTheme: store.setTheme,
    setLanguage: store.setLanguage,
    signIn: signIn.mutateAsync,
    signUp: signUp.mutateAsync,
    signOut: signOut.mutateAsync,
    createTenant: createTenant.mutateAsync,
  }
}
