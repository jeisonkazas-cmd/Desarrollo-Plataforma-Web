import { apiRequest } from './apiClient';
import { supabase } from './supabaseClient';

export async function getOrCreateUserProfile() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { user: null, perfil: null, rol: null };
  }

  try {
    return await apiRequest('/api/auth/me');
  } catch (error) {
    console.error('Error obteniendo perfil desde backend:', error);
    return { user: session.user, perfil: null, rol: null };
  }
}

export async function logout() {
  await supabase.auth.signOut();
}
