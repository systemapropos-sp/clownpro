import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { demoEvents, demoEmployees, demoTransactions } from '@/lib/demoData'

export function useDashboard() {
  const { tenant, isDemoMode } = useAuth()
  const tenantId = tenant?.id

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', tenantId],
    queryFn: async () => {
      if (isDemoMode) {
        const today = new Date().toISOString().split('T')[0]
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        
        const upcomingEvents = demoEvents.filter(e => e.event_date >= today && ['confirmed', 'in_progress'].includes(e.status))
        const todayEvents = demoEvents.filter(e => e.event_date === today)
        const pendingQuotes = demoEvents.filter(e => e.status === 'quote')
        const monthlyIncome = demoTransactions
          .filter(t => t.type === 'income' && t.transaction_date >= monthStart.split('T')[0])
          .reduce((sum, t) => sum + t.amount, 0)
        
        return {
          upcomingEvents: upcomingEvents.length,
          monthlyIncome,
          availableEmployees: demoEmployees.length,
          pendingQuotes: pendingQuotes.length,
          todayEvents,
          weeklyEvents: demoEvents.filter(e => e.event_date >= today).slice(0, 5),
          recentTransactions: demoTransactions.slice(0, 5),
        }
      }
      
      if (!tenantId) return {
        upcomingEvents: 0,
        monthlyIncome: 0,
        availableEmployees: 0,
        pendingQuotes: 0,
        todayEvents: [],
        weeklyEvents: [],
        recentTransactions: [],
      }

      const today = new Date().toISOString().split('T')[0]
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

      const { data: upcomingEventsData } = await supabase
        .from('events')
        .select('*')
        .eq('tenant_id', tenantId)
        .gte('event_date', today)
        .in('status', ['confirmed', 'in_progress'])
        .order('event_date', { ascending: true })
        .limit(5)

      const { count: upcomingCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .gte('event_date', today)
        .in('status', ['confirmed', 'in_progress'])

      const { data: todayEvents } = await supabase
        .from('events')
        .select('*, clients(full_name)')
        .eq('tenant_id', tenantId)
        .eq('event_date', today)

      const { count: availableCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .eq('is_active', true)

      const { count: pendingQuotes } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .eq('status', 'quote')

      const { data: monthlyIncomeData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('tenant_id', tenantId)
        .eq('type', 'income')
        .gte('transaction_date', monthStart)

      const monthlyIncome = monthlyIncomeData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0

      const { data: recentTransactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('transaction_date', { ascending: false })
        .limit(5)

      return {
        upcomingEvents: upcomingCount || 0,
        monthlyIncome,
        availableEmployees: availableCount || 0,
        pendingQuotes: pendingQuotes || 0,
        todayEvents: todayEvents || [],
        weeklyEvents: upcomingEventsData || [],
        recentTransactions: recentTransactions || [],
      }
    },
    enabled: !!tenantId || isDemoMode,
    refetchInterval: 30000,
  })

  return {
    stats: stats || {
      upcomingEvents: 0,
      monthlyIncome: 0,
      availableEmployees: 0,
      pendingQuotes: 0,
      todayEvents: [],
      weeklyEvents: [],
      recentTransactions: [],
    },
    isLoading,
  }
}
