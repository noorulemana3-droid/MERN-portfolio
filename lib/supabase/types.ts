export type ContactStatus =
  | "Pending"
  | "Done"
  | "Completed"
  | "Resolved";

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
};

export type ContactInsert = {
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: ContactStatus;
};

export type ProfileRow = {
  id: string;
  email: string;
  name: string;
  role: "Admin";
  totp_secret: string | null;
  totp_enabled: boolean;
  totp_verified_at: string | null;
  created_at: string;
  updated_at: string;
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
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at" | "updated_at" | "totp_enabled"> & {
          totp_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      contact_status: ContactStatus;
      admin_role: "Admin";
    };
    CompositeTypes: Record<string, never>;
  };
};
