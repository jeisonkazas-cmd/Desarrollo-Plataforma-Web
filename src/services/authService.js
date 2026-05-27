import { supabase } from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

export async function getOrCreateUserProfile() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    return { user: null, perfil: null, rol: null };
  }

  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}