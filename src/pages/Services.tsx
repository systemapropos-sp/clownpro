import { useState } from 'react'
import { useServices } from '@/hooks/useServices'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  DollarSign,
  Clock,
} from 'lucide-react'

const categories = [
  'Payasos',
  'Magos',
  'Pintacaritas',
  'Inflables',
  'DJ',
  'Animadores',
  'Decoración',
  'Comida',
  'Otro',
]

export default function Services() {
  const { services, packages, createService, updateService, deleteService, createPackage } = useServices()
  const [search, setSearch] = useState('')
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    base_price: 0,
    duration_minutes: 60,
    category: 'Payasos',
    availability: [] as string[],
  })
  const [packageForm, setPackageForm] = useState({
    name: '',
    description: '',
    services: [] as string[],
    discount_percentage: 0,
    total_price: 0,
  })

  const filteredServices = services?.filter((s: any) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  ) || []

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingService) {
      await updateService({ id: editingService.id, ...serviceForm })
    } else {
      await createService(serviceForm)
    }
    setIsServiceDialogOpen(false)
    resetServiceForm()
  }

  const resetServiceForm = () => {
    setServiceForm({ name: '', description: '', base_price: 0, duration_minutes: 60, category: 'Payasos', availability: [] })
    setEditingService(null)
  }

  const handleServiceEdit = (service: any) => {
    setEditingService(service)
    setServiceForm({
      name: service.name,
      description: service.description || '',
      base_price: service.base_price,
      duration_minutes: service.duration_minutes,
      category: service.category,
      availability: service.availability || [],
    })
    setIsServiceDialogOpen(true)
  }

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createPackage(packageForm)
    setIsPackageDialogOpen(false)
    setPackageForm({ name: '', description: '', services: [], discount_percentage: 0, total_price: 0 })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Catálogo de Servicios</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Administra servicios y paquetes</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => { resetServiceForm(); setIsServiceDialogOpen(true); }}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Servicio
          </Button>
          <Button
            onClick={() => setIsPackageDialogOpen(true)}
            className="bg-gradient-to-r from-violet-600 to-orange-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Paquete
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          placeholder="Buscar servicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Services */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Servicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service: any) => (
            <Card key={service.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge className="mb-2">{service.category}</Badge>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">{service.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleServiceEdit(service)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteService(service.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">{service.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    RD$ {service.base_price?.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-500">
                    <Clock className="w-4 h-4" />
                    {service.duration_minutes} min
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Packages */}
      {packages && packages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Paquetes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg: any) => (
              <Card key={pkg.id} className="border-0 shadow-sm border-l-4 border-l-violet-500">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{pkg.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{pkg.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">-{pkg.discount_percentage}% descuento</Badge>
                    <span className="text-lg font-bold text-violet-600">RD$ {pkg.total_price?.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Service Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleServiceSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={serviceForm.category} onValueChange={(v) => setServiceForm({ ...serviceForm, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Precio base (RD$)</Label>
                <Input type="number" value={serviceForm.base_price} onChange={(e) => setServiceForm({ ...serviceForm, base_price: parseFloat(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <Label>Duración (min)</Label>
                <Input type="number" value={serviceForm.duration_minutes} onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: parseInt(e.target.value) })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-gradient-to-r from-violet-600 to-orange-500 text-white">Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Package Dialog */}
      <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo Paquete</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePackageSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre del paquete</Label>
              <Input value={packageForm.name} onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Servicios incluidos</Label>
              <div className="flex flex-wrap gap-2">
                {services?.map((s: any) => (
                  <Badge
                    key={s.id}
                    variant={packageForm.services.includes(s.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const newServices = packageForm.services.includes(s.id)
                        ? packageForm.services.filter((id) => id !== s.id)
                        : [...packageForm.services, s.id]
                      setPackageForm({ ...packageForm, services: newServices })
                    }}
                  >
                    {s.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Descuento (%)</Label>
                <Input type="number" value={packageForm.discount_percentage} onChange={(e) => setPackageForm({ ...packageForm, discount_percentage: parseFloat(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <Label>Precio total (RD$)</Label>
                <Input type="number" value={packageForm.total_price} onChange={(e) => setPackageForm({ ...packageForm, total_price: parseFloat(e.target.value) })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={packageForm.description} onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })} rows={2} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsPackageDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-gradient-to-r from-violet-600 to-orange-500 text-white">Crear paquete</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
