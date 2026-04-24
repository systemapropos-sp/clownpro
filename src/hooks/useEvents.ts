import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export function useEvents() {
  const { tenant } = useAuth()
  const queryClient = useQueryClient()
  const tenantId = tenant?.id

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', tenantId],
    queryFn: async () => {
      if (!tenantId) return []
      const { data, error } = await supabase
        .from('events')
        .select('*, clients(full_name, phone), event_photos(*)')
        .eq('tenant_id', tenantId)
        .order('event_date', { ascending: true })
      if (error) throw error
      return data || []
    },
    enabled: !!tenantId,
  })

  const createEvent = useMutation({
    mutationFn: async (eventData: any) => {
      const { data, error } = await supabase
        .from('events')
        .insert({ ...eventData, tenant_id: tenantId })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', tenantId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', tenantId] })
      toast.success('Evento creado exitosamente')
    },
    onError: (error: any) => toast.error(error.message || 'Error al crear evento'),
  })

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { data: updated, error } = await supabase
        .from('events')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single()
      if (error) throw error
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', tenantId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', tenantId] })
      toast.success('Evento actualizado')
    },
  })

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id).eq('tenant_id', tenantId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', tenantId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', tenantId] })
      toast.success('Evento eliminado')
    },
  })

  const uploadEventPhoto = useMutation({
    mutationFn: async ({ eventId, file, phase }: { eventId: string; file: File; phase: 'before' | 'during' | 'after' }) => {
      const filePath = `${tenantId}/${eventId}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage.from('event-photos').upload(filePath, file)
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(filePath)
      
      const { data, error } = await supabase
        .from('event_photos')
        .insert({ event_id: eventId, tenant_id: tenantId, photo_url: publicUrl, phase })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', tenantId] })
      toast.success('Foto subida correctamente')
    },
  })

  return {
    events,
    isLoading,
    createEvent: createEvent.mutateAsync,
    updateEvent: updateEvent.mutateAsync,
    deleteEvent: deleteEvent.mutateAsync,
    uploadEventPhoto: uploadEventPhoto.mutateAsync,
  }
}
