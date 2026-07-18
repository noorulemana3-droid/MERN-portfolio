export type ContactRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

export type ContactInsert = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: ContactRow;
        Insert: ContactInsert & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ContactInsert> & {
          id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
