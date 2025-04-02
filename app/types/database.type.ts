export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];

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
      invoice_services: {
        Row: {
          id: number;
          invoice_id: number;
          service_date: string;
          service_id: number;
        };
        Insert: {
          id?: number;
          invoice_id: number;
          service_date: string;
          service_id: number;
        };
        Update: {
          id?: number;
          invoice_id?: number;
          service_date?: string;
          service_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_services_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoice_services_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };
      invoices: {
        Row: {
          companies: any;
          company: number;
          created_at: string;
          date: string;
          deleted_at: string | null;
          id: number;
          invoice_number: string;
          payment_option: number;
          total_amount: number;
          vat: number;
        };
        Insert: {
          company: number;
          created_at?: string;
          date: string;
          deleted_at?: string | null;
          id?: number;
          invoice_number: string;
          payment_option: number;
          total_amount?: number;
          vat?: number;
        };
        Update: {
          company?: number;
          created_at?: string;
          date?: string;
          deleted_at?: string | null;
          id?: number;
          invoice_number?: string;
          payment_option?: number;
          total_amount?: number;
          vat?: number;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_company_fkey";
            columns: ["company"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_payment_option_fkey";
            columns: ["payment_option"];
            isOneToOne: false;
            referencedRelation: "payment_options";
            referencedColumns: ["id"];
          }
        ];
      };
      payment_options: {
        Row: {
          account_name: string | null;
          bank_address: string | null;
          bank_name: string | null;
          deleted_at: string | null;
          iban: string | null;
          id: number;
          swift_code: string | null;
        };
        Insert: {
          account_name?: string | null;
          bank_address?: string | null;
          bank_name?: string | null;
          deleted_at?: string | null;
          iban?: string | null;
          id?: number;
          swift_code?: string | null;
        };
        Update: {
          account_name?: string | null;
          bank_address?: string | null;
          bank_name?: string | null;
          deleted_at?: string | null;
          iban?: string | null;
          id?: number;
          swift_code?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          email: string | null;
          fullname: string | null;
          id: string;
          name: string | null;
          role: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email?: string | null;
          fullname?: string | null;
          id: string;
          name?: string | null;
          role?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string | null;
          fullname?: string | null;
          id?: string;
          name?: string | null;
          role?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      services: {
        Row: {
          amount: number | null;
          deleted_at: string | null;
          description: string | null;
          id: number;
          name: string | null;
        };
        Insert: {
          amount?: number | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: number;
          name?: string | null;
        };
        Update: {
          amount?: number | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_user_exists: {
        Args: {
          email: string;
        };
        Returns: {
          user_id: string;
        }[];
      };
      get_all_user_emails: {
        Args: Record<PropertyKey, never>;
        Returns: {
          email: string;
        }[];
      };
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
