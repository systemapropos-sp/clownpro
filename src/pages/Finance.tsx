import { useState } from 'react'
import { useFinance } from '@/hooks/useFinance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  CreditCard,
  Trash2,
  BarChart3,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const incomeCategories = ['Eventos', 'Depósitos', 'Extras', 'Otro']
const expenseCategories = ['Gasolina', 'Materiales', 'Pagos empleados', 'Alquiler equipo', 'Comida', 'Otro']
const paymentMethods = ['Efectivo', 'Transferencia', 'Tarjeta', 'Zelle', 'Otro']

const COLORS = ['#7C3AED', '#F97316', '#22C55E', '#3B82F6', '#EF4444', '#8B5CF6']

export default function Finance() {
  const { transactions, stats, isLoading, createTransaction, deleteTransaction } = useFinance()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: 0,
    payment_method: 'Efectivo',
    description: '',
    transaction_date: format(new Date(), 'yyyy-MM-dd'),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createTransaction(formData)
    setIsDialogOpen(false)
    setFormData({
      type: 'income',
      category: '',
      amount: 0,
      payment_method: 'Efectivo',
      description: '',
      transaction_date: format(new Date(), 'yyyy-MM-dd'),
    })
  }

  const monthlyData = transactions?.reduce((acc: any[], t: any) => {
    const month = format(new Date(t.transaction_date), 'MMM', { locale: es })
    const existing = acc.find((item) => item.month === month)
    if (existing) {
      existing[t.type] += t.amount
    } else {
      acc.push({ month, income: t.type === 'income' ? t.amount : 0, expense: t.type === 'expense' ? t.amount : 0 })
    }
    return acc
  }, []) || []

  const categoryData = transactions?.reduce((acc: any[], t: any) => {
    const existing = acc.find((item) => item.name === t.category)
    if (existing) {
      existing.value += t.amount
    } else {
      acc.push({ name: t.category, value: t.amount })
    }
    return acc
  }, []) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Finanzas</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Control de ingresos y gastos</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-700 hover:to-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva transacción
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Ingresos totales</p>
                <p className="text-2xl font-bold text-green-600">RD$ {stats.income.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Gastos totales</p>
                <p className="text-2xl font-bold text-red-600">RD$ {stats.expense.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Balance</p>
                <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-violet-600' : 'text-red-600'}`}>
                  RD$ {stats.balance.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20">
                <Wallet className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {monthlyData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-600" />
                Ingresos vs Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `RD$ ${value.toLocaleString()}`} />
                  <Bar dataKey="income" fill="#22C55E" name="Ingresos" />
                  <Bar dataKey="expense" fill="#EF4444" name="Gastos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {categoryData.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  Por categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name }) => name}
                    >
                      {categoryData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `RD$ ${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Transactions Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
            </div>
          ) : transactions?.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay transacciones registradas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="text-left py-3 px-4 font-medium text-zinc-500">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-zinc-500">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-zinc-500">Categoría</th>
                    <th className="text-left py-3 px-4 font-medium text-zinc-500">Método</th>
                    <th className="text-right py-3 px-4 font-medium text-zinc-500">Monto</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map((t: any) => (
                    <tr key={t.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="py-3 px-4">{format(new Date(t.transaction_date), 'dd/MM/yyyy')}</td>
                      <td className="py-3 px-4">
                        <Badge variant={t.type === 'income' ? 'default' : 'destructive'}>
                          {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{t.category}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {t.payment_method}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {t.type === 'income' ? '+' : '-'}RD$ {t.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteTransaction(t.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva Transacción</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v, category: '' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Ingreso</SelectItem>
                  <SelectItem value="expense">Gasto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                <SelectContent>
                  {(formData.type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monto (RD$)</Label>
                <Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <Label>Método de pago</Label>
                <Select value={formData.payment_method} onValueChange={(v) => setFormData({ ...formData, payment_method: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" value={formData.transaction_date} onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-gradient-to-r from-violet-600 to-orange-500 text-white">Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
