import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Sparkles,
  Building2,
  Palette,
  Receipt,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'

export default function Onboarding() {
  const navigate = useNavigate()
  const { createTenant } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    primary_color: '#7C3AED',
    secondary_color: '#F97316',
    currency: 'DOP',
    tax_rate: 0.18,
    tax_id: '',
    legal_name: '',
    address: '',
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await createTenant({
        name: formData.name,
        subdomain: formData.subdomain,
      })
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">
            Configura tu negocio
          </CardTitle>
          <p className="text-zinc-500 dark:text-zinc-400">
            Completa la información de tu compañía de eventos
          </p>
          <Progress value={progress} className="mt-4 h-2" />
          <p className="text-xs text-zinc-400 mt-1">Paso {step} de {totalSteps}</p>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-violet-600" />
                <h3 className="font-semibold text-lg">Información básica</h3>
              </div>
              <div className="space-y-2">
                <Label>Nombre del negocio</Label>
                <Input
                  placeholder="Ej: Payasos Felices RD"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Subdominio</Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="payasosfelices"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                    required
                  />
                  <span className="text-zinc-500 whitespace-nowrap">.clownpro.com</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nombre legal / RNC</Label>
                <Input
                  placeholder="Nombre fiscal registrado"
                  value={formData.legal_name}
                  onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Palette className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-lg">Personalización visual</h3>
              </div>
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
                    <Input value={formData.primary_color} onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })} />
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
                    <Input value={formData.secondary_color} onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 mt-4">
                <p className="text-sm font-medium mb-3">Vista previa</p>
                <div className="flex gap-3">
                  <div className="px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: formData.primary_color }}>
                    Primario
                  </div>
                  <div className="px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: formData.secondary_color }}>
                    Secundario
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Receipt className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-lg">Facturación</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Moneda</Label>
                  <Input value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Tasa de impuesto</Label>
                  <Input type="number" step="0.01" value={formData.tax_rate} onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>RNC / Tax ID</Label>
                <Input value={formData.tax_id} onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Dirección fiscal</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-lg">Resumen</h3>
              </div>
              <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Negocio:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subdominio:</span>
                  <span className="font-medium">{formData.subdomain}.clownpro.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Moneda:</span>
                  <span className="font-medium">{formData.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Impuesto:</span>
                  <span className="font-medium">{(formData.tax_rate * 100).toFixed(0)}%</span>
                </div>
              </div>
              <p className="text-sm text-zinc-500 text-center">
                ¿Todo listo? Haz clic en "Completar" para empezar a usar CLOWNPRO.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext} className="bg-gradient-to-r from-violet-600 to-orange-500 text-white">
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.subdomain}
                className="bg-gradient-to-r from-violet-600 to-orange-500 text-white"
              >
                {isSubmitting ? 'Creando...' : 'Completar configuración'}
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
