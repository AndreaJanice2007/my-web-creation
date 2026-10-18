export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      delivery_zones: {
        Row: {
          active: boolean
          fee: number
          id: string
          name: string
          pins: string[]
        }
        Insert: {
          active?: boolean
          fee?: number
          id?: string
          name: string
          pins?: string[]
        }
        Update: {
          active?: boolean
          fee?: number
          id?: string
          name?: string
          pins?: string[]
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          line_total: number
          name: string
          options: Json
          order_id: string
          product_id: string | null
          qty: number
          unit_price: number
          variant: string
        }
        Insert: {
          id?: string
          line_total: number
          name: string
          options?: Json
          order_id: string
          product_id?: string | null
          qty: number
          unit_price: number
          variant: string
        }
        Update: {
          id?: string
          line_total?: number
          name?: string
          options?: Json
          order_id?: string
          product_id?: string | null
          qty?: number
          unit_price?: number
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string | null
          created_at: string
          customer_name: string
          delivery_fee: number
          email: string | null
          fulfilment: string
          id: string
          notes: string | null
          order_number: string
          payment_method: string
          payment_status: string
          phone: string
          pincode: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          scheduled_date: string
          slot: string
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          customer_name: string
          delivery_fee?: number
          email?: string | null
          fulfilment: string
          id?: string
          notes?: string | null
          order_number: string
          payment_method: string
          payment_status?: string
          phone: string
          pincode?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          scheduled_date: string
          slot: string
          status?: string
          subtotal: number
          total: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          customer_name?: string
          delivery_fee?: number
          email?: string | null
          fulfilment?: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string
          payment_status?: string
          phone?: string
          pincode?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          scheduled_date?: string
          slot?: string
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pickup_slots: {
        Row: {
          active: boolean
          id: string
          label: string
          sort: number
        }
        Insert: {
          active?: boolean
          id?: string
          label: string
          sort?: number
        }
        Update: {
          active?: boolean
          id?: string
          label?: string
          sort?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          addons: Json
          allergens: string
          allows_gift_note: boolean
          allows_message: boolean
          badge: string | null
          category: string
          created_at: string
          description: string
          featured: boolean
          flavours: string[] | null
          id: string
          image_url: string
          ingredients: string
          is_active: boolean
          max_qty: number
          min_qty: number
          name: string
          prep_hours: number
          rating: number
          reviews: number
          short: string
          slug: string
          sort: number
          stock: number
          unit: string
          variants: Json
        }
        Insert: {
          addons?: Json
          allergens?: string
          allows_gift_note?: boolean
          allows_message?: boolean
          badge?: string | null
          category: string
          created_at?: string
          description?: string
          featured?: boolean
          flavours?: string[] | null
          id?: string
          image_url?: string
          ingredients?: string
          is_active?: boolean
          max_qty?: number
          min_qty?: number
          name: string
          prep_hours?: number
          rating?: number
          reviews?: number
          short?: string
          slug: string
          sort?: number
          stock?: number
          unit?: string
          variants?: Json
        }
        Update: {
          addons?: Json
          allergens?: string
          allows_gift_note?: boolean
          allows_message?: boolean
          badge?: string | null
          category?: string
          created_at?: string
          description?: string
          featured?: boolean
          flavours?: string[] | null
          id?: string
          image_url?: string
          ingredients?: string
          is_active?: boolean
          max_qty?: number
          min_qty?: number
          name?: string
          prep_hours?: number
          rating?: number
          reviews?: number
          short?: string
          slug?: string
          sort?: number
          stock?: number
          unit?: string
          variants?: Json
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          announcement: string | null
          blackout_dates: string[]
          booking_window_days: number
          cod_max_order: number
          email: string | null
          free_delivery_over: number
          hours: string | null
          id: number
          lead_days: number
          min_order: number
          phone: string | null
          pickup_address: string | null
          service_area: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          announcement?: string | null
          blackout_dates?: string[]
          booking_window_days?: number
          cod_max_order?: number
          email?: string | null
          free_delivery_over?: number
          hours?: string | null
          id?: number
          lead_days?: number
          min_order?: number
          phone?: string | null
          pickup_address?: string | null
          service_area?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          announcement?: string | null
          blackout_dates?: string[]
          booking_window_days?: number
          cod_max_order?: number
          email?: string | null
          free_delivery_over?: number
          hours?: string | null
          id?: number
          lead_days?: number
          min_order?: number
          phone?: string | null
          pickup_address?: string | null
          service_area?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "user"],
    },
  },
} as const
