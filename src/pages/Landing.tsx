import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  Sparkles,
  PartyPopper,
  Camera,
  Star,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Menu,
  X,
  CalendarDays,
  Users,
  Wand2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const eventTypes = ['Cumpleaños', 'Bautizo', 'Baby shower', 'Escuela', 'Corporativo', 'Otro']
const demoServices = [
  { name: 'Payasos', price: 3500, icon: PartyPopper },
  { name: 'Magos', price: 4000, icon: Wand2 },
  { name: 'Pintacaritas', price: 2500, icon: Sparkles },
  { name: 'Inflables', price: 5500, icon: PartyPopper },
  { name: 'DJ', price: 6000, icon: PartyPopper },
  { name: 'Animadores', price: 3000, icon: Users },
]

const testimonials = [
  { name: 'María G.', text: 'Los payasos fueron espectaculares. Mis hijos no pararon de reír. ¡100% recomendado!', rating: 5 },
  { name: 'Carlos R.', text: 'Excelente servicio, muy profesionales y puntuales. La fiesta de mi hija fue un éxito.', rating: 5 },
  { name: 'Ana L.', text: 'Contraté el paquete completo y todo salió perfecto. Gracias CLOWNPRO!', rating: 5 },
]

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteSent, setQuoteSent] = useState(false)
  const [quoteForm, setQuoteForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    event_type: 'Cumpleaños',
    event_date: '',
    children_count: 15,
    location: '',
    services: [] as string[],
  })

  const estimatedTotal = quoteForm.services.reduce((sum, serviceName) => {
    const service = demoServices.find((s) => s.name === serviceName)
    return sum + (service?.price || 0)
  }, 0)

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('quotation_requests').insert({
        ...quoteForm,
        estimated_total: estimatedTotal,
        tenant_id: 'demo',
      })
      if (error) throw error
      setQuoteSent(true)
      toast.success('Cotización enviada. Te contactaremos pronto.')
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar cotización')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">
                CLOWNPRO
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#servicios" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Servicios</a>
              <a href="#galeria" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Galería</a>
              <a href="#testimonios" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Testimonios</a>
              <Link to="/login">
                <Button variant="ghost" size="sm">Acceder</Button>
              </Link>
              <Button size="sm" className="bg-gradient-to-r from-violet-600 to-orange-500 text-white" onClick={() => setQuoteOpen(true)}>
                Cotizar ahora
              </Button>
            </nav>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
            <a href="#servicios" className="block text-zinc-600 dark:text-zinc-400">Servicios</a>
            <a href="#galeria" className="block text-zinc-600 dark:text-zinc-400">Galería</a>
            <a href="#testimonios" className="block text-zinc-600 dark:text-zinc-400">Testimonios</a>
            <Link to="/login" className="block text-violet-600">Acceder</Link>
            <Button className="w-full bg-gradient-to-r from-violet-600 to-orange-500 text-white" onClick={() => { setQuoteOpen(true); setMobileMenuOpen(false); }}>
              Cotizar ahora
            </Button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 hover:bg-violet-100">
            🎉 La mejor diversión para tus eventos infantiles
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
            Hacemos de tu evento una{' '}
            <span className="bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">
              fiesta inolvidable
            </span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            Payasos, magos, pintacaritas, inflables y más. Servicio profesional para cumpleaños, bautizos, baby showers y eventos corporativos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-700 hover:to-orange-600 text-white px-8" onClick={() => setQuoteOpen(true)}>
              <Send className="w-5 h-5 mr-2" />
              Cotiza tu evento
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              <Phone className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Nuestros Servicios</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Todo lo que necesitas para una fiesta perfecta</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoServices.map((service) => (
              <Card key={service.name} className="border-0 shadow-sm hover:shadow-md transition-shadow group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                    Profesionales especializados en animación infantil para todo tipo de eventos.
                  </p>
                  <p className="text-lg font-bold text-violet-600">Desde RD$ {service.price.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="galeria" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Galería de Eventos</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Momentos mágicos que hemos creado</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-violet-100 to-orange-100 dark:from-violet-900/20 dark:to-orange-900/20 flex items-center justify-center">
                <Camera className="w-8 h-8 text-zinc-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Testimonios</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Lo que dicen nuestros clientes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 mb-4">"{t.text}"</p>
                  <p className="font-semibold text-sm text-zinc-900 dark:text-white">— {t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            ¿Listo para la mejor fiesta?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            Cotiza ahora y recibe una respuesta en menos de 24 horas
          </p>
          <Button size="lg" className="bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-700 hover:to-orange-600 text-white px-8" onClick={() => setQuoteOpen(true)}>
            <CalendarDays className="w-5 h-5 mr-2" />
            Cotizar mi evento
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-violet-400" />
                <span className="font-bold text-xl text-white">CLOWNPRO</span>
              </div>
              <p className="text-sm">Sistema profesional de gestión para compañías de payasos y eventos infantiles.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contacto</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (809) 555-0123</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@clownpro.com</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Santo Domingo, RD</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Links</h4>
              <div className="space-y-2 text-sm">
                <Link to="/login" className="block hover:text-violet-400 transition-colors">Iniciar sesión</Link>
                <Link to="/register" className="block hover:text-violet-400 transition-colors">Crear cuenta</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-sm">
            © 2024 CLOWNPRO. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Quote Dialog */}
      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-violet-600" />
              Cotiza tu evento
            </DialogTitle>
          </DialogHeader>

          {quoteSent ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">¡Cotización enviada!</h3>
              <p className="text-zinc-500 mb-4">Te contactaremos en menos de 24 horas.</p>
              <Button onClick={() => { setQuoteSent(false); setQuoteOpen(false); }}>Cerrar</Button>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre completo</Label>
                  <Input value={quoteForm.full_name} onChange={(e) => setQuoteForm({ ...quoteForm, full_name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input value={quoteForm.phone} onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={quoteForm.email} onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de evento</Label>
                  <Select value={quoteForm.event_type} onValueChange={(v) => setQuoteForm({ ...quoteForm, event_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fecha del evento</Label>
                  <Input type="date" value={quoteForm.event_date} onChange={(e) => setQuoteForm({ ...quoteForm, event_date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Cantidad de niños</Label>
                  <Input type="number" value={quoteForm.children_count} onChange={(e) => setQuoteForm({ ...quoteForm, children_count: parseInt(e.target.value) })} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Ubicación</Label>
                  <Input value={quoteForm.location} onChange={(e) => setQuoteForm({ ...quoteForm, location: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Servicios deseados</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {demoServices.map((service) => (
                    <div
                      key={service.name}
                      onClick={() => {
                        const newServices = quoteForm.services.includes(service.name)
                          ? quoteForm.services.filter((s) => s !== service.name)
                          : [...quoteForm.services, service.name]
                        setQuoteForm({ ...quoteForm, services: newServices })
                      }}
                      className={cn(
                        'p-3 rounded-lg border-2 cursor-pointer transition-all text-center',
                        quoteForm.services.includes(service.name)
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-violet-300'
                      )}
                    >
                      <service.icon className="w-5 h-5 mx-auto mb-1 text-violet-600" />
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-zinc-500">RD$ {service.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {estimatedTotal > 0 && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-orange-50 dark:from-violet-900/20 dark:to-orange-900/20">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total estimado:</span>
                    <span className="text-2xl font-bold text-violet-600">RD$ {estimatedTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-orange-500 text-white h-11">
                <Send className="w-4 h-4 mr-2" />
                Enviar cotización
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
