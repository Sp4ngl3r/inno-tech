export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          age: number;
          gender: "male" | "female" | "other";
          mobile: string;
          email: string;
          educational_institution: string;
          current_year_of_study: string;
          field_of_study: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["users"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
    };
  };
}

export interface SupabaseError {
  code?: string;
  details: string;
  hint?: string;
  message: string;
}
