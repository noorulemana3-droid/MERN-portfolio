export type ContactRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "Pending" | "Reviewed" | "Resolved";
  created_at: string;
  updated_at: string;
};

export type ContactInsert = {
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: "Pending" | "Reviewed" | "Resolved";
};

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: ContactRow;
        Insert: ContactInsert & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ContactInsert> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      contact_status: "Pending" | "Reviewed" | "Resolved";
    };
    CompositeTypes: Record<string, never>;
  };
};
