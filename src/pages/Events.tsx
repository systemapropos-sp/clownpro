import { useState } from 'react'
import { useEvents } from '@/hooks/useEvents'
import { useClients } from '@/hooks/useClients'
import { useServices } from '@/hooks/useServices'
import { useEmployees } from '@/hooks/useEmployees'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  User,
  Filter,
  ImagePlus,
  CheckSquare,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

const statusConfig = {
  quote: { label: 'Cotización', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  confirmed: { label: 'Confirmado', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  in_progress: { label: 'En progreso', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  completed: { label: 'Completado', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
}

const eventTypes = [
  'Cumpleaños',
  'Bautizo',
  'Baby shower',
  'Escuela',
  'Corporativo',
  'Boda',
  'Otro',
]

export default function Events() {
  const { events, isLoading, createEvent, updateEvent, deleteEvent, uploadEventPhoto } = useEvents()
  const { clients } = useClients()
  const { services, packages } = useServices()
  const { employees } = useEmployees()
  
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const [formData, setFormData] = useState({
    title: '',
    event_type: 'Cumpleaños',
    event_date: '',
    event_time: '',
    duration_minutes: 120,
    address: '',
    client_id: '',
    package_id: '',
    services: [] as string[],
    employees_assigned: [] as string[],
    status: 'quote' as const,
    total_amount: 0,
    deposit_amount: 0,
    notes: '',
  })

  const filteredEvents = events?.filter((event: any) => {
    const matchesSearch = event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.clients?.full_name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEvent) {
      await updateEvent({ id: editingEvent.id, ...formData })
      setEditingEvent(null)
    } else {
      await createEvent(formData)
    }
    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      event_type: 'Cumpleaños',
      event_date: '',
      event_time: '',
      duration_minutes: 120,
      address: '',
      client_id: '',
      package_id: '',
      services: [],
      employees_assigned: [],
      status: 'quote',
      total_amount: 0,
      deposit_amount: 0,
      notes: '',
    })
  }

  const handleEdit = (event: any) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      event_type: event.event_type,
      event_date: event.event_date,
      event_time: event.event_time,
      duration_minutes: event.duration_minutes,
      address: event.address,
      client_id: event.client_id,
      package_id: event.package_id || '',
      services: event.services || [],
      employees_assigned: event.employees_assigned || [],
      status: event.status,
      total_amount: event.total_amount,
      deposit_amount: event.deposit_amount,
      notes: event.notes || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      await deleteEvent(id)
    }
  }

  const handlePhotoUpload = async (eventId: string, file: File, phase: 'before' | 'during' | 'after') => {
    await uploadEventPhoto({ eventId, file, phase })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Gestión de Eventos</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Administra todos tus eventos</p>
        </div>
        <Button
          onClick={() => {
            setEditingEvent(null)
            resetForm()
            setIsDialogOpen(true)
          }}
          className="bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-700 hover:to-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo evento
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Buscar evento o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="quote">Cotización</SelectItem>
            <SelectItem value="confirmed">Confirmado</SelectItem>
            <SelectItem value="in_progress">En progreso</SelectItem>
            <SelectItem value="completed">Completado</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-zinc-300" />
            <p className="text-zinc-500 text-lg">No hay eventos registrados</p>
            <p className="text-zinc-400 text-sm mt-1">Crea tu primer evento haciendo clic en "Nuevo evento"</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEvents.map((event: any) => (
            <Card key={event.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">{event.title}</h3>
                    <p className="text-sm text-zinc-500">{event.event_type}</p>
                  </div>
                  <Badge className={cn(statusConfig[event.status as keyof typeof statusConfig]?.color)}>
                    {statusConfig[event.status as keyof typeof statusConfig]?.label}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Calendar className="w-4 h-4 text-violet-500" />
                    <span>{format(new Date(event.event_date), 'EEEE, d MMMM yyyy', { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>{event.event_time} ({event.duration_minutes} min)</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="truncate">{event.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>{event.clients?.full_name || 'Sin cliente'}</span>
                  </div>
                  {event.total_amount > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-semibold">
                        RD$ {event.total_amount.toLocaleString()}
                      </span>
                      {event.deposit_amount > 0 && (
                        <span className="text-sm text-zinc-400">
                          (Abono: RD$ {event.deposit_amount.toLocaleString()})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(event)}>
                    <ImagePlus className="w-4 h-4 mr-1" />
                    Fotos
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(event)}>
                    <CheckSquare className="w-4 h-4 mr-1" />
                    Detalles
                  </Button>
                  <div className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Editar Evento' : 'Nuevo Evento'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título del evento</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de evento</Label>
                <Select value={formData.event_type} onValueChange={(v) => setFormData({ ...formData, event_type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <Input
                  type="time"
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Duración (minutos)</Label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={formData.client_id} onValueChange={(v) => setFormData({ ...formData, client_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client: any) => (
                      <SelectItem key={client.id} value={client.id}>{client.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Dirección</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Paquete</Label>
                <Select value={formData.package_id} onValueChange={(v) => setFormData({ ...formData, package_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sin paquete" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ninguno</SelectItem>
                    {packages?.map((pkg: any) => (
                      <SelectItem key={pkg.id} value={pkg.id}>{pkg.name} - RD$ {pkg.total_price}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quote">Cotización</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="in_progress">En progreso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monto total (RD$)</Label>
                <Input
                  type="number"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Abono (RD$)</Label>
                <Input
                  type="number"
                  value={formData.deposit_amount}
                  onChange={(e) => setFormData({ ...formData, deposit_amount: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Empleados asignados</Label>
                <div className="flex flex-wrap gap-2">
                  {employees?.map((emp: any) => (
                    <Badge
                      key={emp.id}
                      variant={formData.employees_assigned.includes(emp.id) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const newAssigned = formData.employees_assigned.includes(emp.id)
                          ? formData.employees_assigned.filter((id) => id !== emp.id)
                          : [...formData.employees_assigned, emp.id]
                        setFormData({ ...formData, employees_assigned: newAssigned })
                      }}
                    >
                      {emp.artistic_name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Servicios</Label>
                <div className="flex flex-wrap gap-2">
                  {services?.map((service: any) => (
                    <Badge
                      key={service.id}
                      variant={formData.services.includes(service.id) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const newServices = formData.services.includes(service.id)
                          ? formData.services.filter((id) => id !== service.id)
                          : [...formData.services, service.id]
                        setFormData({ ...formData, services: newServices })
                      }}
                    >
                      {service.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Notas</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-violet-600 to-orange-500 text-white">
                {editingEvent ? 'Guardar cambios' : 'Crear evento'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-zinc-500">Fecha:</span> {selectedEvent.event_date}</div>
                <div><span className="text-zinc-500">Hora:</span> {selectedEvent.event_time}</div>
                <div><span className="text-zinc-500">Cliente:</span> {selectedEvent.clients?.full_name}</div>
                <div><span className="text-zinc-500">Estado:</span> 
                  <Badge className={cn(statusConfig[selectedEvent.status as keyof typeof statusConfig]?.color, 'ml-2')}>
                    {statusConfig[selectedEvent.status as keyof typeof statusConfig]?.label}
                  </Badge>
                </div>
              </div>
              
              {selectedEvent.event_photos && selectedEvent.event_photos.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Fotos del evento</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedEvent.event_photos.map((photo: any) => (
                      <img key={photo.id} src={photo.photo_url} alt="" className="w-full h-24 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="font-medium mb-2">Subir fotos</p>
                <div className="flex gap-2">
                  {(['before', 'during', 'after'] as const).map((phase) => (
                    <label key={phase} className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handlePhotoUpload(selectedEvent.id, file, phase)
                        }}
                      />
                      <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 text-center cursor-pointer hover:border-violet-500 transition-colors">
                        <ImagePlus className="w-5 h-5 mx-auto mb-1 text-zinc-400" />
                        <span className="text-xs text-zinc-500 capitalize">{phase === 'before' ? 'Antes' : phase === 'during' ? 'Durante' : 'Después'}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
