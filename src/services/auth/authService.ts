import { isSupabaseConfigured, supabase } from '../../lib/supabase';

export interface AuthUser { id: string; email?: string; role: 'user' | 'admin'; }
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured || !supabase) return { id: 'demo-user', email: 'demo@itspast.local', role: 'user' };
  const { data } = await supabase.auth.getUser();
  return data.user ? { id: data.user.id, email: data.user.email, role: 'user' } : null;
}
