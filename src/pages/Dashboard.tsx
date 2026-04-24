import { Link } from 'react-router-dom'
import { useDashboard } from '@/hooks/useDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CalendarDays,
  DollarSign,
  Users,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  ChevronRight,
  PartyPopper,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

const statsCards = [
  { name: 'Eventos próximos', key: 'upcomingEvents', icon: CalendarDays, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  { name: 'Ingresos del mes', key: 'monthlyIncome', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', format: (v: number) => `RD$ ${v.toLocaleString()}` },
  { name: 'Payasos disponibles', key: 'availableEmployees', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { name: 'Cotizaciones pendientes', key: 'pendingQuotes', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
]

export default function Dashboard() {
  const { stats, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Resumen de tu negocio hoy</p>
        </div>
        <Link to="/events/new">
          <Button className="bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-700 hover:to-orange-600 text-white">
            <PartyPopper className="w-4 h-4 mr-2" />
            Nuevo evento
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => {
          const value = (stats as any)[card.key] || 0
          return (
            <Card key={card.name} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{card.name}</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {card.format ? card.format(value) : value}
                    </p>
                  </div>
                  <div className={cn('p-3 rounded-xl', card.bg)}>
                    <card.icon className={cn('w-6 h-6', card.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's events */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-600" />
              Eventos de hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.todayEvents.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <PartyPopper className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay eventos programados para hoy</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.todayEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {format(new Date(`2000-01-01T${event.event_time}`), 'HH:mm')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-white truncate">{event.title}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.address}
                      </p>
                    </div>
                    <Badge variant={event.status === 'in_progress' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly events */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-orange-600" />
              Próximos eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.weeklyEvents.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay eventos próximos</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.weeklyEvents.map((event: any) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center text-center">
                      <span className="text-xs text-zinc-500 uppercase">
                        {format(new Date(event.event_date), 'MMM', { locale: es })}
                      </span>
                      <span className="text-lg font-bold text-violet-600">
                        {format(new Date(event.event_date), 'dd')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-white truncate">{event.title}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{event.event_type}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-600 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Transacciones recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <TrendingDown className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay transacciones recientes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="text-left py-3 px-4 font-medium text-zinc-500">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-zinc-500">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-zinc-500">Categoría</th>
                    <th className="text-right py-3 px-4 font-medium text-zinc-500">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((t: any) => (
                    <tr key={t.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="py-3 px-4">{format(new Date(t.transaction_date), 'dd/MM/yyyy')}</td>
                      <td className="py-3 px-4">
                        <Badge variant={t.type === 'income' ? 'default' : 'destructive'} className="text-xs">
                          {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{t.category}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {t.type === 'income' ? '+' : '-'}RD$ {t.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
