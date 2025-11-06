// Generated types for Supabase schema
// DO NOT EDIT MANUALLY - Regenerate with: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'lawyer' | 'assistant' | 'client';
export type CaseStatus = 'draft' | 'active' | 'pending' | 'closed' | 'archived';
export type CasePriority = 'low' | 'medium' | 'high' | 'urgent';
export type DocumentType =
  | 'contract'
  | 'evidence'
  | 'correspondence'
  | 'pleading'
  | 'judgment'
  | 'other';

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          organization_id: string | null;
          email: string;
          first_name: string | null;
          last_name: string | null;
          role: UserRole;
          avatar_url: string | null;
          phone: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          organization_id?: string | null;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          phone?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          phone?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      cases: {
        Row: {
          id: string;
          organization_id: string;
          reference: string;
          title: string;
          description: string | null;
          status: CaseStatus;
          priority: CasePriority;
          client_id: string | null;
          responsible_lawyer_id: string | null;
          due_date: string | null;
          closed_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          reference: string;
          title: string;
          description?: string | null;
          status?: CaseStatus;
          priority?: CasePriority;
          client_id?: string | null;
          responsible_lawyer_id?: string | null;
          due_date?: string | null;
          closed_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          reference?: string;
          title?: string;
          description?: string | null;
          status?: CaseStatus;
          priority?: CasePriority;
          client_id?: string | null;
          responsible_lawyer_id?: string | null;
          due_date?: string | null;
          closed_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      case_collaborators: {
        Row: {
          id: string;
          case_id: string;
          user_id: string;
          can_edit: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          user_id: string;
          can_edit?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          user_id?: string;
          can_edit?: boolean;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          organization_id: string;
          case_id: string | null;
          name: string;
          type: DocumentType;
          file_url: string;
          file_size: number | null;
          mime_type: string | null;
          uploaded_by: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          case_id?: string | null;
          name: string;
          type?: DocumentType;
          file_url: string;
          file_size?: number | null;
          mime_type?: string | null;
          uploaded_by?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          case_id?: string | null;
          name?: string;
          type?: DocumentType;
          file_url?: string;
          file_size?: number | null;
          mime_type?: string | null;
          uploaded_by?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          organization_id: string;
          case_id: string | null;
          user_id: string | null;
          action: string;
          description: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          case_id?: string | null;
          user_id?: string | null;
          action: string;
          description?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          case_id?: string | null;
          user_id?: string | null;
          action?: string;
          description?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_case_reference: {
        Args: { org_id: string };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      case_status: CaseStatus;
      case_priority: CasePriority;
      document_type: DocumentType;
    };
  };
}
