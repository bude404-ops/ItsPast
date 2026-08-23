export interface SupabaseRuntimeConfig { url?: string; anonKey?: string; }
export interface SupabaseUser { id: string; email?: string; }
export interface SupabaseClientPlaceholder { auth: { getUser(): Promise<{ data: { user: SupabaseUser | null } }> } }
export const supabaseConfig: SupabaseRuntimeConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
};
export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey && !String(supabaseConfig.url).includes('YOUR-PROJECT'));
export let supabase: SupabaseClientPlaceholder | null = null;
