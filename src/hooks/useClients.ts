import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { demoClients } from '@/lib/demoData'
import { toast } from 'sonner'

export function useClients() {
  const { tenant, isDemoMode } = useAuth()
  const queryClient = useQueryClient()
  const tenantId = tenant?.id

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', tenantId],
    queryFn: async () => {
      if (isDemoMode) return demoClients
      if (!tenantId) return []
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('full_name', { ascending: true })
      if (error) throw error
      return data || []
    },
    enabled: !!tenantId || isDemoMode,
  })

  const createClient = useMutation({
    mutationFn: async (clientData: any) => {
      const { data, error } = await supabase
        .from('clients')
        .insert({ ...clientData, tenant_id: tenantId })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', tenantId] })
      toast.success('Cliente creado exitosamente')
    },
    onError: (error: any) => toast.error(error.message || 'Error al crear cliente'),
  })

  const updateClient = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { data: updated, error } = await supabase
        .from('clients')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single()
      if (error) throw error
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', tenantId] })
      toast.success('Cliente actualizado')
    },
  })

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id).eq('tenant_id', tenantId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', tenantId] })
      toast.success('Cliente eliminado')
    },
  })

  return {
    clients,
    isLoading,
    createClient: createClient.mutateAsync,
    updateClient: updateClient.mutateAsync,
    deleteClient: deleteClient.mutateAsync,
  }
}
