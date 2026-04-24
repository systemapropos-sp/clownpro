import { useState } from 'react'
import { useClients } from '@/hooks/useClients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MapPin,
  User,
  Tag,
} from 'lucide-react'

export default function Clients() {
  const { clients, isLoading, createClient, updateClient, deleteClient } = useClients()
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [newTag, setNewTag] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    tags: [] as string[],
  })

  const filteredClients = clients?.filter((client: any) => {
    const matchesSearch = client.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      client.phone?.includes(search) ||
      client.email?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  }) || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingClient) {
      await updateClient({ id: editingClient.id, ...formData })
      setEditingClient(null)
    } else {
      await createClient(formData)
    }
    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({ full_name: '', phone: '', email: '', address: '', notes: '', tags: [] })
    setNewTag('')
  }

  const handleEdit = (client: any) => {
    setEditingClient(client)
    setFormData({
      full_name: client.full_name,
      phone: client.phone,
      email: client.email || '',
      address: client.address || '',
      notes: client.notes || '',
      tags: client.tags || [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este cliente?')) await deleteClient(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Directorio de Clientes</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Gestiona tus clientes y su historial</p>
        </div>
        <Button
          onClick={() => { setEditingClient(null); resetForm(); setIsDialogOpen(true); }}
          className="bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-700 hover:to-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          placeholder="Buscar por nombre, teléfono o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
        </div>
      ) : filteredClients.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16">
            <User className="w-16 h-16 mx-auto mb-4 text-zinc-300" />
            <p className="text-zinc-500 text-lg">No hay clientes registrados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client: any) => (
            <Card key={client.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center text-white font-bold">
                      {client.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white">{client.full_name}</h3>
                      {client.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] mr-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span>{client.phone}</span>
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(client)}>
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <div className="flex-1" />
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(client.id)}>
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
            <DialogTitle>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre completo</Label>
              <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} className="cursor-pointer" onClick={() => setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Nuevo tag (VIP, frecuente...)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTag.trim()) {
                      e.preventDefault()
                      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
                      setNewTag('')
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newTag.trim()) {
                      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
                      setNewTag('')
                    }
                  }}
                >
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notas internas</Label>
              <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-gradient-to-r from-violet-600 to-orange-500 text-white">
                {editingClient ? 'Guardar' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
