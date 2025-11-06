// Domain types for Profiles
// Location: types/profile.ts (following canonical pattern)

import type { Database } from './database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type UserRole = Database['public']['Enums']['user_role'];

// Extended type with organization
export interface ProfileWithOrganization extends Profile {
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
}

// Form input type
export type ProfileInput = Omit<
  ProfileInsert,
  'id' | 'created_at' | 'updated_at'
>;
