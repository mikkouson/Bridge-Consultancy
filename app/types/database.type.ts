export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
export type Company = Database["public"]["Tables"]["companies"]["Row"];

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          contact: string | null;
          deleted_at: string | null;
          email: string | null;
          id: number;
          name: string | null;
          representative: string | null;
        };
        Insert: {
          contact?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          id?: number;
          name?: string | null;
          representative?: string | null;
        };
        Update: {
          contact?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          id?: number;
          name?: string | null;
          representative?: string | null;
        };
        Relationships: [];
      };
      invoice: {
        Row: {
          amount: number | null;
          date: string | null;
          id: number;
          invoice_number: number | null;
          subject: string | null;
          trn: number | null;
        };
        Insert: {
          amount?: number | null;
          date?: string | null;
          id?: number;
          invoice_number?: number | null;
          subject?: string | null;
          trn?: number | null;
        };
        Update: {
          amount?: number | null;
          date?: string | null;
          id?: number;
          invoice_number?: number | null;
          subject?: string | null;
          trn?: number | null;
        };
        Relationships: [];
      };
      payment_options: {
        Row: {
          account_name: string | null;
          bank_name: string | null;
          iban: string | null;
          id: number;
          payment_method: string | null;
          switf_code: string | null;
        };
        Insert: {
          account_name?: string | null;
          bank_name?: string | null;
          iban?: string | null;
          id?: number;
          payment_method?: string | null;
          switf_code?: string | null;
        };
        Update: {
          account_name?: string | null;
          bank_name?: string | null;
          iban?: string | null;
          id?: number;
          payment_method?: string | null;
          switf_code?: string | null;
        };
        Relationships: [];
      };
      services: {
        Row: {
          amount: number | null;
          id: number;
          name: string | null;
          subject: string | null;
        };
        Insert: {
          amount?: number | null;
          id?: number;
          name?: string | null;
          subject?: string | null;
        };
        Update: {
          amount?: number | null;
          id?: number;
          name?: string | null;
          subject?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
