import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export function useSettings() {
  const { tenant } = useAuth()
  const queryClient = useQueryClient()
  const tenantId = tenant?.id

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings', tenantId],
    queryFn: async () => {
      if (!tenantId) return null
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!tenantId,
  })

  const updateSettings = useMutation({
    mutationFn: async (settingsData: any) => {
      const { data, error } = await supabase
        .from('tenants')
        .update(settingsData)
        .eq('id', tenantId)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', tenantId] })
      queryClient.invalidateQueries({ queryKey: ['auth-session'] })
      toast.success('Configuración actualizada')
    },
  })

  const uploadLogo = useMutation({
    mutationFn: async (file: File) => {
      const filePath = `${tenantId}/logo_${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage.from('tenant-logos').upload(filePath, file)
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage.from('tenant-logos').getPublicUrl(filePath)
      
      const { data, error } = await supabase
        .from('tenants')
        .update({ logo_url: publicUrl })
        .eq('id', tenantId)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', tenantId] })
      toast.success('Logo actualizado')
    },
  })

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutateAsync,
    uploadLogo: uploadLogo.mutateAsync,
  }
}
