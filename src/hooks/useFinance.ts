import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export function useFinance() {
  const { tenant } = useAuth()
  const queryClient = useQueryClient()
  const tenantId = tenant?.id

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', tenantId],
    queryFn: async () => {
      if (!tenantId) return []
      const { data, error } = await supabase
        .from('transactions')
        .select('*, events(title)')
        .eq('tenant_id', tenantId)
        .order('transaction_date', { ascending: false })
      if (error) throw error
      return data || []
    },
    enabled: !!tenantId,
  })

  const createTransaction = useMutation({
    mutationFn: async (transactionData: any) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...transactionData, tenant_id: tenantId })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', tenantId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', tenantId] })
      toast.success('Transacción registrada')
    },
  })

  const updateTransaction = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const { data: updated, error } = await supabase
        .from('transactions')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single()
      if (error) throw error
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', tenantId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', tenantId] })
      toast.success('Transacción actualizada')
    },
  })

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id).eq('tenant_id', tenantId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', tenantId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', tenantId] })
      toast.success('Transacción eliminada')
    },
  })

  const stats = useQuery({
    queryKey: ['finance-stats', tenantId],
    queryFn: async () => {
      if (!tenantId) return { income: 0, expense: 0, balance: 0 }
      const { data: incomeData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('tenant_id', tenantId)
        .eq('type', 'income')
      const { data: expenseData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('tenant_id', tenantId)
        .eq('type', 'expense')
      const income = incomeData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
      const expense = expenseData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
      return { income, expense, balance: income - expense }
    },
    enabled: !!tenantId,
  })

  return {
    transactions,
    stats: stats.data || { income: 0, expense: 0, balance: 0 },
    isLoading: isLoading || stats.isLoading,
    createTransaction: createTransaction.mutateAsync,
    updateTransaction: updateTransaction.mutateAsync,
    deleteTransaction: deleteTransaction.mutateAsync,
  }
}
