export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      availability: {
        Row: {
          created_at: string
          date: string
          id: string
          note: string | null
          status: Database["public"]["Enums"]["availability_status"]
          venue_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["availability_status"]
          venue_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["availability_status"]
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          contact_phone: string
          created_at: string
          customer_id: string
          event_date: string
          event_type: string
          guest_count: number
          id: string
          message: string | null
          owner_response: string | null
          status: Database["public"]["Enums"]["enquiry_status"]
          updated_at: string
          venue_id: string
        }
        Insert: {
          contact_phone: string
          created_at?: string
          customer_id: string
          event_date: string
          event_type: string
          guest_count: number
          id?: string
          message?: string | null
          owner_response?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          updated_at?: string
          venue_id: string
        }
        Update: {
          contact_phone?: string
          created_at?: string
          customer_id?: string
          event_date?: string
          event_type?: string
          guest_count?: number
          id?: string
          message?: string | null
          owner_response?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          updated_at?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          user_id: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          venue_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          rating: number
          venue_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          rating: number
          venue_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          rating?: number
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          ac: boolean
          address: string
          amenities: string[]
          area: string | null
          base_price: number
          capacity: number
          catering_available: boolean
          catering_cost_per_plate: number | null
          city: string
          contact_email: string | null
          contact_phone: string | null
          cover_image: string | null
          created_at: string
          decoration_available: boolean
          decoration_cost: number | null
          description: string
          event_types: string[]
          gallery: string[]
          id: string
          lat: number | null
          lng: number | null
          name: string
          owner_id: string | null
          parking: boolean
          slug: string
          status: Database["public"]["Enums"]["venue_status"]
          updated_at: string
          views: number
        }
        Insert: {
          ac?: boolean
          address: string
          amenities?: string[]
          area?: string | null
          base_price: number
          capacity: number
          catering_available?: boolean
          catering_cost_per_plate?: number | null
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          cover_image?: string | null
          created_at?: string
          decoration_available?: boolean
          decoration_cost?: number | null
          description: string
          event_types?: string[]
          gallery?: string[]
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          owner_id?: string | null
          parking?: boolean
          slug: string
          status?: Database["public"]["Enums"]["venue_status"]
          updated_at?: string
          views?: number
        }
        Update: {
          ac?: boolean
          address?: string
          amenities?: string[]
          area?: string | null
          base_price?: number
          capacity?: number
          catering_available?: boolean
          catering_cost_per_plate?: number | null
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          cover_image?: string | null
          created_at?: string
          decoration_available?: boolean
          decoration_cost?: number | null
          description?: string
          event_types?: string[]
          gallery?: string[]
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          owner_id?: string | null
          parking?: boolean
          slug?: string
          status?: Database["public"]["Enums"]["venue_status"]
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "owner" | "admin"
      availability_status: "booked" | "blocked"
      enquiry_status: "pending" | "accepted" | "rejected" | "cancelled"
      venue_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<...> = any;
export type TablesUpdate<...> = any;
export type Enums<...> = any;
