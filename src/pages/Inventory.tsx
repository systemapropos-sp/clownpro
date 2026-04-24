import { useState } from 'react'
import { useInventory } from '@/hooks/useInventory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Warehouse,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig = {
  available: { label: 'Disponible', icon: CheckCircle2, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  in_use: { label: 'En uso', icon: Warehouse, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  maintenance: { label: 'Mantenimiento', icon: Wrench, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
  damaged: { label: 'Dañado', icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
}

const categories = ['Props', 'Disfraces', 'Maquillaje', 'Inflables', 'Equipo sonido', 'Decoración', 'Otro']

export default function Inventory() {
  const { items, isLoading, createItem, updateItem, deleteItem } = useInventory()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Props',
    description: '',
    quantity: 1,
    status: 'available' as keyof typeof statusConfig,
    alert_threshold: 2,
  })

  const filteredItems = items?.filter((item: any) => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      await updateItem({ id: editingItem.id, ...formData })
    } else {
      await createItem(formData)
    }
    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: '', category: 'Props', description: '', quantity: 1, status: 'available', alert_threshold: 2 })
    setEditingItem(null)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description || '',
      quantity: item.quantity,
      status: item.status,
      alert_threshold: item.alert_threshold,
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Inventario / Equipo</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Control de props, disfraces y equipos</p>
        </div>
        <Button
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-700 hover:to-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo item
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input placeholder="Buscar item..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="in_use">En uso</SelectItem>
            <SelectItem value="maintenance">Mantenimiento</SelectItem>
            <SelectItem value="damaged">Dañado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts */}
      {items?.some((item: any) => item.quantity <= item.alert_threshold && item.status === 'available') && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Algunos items tienen stock bajo. Revisa el inventario.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16">
            <Warehouse className="w-16 h-16 mx-auto mb-4 text-zinc-300" />
            <p className="text-zinc-500 text-lg">No hay items registrados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item: any) => {
            const status = statusConfig[item.status as keyof typeof statusConfig]
            const isLowStock = item.quantity <= item.alert_threshold && item.status === 'available'
            return (
              <Card key={item.id} className={cn('border-0 shadow-sm hover:shadow-md transition-shadow', isLowStock && 'border-l-4 border-l-yellow-500')}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                      <h3 className="font-semibold text-zinc-900 dark:text-white">{item.name}</h3>
                    </div>
                    <div className={cn('p-2 rounded-lg', status?.color)}>
                      {status && <status.icon className="w-4 h-4" />}
                    </div>
                  </div>

                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">{item.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Cantidad: <strong>{item.quantity}</strong>
                    </span>
                    <Badge className={cn(status?.color, 'border-0')}>
                      {status?.label}
                    </Badge>
                  </div>

                  {isLowStock && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-yellow-600">
                      <AlertTriangle className="w-3 h-3" />
                      Stock bajo (mín: {item.alert_threshold})
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      <Pencil className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <div className="flex-1" />
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteItem(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Item' : 'Nuevo Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="in_use">En uso</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="damaged">Dañado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alerta de stock mínimo</Label>
              <Input type="number" value={formData.alert_threshold} onChange={(e) => setFormData({ ...formData, alert_threshold: parseInt(e.target.value) })} />
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
