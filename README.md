# CLOWNPRO - Sistema de Gestión para Compañía de Payasos y Eventos

SaaS multi-tenant moderno para gestión de eventos infantiles, payasos, animadores y servicios de entretenimiento.

## Stack Tecnológico

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Estado**: Zustand + TanStack Query
- **Formularios**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Notificaciones**: Sonner

## Módulos Implementados

1. **Auth & Onboarding** - Login/Register con Supabase Auth, wizard de configuración inicial del negocio
2. **Dashboard** - KPIs, eventos de hoy, próximos eventos, transacciones recientes
3. **Gestión de Eventos** - CRUD completo con estados (Cotización → Confirmado → En progreso → Completado → Cancelado), fotos, checklist
4. **Catálogo de Servicios** - Servicios con precios y paquetes con descuento
5. **Directorio de Clientes** - CRUD con tags, historial y búsqueda
6. **Empleados/Payasos** - Perfiles artísticos, especialidades, disponibilidad, rating
7. **Finanzas** - Ingresos/gastos, gráficos de tendencias, balance
8. **Inventario** - Props, disfraces, maquillaje, alertas de stock bajo
9. **Cotizador Público** - Landing page con formulario de cotización para clientes potenciales
10. **Configuración** - Datos fiscales, branding, colores, notificaciones

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/tuusuario/clownpro.git
cd clownpro

# Instalar dependencias
npm install

# Configurar variables de entorno (copiar .env.example a .env.local)
cp .env.example .env.local

# Editar .env.local con tus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

## Configuración de Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar el schema SQL en el SQL Editor (ver `supabase/schema.sql`)
3. Configurar Storage buckets: `event-photos`, `tenant-logos`
4. Configurar Auth providers (Email/Password)
5. Copiar URL y Anon Key al `.env.local`

## Variables de Entorno

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

## Scripts

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Previsualizar build

## Arquitectura Multi-Tenant

- Tenant por `subdomain` o `tenant_id` en tablas
- Row Level Security (RLS) en todas las tablas
- Roles: super_admin, admin, employee, client
- Cada negocio tiene su propia configuración, colores y branding

## Características Adicionales

- Dark mode / Light mode
- Responsive (mobile-first)
- Notificaciones toast (Sonner)
- Gráficos de finanzas (Recharts)
- Subida de fotos de eventos
- Cotizador público con cálculo automático

## Licencia

MIT
