import { useState } from 'react'
import { useSettings } from '@/hooks/useSettings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Building2,
  Palette,
  Receipt,
  Bell,
  Upload,
  Save,
  Sparkles,
} from 'lucide-react'

export default function Settings() {
  const { settings, updateSettings, uploadLogo } = useSettings()
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: settings?.name || '',
    legal_name: settings?.legal_name || '',
    tax_id: settings?.tax_id || '',
    address: settings?.address || '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    primary_color: settings?.primary_color || '#7C3AED',
    secondary_color: settings?.secondary_color || '#F97316',
    currency: settings?.currency || 'DOP',
    tax_rate: settings?.tax_rate || 0.18,
  })

  const handleSave = async () => {
    setIsSaving(true)
    await updateSettings(formData)
    setIsSaving(false)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await uploadLogo(file)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Configuración</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Gestiona tu negocio y preferencias</p>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit">
          <TabsTrigger value="business"><Building2 className="w-4 h-4 mr-2" />Negocio</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="w-4 h-4 mr-2" />Apariencia</TabsTrigger>
          <TabsTrigger value="billing"><Receipt className="w-4 h-4 mr-2" />Facturación</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" />Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-violet-600" />
                Datos del negocio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                  {settings?.logo_url ? (
                    <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Sparkles className="w-8 h-8 text-zinc-400" />
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Logo del negocio</Label>
                  <p className="text-xs text-zinc-500 mb-2">Formato: PNG/JPG, máx 2MB</p>
                  <Label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      Subir logo
                    </div>
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del negocio</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Nombre legal / RNC</Label>
                  <Input value={formData.legal_name} onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email de contacto</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Dirección fiscal</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-orange-600" />
                Personalización
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Color primario</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <Input value={formData.primary_color} onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })} className="w-28" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Color secundario</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <Input value={formData.secondary_color} onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })} className="w-28" />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <p className="text-sm font-medium mb-3">Vista previa</p>
                <div className="flex gap-3">
                  <div className="px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: formData.primary_color }}>
                    Botón primario
                  </div>
                  <div className="px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: formData.secondary_color }}>
                    Botón secundario
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="w-5 h-5 text-green-600" />
                Facturación e impuestos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Moneda</Label>
                  <Input value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Tasa de impuesto (ITBIS/IVA)</Label>
                  <Input type="number" step="0.01" value={formData.tax_rate} onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>RNC / Tax ID</Label>
                <Input value={formData.tax_id} onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="font-medium">Recordatorios de eventos</p>
                  <p className="text-sm text-zinc-500">24h y 2h antes del evento</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="font-medium">Nuevas cotizaciones</p>
                  <p className="text-sm text-zinc-500">Notificar cuando llegue una cotización</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Alertas de inventario</p>
                  <p className="text-sm text-zinc-500">Cuando un item tenga stock bajo</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-violet-600 to-orange-500 text-white">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
