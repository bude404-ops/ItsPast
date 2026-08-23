import { isSupabaseConfigured, supabase, type SupabaseClientPlaceholder } from '../../lib/supabase';

export interface AuthUser { id: string; email?: string; role: 'user' | 'admin'; }
export async function getCurrentUser(): Promise<AuthUser | null> {
  const client: SupabaseClientPlaceholder | null = supabase;
  if (!isSupabaseConfigured || !client) return { id: 'demo-user', email: 'demo@itspast.local', role: 'user' };
  const { data } = await client.auth.getUser();
  return data.user ? { id: data.user.id, email: data.user.email, role: 'user' } : null;
}
