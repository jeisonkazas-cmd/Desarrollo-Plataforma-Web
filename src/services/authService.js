import { supabase } from './supabaseClient';

const API_BASE = import.meta.env.VITE_API_URL;

async function fetchProfileFromBackend() {
  if (!API_BASE) {
    throw new Error('Falta configurar VITE_API_URL');
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const token = data?.session?.access_token;
  if (!token) {
    return { perfil: null, rol: null };
  }

  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}

export async function getOrCreateUserProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, perfil: null, rol: null };
  }

  try {
    const { perfil, rol } = await fetchProfileFromBackend();
    return { user, perfil, rol };
  } catch (err) {
    console.error('Error obteniendo perfil desde backend:', err);
    return { user, perfil: null, rol: null };
  }
}

export async function logout() {
  await supabase.auth.signOut();
}