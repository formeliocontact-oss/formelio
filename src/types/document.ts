// Domain types for Documents
// Location: types/document.ts (following canonical pattern)

import type { Database } from './database';

export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert =
  Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate =
  Database['public']['Tables']['documents']['Update'];

export type DocumentType = Database['public']['Enums']['document_type'];

// Extended type with uploader info
export interface DocumentWithUploader extends Document {
  uploader?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

// Form input type
export type DocumentInput = Omit<
  DocumentInsert,
  'id' | 'created_at' | 'updated_at'
>;
