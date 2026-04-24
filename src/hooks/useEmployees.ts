import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export function useEmployees() {
  const { tenant } = useAuth()
  const queryClient = useQueryClient()
  const tenantId = tenant?.id

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees', tenantId],
    queryFn: async () => {
      if (!tenantId) return []
      const { data, error } = await supabase
        .from('employees')
        .select('*, users(full_name, email, avatar_url)')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('artistic_name', { ascending: true })
      if (error) throw error
      return data || []
    },
    enabled: !!tenantId,
  })

  const createEmployee = useMutation({
    mutationFn: async (employeeData: any) => {
      const { data, error } = await supabase
        .from('employees')
        .insert({ ...employeeData, tenant_id: tenantId })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantId] })
      toast.success('Empleado creado exitosamente')
    },
  })

  const updateEmployee = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { data: updated, error } = await supabase
        .from('employees')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single()
      if (error) throw error
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantId] })
      toast.success('Empleado actualizado')
    },
  })

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('employees').delete().eq('id', id).eq('tenant_id', tenantId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantId] })
      toast.success('Empleado eliminado')
    },
  })

  return {
    employees,
    isLoading,
    createEmployee: createEmployee.mutateAsync,
    updateEmployee: updateEmployee.mutateAsync,
    deleteEmployee: deleteEmployee.mutateAsync,
  }
}
