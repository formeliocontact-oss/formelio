// Domain types for Cases
// Location: types/case.ts (following canonical pattern)

import type { Database } from './database';

export type Case = Database['public']['Tables']['cases']['Row'];
export type CaseInsert = Database['public']['Tables']['cases']['Insert'];
export type CaseUpdate = Database['public']['Tables']['cases']['Update'];

export type CaseStatus = Database['public']['Enums']['case_status'];
export type CasePriority = Database['public']['Enums']['case_priority'];

// Extended type with relations (for UI)
export interface CaseWithRelations extends Case {
  client?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  responsible_lawyer?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  _count?: {
    documents: number;
    collaborators: number;
    activities: number;
  };
}

// Form input type
export type CaseInput = Omit<
  CaseInsert,
  'id' | 'created_at' | 'updated_at' | 'reference'
>;
