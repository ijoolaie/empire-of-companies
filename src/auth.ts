import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
let client: SupabaseClient | null = null;

if (url && publishableKey) {
  client = createClient(url, publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
}

export function authConfigured(): boolean { return Boolean(client); }
export async function currentEmail(): Promise<string | null> {
  if (!client) return null;
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  return data.session?.user.email ?? null;
}
export async function signIn(email: string, password: string): Promise<string | null> {
  if (!client) throw new Error('AUTH_NOT_CONFIGURED');
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return currentEmail();
}
export async function signUp(email: string, password: string) {
  if (!client) throw new Error('AUTH_NOT_CONFIGURED');
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  return { email: data.user?.email ?? email, needsConfirmation: !data.session };
}
export async function signOut(): Promise<void> {
  if (!client) return;
  const { error } = await client.auth.signOut();
  if (error) throw error;
}