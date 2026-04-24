import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export function useServices() {
  const { tenant } = useAuth()
  const queryClient = useQueryClient()
  const tenantId = tenant?.id

  const { data: services, isLoading } = useQuery({
    queryKey: ['services', tenantId],
    queryFn: async () => {
      if (!tenantId) return []
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('name', { ascending: true })
      if (error) throw error
      return data || []
    },
    enabled: !!tenantId,
  })

  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ['packages', tenantId],
    queryFn: async () => {
      if (!tenantId) return []
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('name', { ascending: true })
      if (error) throw error
      return data || []
    },
    enabled: !!tenantId,
  })

  const createService = useMutation({
    mutationFn: async (serviceData: any) => {
      const { data, error } = await supabase
        .from('services')
        .insert({ ...serviceData, tenant_id: tenantId })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', tenantId] })
      toast.success('Servicio creado exitosamente')
    },
  })

  const updateService = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { data: updated, error } = await supabase
        .from('services')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single()
      if (error) throw error
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', tenantId] })
      toast.success('Servicio actualizado')
    },
  })

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id).eq('tenant_id', tenantId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', tenantId] })
      toast.success('Servicio eliminado')
    },
  })

  const createPackage = useMutation({
    mutationFn: async (pkgData: any) => {
      const { data, error } = await supabase
        .from('packages')
        .insert({ ...pkgData, tenant_id: tenantId })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages', tenantId] })
      toast.success('Paquete creado exitosamente')
    },
  })

  return {
    services,
    packages,
    isLoading: isLoading || packagesLoading,
    createService: createService.mutateAsync,
    updateService: updateService.mutateAsync,
    deleteService: deleteService.mutateAsync,
    createPackage: createPackage.mutateAsync,
  }
}
