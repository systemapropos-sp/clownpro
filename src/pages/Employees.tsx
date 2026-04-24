import { useState } from 'react'
import { useEmployees } from '@/hooks/useEmployees'
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
  Star,
  DollarSign,
  Wand2,
  User,
} from 'lucide-react'

const specialtiesList = [
  'Payaso',
  'Mago',
  'Pintacaritas',
  'Animador',
  'DJ',
  'Inflables',
  'Decorador',
]

export default function Employees() {
  const { employees, isLoading, createEmployee, updateEmployee, deleteEmployee } = useEmployees()
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)

  const [formData, setFormData] = useState({
    artistic_name: '',
    specialties: [] as string[],
    payment_type: 'per_event' as const,
    payment_amount: 0,
    rating: 5,
  })

  const filteredEmployees = employees?.filter((emp: any) =>
    emp.artistic_name?.toLowerCase().includes(search.toLowerCase()) ||
    emp.specialties?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
  ) || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEmployee) {
      await updateEmployee({ id: editingEmployee.id, ...formData })
    } else {
      await createEmployee(formData)
    }
    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({ artistic_name: '', specialties: [], payment_type: 'per_event', payment_amount: 0, rating: 5 })
    setEditingEmployee(null)
  }

  const handleEdit = (emp: any) => {
    setEditingEmployee(emp)
    setFormData({
      artistic_name: emp.artistic_name,
      specialties: emp.specialties || [],
      payment_type: emp.payment_type,
      payment_amount: emp.payment_amount,
      rating: emp.rating,
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Empleados / Payasos</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Gestiona tu equipo de animadores</p>
        </div>
        <Button
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-700 hover:to-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo empleado
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          placeholder="Buscar por nombre artístico o especialidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
        </div>
      ) : filteredEmployees.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16">
            <User className="w-16 h-16 mx-auto mb-4 text-zinc-300" />
            <p className="text-zinc-500 text-lg">No hay empleados registrados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp: any) => (
            <Card key={emp.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                      {emp.artistic_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white">{emp.artistic_name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-zinc-500">{emp.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {emp.specialties?.map((spec: string) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      <Wand2 className="w-3 h-3 mr-1" />
                      {spec}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>
                      {emp.payment_type === 'per_event' ? 'Por evento' : 'Quincenal'}: RD$ {emp.payment_amount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(emp)}>
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <div className="flex-1" />
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteEmployee(emp.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre artístico</Label>
              <Input value={formData.artistic_name} onChange={(e) => setFormData({ ...formData, artistic_name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Especialidades</Label>
              <div className="flex flex-wrap gap-2">
                {specialtiesList.map((spec) => (
                  <Badge
                    key={spec}
                    variant={formData.specialties.includes(spec) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const newSpecs = formData.specialties.includes(spec)
                        ? formData.specialties.filter((s) => s !== spec)
                        : [...formData.specialties, spec]
                      setFormData({ ...formData, specialties: newSpecs })
                    }}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de pago</Label>
                <Select value={formData.payment_type} onValueChange={(v: any) => setFormData({ ...formData, payment_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per_event">Por evento</SelectItem>
                    <SelectItem value="biweekly">Quincenal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monto (RD$)</Label>
                <Input type="number" value={formData.payment_amount} onChange={(e) => setFormData({ ...formData, payment_amount: parseFloat(e.target.value) })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rating inicial (1-5)</Label>
              <Input type="number" min={1} max={5} value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })} />
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
