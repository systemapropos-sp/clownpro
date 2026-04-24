import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create a mock client if credentials are missing (for demo/build purposes)
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Using mock client.')
    return createClient('http://localhost:54321', 'mock-key')
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

export type Database = {
  public: {
    tables: {
      tenants: {
        Row: {
          id: string
          name: string
          subdomain: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          currency: string
          tax_rate: number
          tax_id: string | null
          legal_name: string | null
          address: string | null
          phone: string | null
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['tables']['tenants']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['tables']['tenants']['Insert']>
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'super_admin' | 'admin' | 'employee' | 'client'
          tenant_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['tables']['users']['Insert']>
      }
      clients: {
        Row: {
          id: string
          tenant_id: string
          full_name: string
          phone: string
          email: string | null
          address: string | null
          notes: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['tables']['clients']['Insert']>
      }
      services: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          base_price: number
          duration_minutes: number
          category: string
          image_url: string | null
          availability: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['tables']['services']['Insert']>
      }
      packages: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          services: string[]
          discount_percentage: number
          total_price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['tables']['packages']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['tables']['packages']['Insert']>
      }
      employees: {
        Row: {
          id: string
          tenant_id: string
          user_id: string | null
          artistic_name: string
          specialties: string[]
          availability: Record<string, any>
          rating: number
          documents: Record<string, any>
          payment_type: 'per_event' | 'biweekly'
          payment_amount: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['tables']['employees']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['tables']['employees']['Insert']>
      }
      events: {
        Row: {
          id: string
          tenant_id: string
          title: string
          event_type: string
          event_date: string
          event_time: string
          duration_minutes: number
          address: string
          latitude: number | null
          longitude: number | null
          client_id: string
          package_id: string | null
          services: string[]
          employees_assigned: string[]
          status: 'quote' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          total_amount: number
          deposit_amount: number
          balance_due: number
          notes: string | null
          checklist: Record<string, any>[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['tables']['events']['Insert']>
      }
      event_photos: {
        Row: {
          id: string
          event_id: string
          tenant_id: string
          photo_url: string
          phase: 'before' | 'during' | 'after'
          uploaded_at: string
        }
        Insert: Omit<Database['public']['tables']['event_photos']['Row'], 'id' | 'uploaded_at'>
        Update: Partial<Database['public']['tables']['event_photos']['Insert']>
      }
      inventories: {
        Row: {
          id: string
          tenant_id: string
          name: string
          category: string
          description: string | null
          quantity: number
          status: 'available' | 'in_use' | 'maintenance' | 'damaged'
          assigned_event_id: string | null
          alert_threshold: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['tables']['inventories']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['tables']['inventories']['Insert']>
      }
      transactions: {
        Row: {
          id: string
          tenant_id: string
          event_id: string | null
          type: 'income' | 'expense'
          category: string
          amount: number
          payment_method: string
          description: string | null
          transaction_date: string
          created_at: string
        }
        Insert: Omit<Database['public']['tables']['transactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['tables']['transactions']['Insert']>
      }
      contracts: {
        Row: {
          id: string
          tenant_id: string
          event_id: string
          template_id: string | null
          content: string
          signed_by_client: boolean
          signed_at: string | null
          pdf_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['tables']['contracts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['tables']['contracts']['Insert']>
      }
      quotation_requests: {
        Row: {
          id: string
          tenant_id: string
          full_name: string
          phone: string
          email: string | null
          event_type: string
          event_date: string
          children_count: number
          location: string
          services_requested: string[]
          estimated_total: number
          status: 'pending' | 'responded' | 'converted'
          created_at: string
        }
        Insert: Omit<Database['public']['tables']['quotation_requests']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['tables']['quotation_requests']['Insert']>
      }
    }
  }
}
