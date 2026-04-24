-- CLOWNPRO - Schema completo para Supabase PostgreSQL
-- Ejecutar este script en el SQL Editor de Supabase

-- ============================================
-- EXTENSIONES
-- ============================================
extension if not exists "uuid-ossp";

-- ============================================
-- TABLAS
-- ============================================

-- Tenants (negocios)
create table if not exists tenants (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  subdomain text unique not null,
  logo_url text,
  primary_color text default '#7C3AED',
  secondary_color text default '#F97316',
  currency text default 'DOP',
  tax_rate decimal(5,4) default 0.18,
  tax_id text,
  legal_name text,
  address text,
  phone text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Users (perfiles extendidos de auth.users)
create table if not exists users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'admin' check (role in ('super_admin', 'admin', 'employee', 'client')),
  tenant_id uuid references tenants(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Clients (directorio de clientes)
create table if not exists clients (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid not null references tenants(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  address text,
  notes text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Services (catálogo de servicios)
create table if not exists services (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  description text,
  base_price decimal(10,2) not null default 0,
  duration_minutes integer not null default 60,
  category text not null default 'Otro',
  image_url text,
  availability text[] default '{}',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Packages (paquetes de servicios)
create table if not exists packages (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  description text,
  services uuid[] default '{}',
  discount_percentage decimal(5,2) default 0,
  total_price decimal(10,2) not null default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Employees (payasos/animadores)
create table if not exists employees (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  artistic_name text not null,
  specialties text[] default '{}',
  availability jsonb default '{}',
  rating decimal(2,1) default 5.0,
  documents jsonb default '{}',
  payment_type text default 'per_event' check (payment_type in ('per_event', 'biweekly')),
  payment_amount decimal(10,2) default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Events (eventos)
create table if not exists events (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid not null references tenants(id) on delete cascade,
  title text not null,
  event_type text not null default 'Cumpleaños',
  event_date date not null,
  event_time time not null,
  duration_minutes integer not null default 120,
  address text not null,
  latitude decimal(10,8),
  longitude decimal(11,8),
  client_id uuid not null references clients(id) on delete restrict,
  package_id uuid references packages(id) on delete set null,
  services uuid[] default '{}',
  employees_assigned uuid[] default '{}',
  status text default 'quote' check (status in ('quote', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  total_amount decimal(10,2) default 0,
  deposit_amount decimal(10,2) default 0,
  balance_due decimal(10,2) generated always as (total_amount - deposit_amount) stored,
  notes text,
  checklist jsonb default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Event Photos
create table if not exists event_photos (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid not null references events(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  photo_url text not null,
  phase text default 'during' check (phase in ('before', 'during', 'after')),
  uploaded_at timestamp with time zone default timezone('utc'::text, now())
);

-- Inventory (equipo/props)
create table if not exists inventories (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  category text not null default 'Props',
  description text,
  quantity integer not null default 1,
  status text default 'available' check (status in ('available', 'in_use', 'maintenance', 'damaged')),
  assigned_event_id uuid references events(id) on delete set null,
  alert_threshold integer default 2,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Transactions (finanzas)
create table if not exists transactions (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid not null references tenants(id) on delete cascade,
  event_id uuid references events(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  amount decimal(10,2) not null default 0,
  payment_method text default 'Efectivo',
  description text,
  transaction_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Contracts
create table if not exists contracts (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid not null references tenants(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  template_id uuid,
  content text not null,
  signed_by_client boolean default false,
  signed_at timestamp with time zone,
  pdf_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Quotation Requests (cotizaciones públicas)
create table if not exists quotation_requests (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid not null references tenants(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  event_type text not null,
  event_date date,
  children_count integer default 15,
  location text not null,
  services_requested text[] default '{}',
  estimated_total decimal(10,2) default 0,
  status text default 'pending' check (status in ('pending', 'responded', 'converted')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Aplicar trigger a tablas con updated_at
create trigger update_tenants_updated_at before update on tenants for each row execute function update_updated_at_column();
create trigger update_users_updated_at before update on users for each row execute function update_updated_at_column();
create trigger update_clients_updated_at before update on clients for each row execute function update_updated_at_column();
create trigger update_services_updated_at before update on services for each row execute function update_updated_at_column();
create trigger update_packages_updated_at before update on packages for each row execute function update_updated_at_column();
create trigger update_employees_updated_at before update on employees for each row execute function update_updated_at_column();
create trigger update_events_updated_at before update on events for each row execute function update_updated_at_column();
create trigger update_inventories_updated_at before update on inventories for each row execute function update_updated_at_column();

-- Auto-crear perfil de usuario después de signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'admin');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table tenants enable row level security;
alter table users enable row level security;
alter table clients enable row level security;
alter table services enable row level security;
alter table packages enable row level security;
alter table employees enable row level security;
alter table events enable row level security;
alter table event_photos enable row level security;
alter table inventories enable row level security;
alter table transactions enable row level security;
alter table contracts enable row level security;
alter table quotation_requests enable row level security;

-- Políticas Tenants
CREATE POLICY "Allow select tenants" ON tenants FOR SELECT USING (true);
CREATE POLICY "Allow insert tenants" ON tenants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update own tenant" ON tenants FOR UPDATE USING (id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));

-- Políticas Users
CREATE POLICY "Allow select users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow update own user" ON users FOR UPDATE USING (id = auth.uid());

-- Políticas Clients
CREATE POLICY "Allow select clients" ON clients FOR SELECT USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow insert clients" ON clients FOR INSERT WITH CHECK (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow update clients" ON clients FOR UPDATE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow delete clients" ON clients FOR DELETE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));

-- Políticas Services
CREATE POLICY "Allow select services" ON services FOR SELECT USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow insert services" ON services FOR INSERT WITH CHECK (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow update services" ON services FOR UPDATE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow delete services" ON services FOR DELETE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));

-- Políticas Packages
CREATE POLICY "Allow select packages" ON packages FOR SELECT USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow insert packages" ON packages FOR INSERT WITH CHECK (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow update packages" ON packages FOR UPDATE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow delete packages" ON packages FOR DELETE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));

-- Políticas Employees
CREATE POLICY "Allow select employees" ON employees FOR SELECT USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow insert employees" ON employees FOR INSERT WITH CHECK (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow update employees" ON employees FOR UPDATE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow delete employees" ON employees FOR DELETE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));

-- Políticas Events
CREATE POLICY "Allow select events" ON events FOR SELECT USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow insert events" ON events FOR INSERT WITH CHECK (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow update events" ON events FOR UPDATE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow delete events" ON events FOR DELETE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));

-- Políticas Event Photos
CREATE POLICY "Allow select event photos" ON event_photos FOR SELECT USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow insert event photos" ON event_photos FOR INSERT WITH CHECK (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow delete event photos" ON event_photos FOR DELETE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));

-- Políticas Inventory
CREATE POLICY "Allow select inventory" ON inventories FOR SELECT USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow insert inventory" ON inventories FOR INSERT WITH CHECK (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow update inventory" ON inventories FOR UPDATE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow delete inventory" ON inventories FOR DELETE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));

-- Políticas Transactions
CREATE POLICY "Allow select transactions" ON transactions FOR SELECT USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow insert transactions" ON transactions FOR INSERT WITH CHECK (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow update transactions" ON transactions FOR UPDATE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow delete transactions" ON transactions FOR DELETE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));

-- Políticas Contracts
CREATE POLICY "Allow select contracts" ON contracts FOR SELECT USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow insert contracts" ON contracts FOR INSERT WITH CHECK (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow update contracts" ON contracts FOR UPDATE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));

-- Políticas Quotation Requests (públicas)
CREATE POLICY "Allow select quotation requests" ON quotation_requests FOR SELECT USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));
CREATE POLICY "Allow insert quotation requests" ON quotation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update quotation requests" ON quotation_requests FOR UPDATE USING (tenant_id IN (
  SELECT tenant_id FROM users WHERE id = auth.uid()
));

-- ============================================
-- ÍNDICES
-- ============================================
create index if not exists idx_clients_tenant on clients(tenant_id);
create index if not exists idx_services_tenant on services(tenant_id);
create index if not exists idx_packages_tenant on packages(tenant_id);
create index if not exists idx_employees_tenant on employees(tenant_id);
create index if not exists idx_events_tenant on events(tenant_id);
create index if not exists idx_events_date on events(event_date);
create index if not exists idx_events_status on events(status);
create index if not exists idx_event_photos_event on event_photos(event_id);
create index if not exists idx_inventories_tenant on inventories(tenant_id);
create index if not exists idx_transactions_tenant on transactions(tenant_id);
create index if not exists idx_transactions_date on transactions(transaction_date);
create index if not exists idx_contracts_event on contracts(event_id);
create index if not exists idx_quotation_requests_tenant on quotation_requests(tenant_id);
