export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      bookings: {
        Row: {
          camera_id: string;
          created_at: string;
          discount_amount: number;
          duration: number;
          end_date: string;
          final_price: number;
          id: string;
          notes: string | null;
          start_date: string;
          status: Database['public']['Enums']['booking_status'];
          total_price: number;
          user_id: string;
        };
        Insert: {
          camera_id: string;
          created_at?: string;
          discount_amount?: number;
          duration: number;
          end_date: string;
          final_price: number;
          id?: string;
          notes?: string | null;
          start_date: string;
          status?: Database['public']['Enums']['booking_status'];
          total_price: number;
          user_id: string;
        };
        Update: {
          camera_id?: string;
          created_at?: string;
          discount_amount?: number;
          duration?: number;
          end_date?: string;
          final_price?: number;
          id?: string;
          notes?: string | null;
          start_date?: string;
          status?: Database['public']['Enums']['booking_status'];
          total_price?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bookings_camera_id_fkey';
            columns: ['camera_id'];
            isOneToOne: false;
            referencedRelation: 'cameras';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      cameras: {
        Row: {
          brand: string;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          is_available: boolean;
          name: string;
          price_per_day: number;
          stock: number;
          type: string;
        };
        Insert: {
          brand: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_available?: boolean;
          name: string;
          price_per_day: number;
          stock?: number;
          type: string;
        };
        Update: {
          brand?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_available?: boolean;
          name?: string;
          price_per_day?: number;
          stock?: number;
          type?: string;
        };
        Relationships: [];
      };
      loyalty_cards: {
        Row: {
          created_at: string;
          current_count: number;
          discount_percent: number;
          id: string;
          is_active: boolean;
          max_count: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_count?: number;
          discount_percent?: number;
          id?: string;
          is_active?: boolean;
          max_count?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_count?: number;
          discount_percent?: number;
          id?: string;
          is_active?: boolean;
          max_count?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'loyalty_cards_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      loyalty_history: {
        Row: {
          booking_id: string | null;
          count_after: number;
          count_before: number;
          created_at: string;
          discount_amount: number;
          discount_applied: boolean;
          id: string;
          loyalty_card_id: string;
        };
        Insert: {
          booking_id?: string | null;
          count_after: number;
          count_before: number;
          created_at?: string;
          discount_amount?: number;
          discount_applied?: boolean;
          id?: string;
          loyalty_card_id: string;
        };
        Update: {
          booking_id?: string | null;
          count_after?: number;
          count_before?: number;
          created_at?: string;
          discount_amount?: number;
          discount_applied?: boolean;
          id?: string;
          loyalty_card_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'loyalty_history_booking_id_fkey';
            columns: ['booking_id'];
            isOneToOne: false;
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'loyalty_history_loyalty_card_id_fkey';
            columns: ['loyalty_card_id'];
            isOneToOne: false;
            referencedRelation: 'loyalty_cards';
            referencedColumns: ['id'];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          booking_id: string;
          created_at: string;
          id: string;
          method: Database['public']['Enums']['payment_method'];
          midtrans_order_id: string | null;
          midtrans_response: Json | null;
          midtrans_token: string | null;
          paid_at: string | null;
          status: Database['public']['Enums']['payment_status'];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          booking_id: string;
          created_at?: string;
          id?: string;
          method: Database['public']['Enums']['payment_method'];
          midtrans_order_id?: string | null;
          midtrans_response?: Json | null;
          midtrans_token?: string | null;
          paid_at?: string | null;
          status?: Database['public']['Enums']['payment_status'];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          booking_id?: string;
          created_at?: string;
          id?: string;
          method?: Database['public']['Enums']['payment_method'];
          midtrans_order_id?: string | null;
          midtrans_response?: Json | null;
          midtrans_token?: string | null;
          paid_at?: string | null;
          status?: Database['public']['Enums']['payment_status'];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_booking_id_fkey';
            columns: ['booking_id'];
            isOneToOne: false;
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          phone: string | null;
          role: Database['public']['Enums']['user_role'];
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          phone?: string | null;
          role?: Database['public']['Enums']['user_role'];
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          phone?: string | null;
          role?: Database['public']['Enums']['user_role'];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_booking_with_loyalty: {
        Args: {
          p_camera_id: string;
          p_start_date: string;
          p_end_date: string;
          p_duration: number;
          p_total_price: number;
        };
        Returns: {
          booking_id: string;
          final_price: number;
          discount_applied: boolean;
        }[];
      };
      is_admin: { Args: never; Returns: boolean };
      update_payment_from_webhook: {
        Args: { p_order_id: string; p_status: string; p_payload: string; p_paid_at: string };
        Returns: string | null;
      };
    };
    Enums: {
      booking_status:
        | 'pending'
        | 'confirmed'
        | 'in_progress'
        | 'returned'
        | 'completed'
        | 'cancelled';
      payment_method: 'va_bca' | 'va_mandiri' | 'va_bni' | 'qris' | 'gopay' | 'shopeepay';
      payment_status: 'pending' | 'paid' | 'failed' | 'expired';
      user_role: 'user' | 'admin';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      booking_status: ['pending', 'confirmed', 'in_progress', 'returned', 'completed', 'cancelled'],
      payment_method: ['va_bca', 'va_mandiri', 'va_bni', 'qris', 'gopay', 'shopeepay'],
      payment_status: ['pending', 'paid', 'failed', 'expired'],
      user_role: ['user', 'admin'],
    },
  },
} as const;
