import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function createUnconfiguredClient() {
  const configurationError = new Error(
    'Supabase Auth no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'
  );
  return {
    auth: {
      async getSession() {
        return { data: { session: null }, error: null };
      },
      async getUser() {
        return { data: { user: null }, error: null };
      },
      async signInWithOAuth() {
        return { data: null, error: configurationError };
      },
      async signOut() {
        return { error: null };
      },
      onAuthStateChange() {
        return { data: { subscription: { unsubscribe() {} } } };
      },
    },
  };
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createUnconfiguredClient();
