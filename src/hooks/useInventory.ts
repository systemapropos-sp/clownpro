import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export function useInventory() {
  const { tenant } = useAuth()
  const queryClient = useQueryClient()
  const tenantId = tenant?.id

  const { data: items, isLoading } = useQuery({
    queryKey: ['inventory', tenantId],
    queryFn: async () => {
      if (!tenantId) return []
      const { data, error } = await supabase
        .from('inventories')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true })
      if (error) throw error
      return data || []
    },
    enabled: !!tenantId,
  })

  const createItem = useMutation({
    mutationFn: async (itemData: any) => {
      const { data, error } = await supabase
        .from('inventories')
        .insert({ ...itemData, tenant_id: tenantId })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', tenantId] })
      toast.success('Item creado exitosamente')
    },
  })

  const updateItem = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { data: updated, error } = await supabase
        .from('inventories')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single()
      if (error) throw error
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', tenantId] })
      toast.success('Item actualizado')
    },
  })

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inventories').delete().eq('id', id).eq('tenant_id', tenantId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', tenantId] })
      toast.success('Item eliminado')
    },
  })

  return {
    items,
    isLoading,
    createItem: createItem.mutateAsync,
    updateItem: updateItem.mutateAsync,
    deleteItem: deleteItem.mutateAsync,
  }
}
