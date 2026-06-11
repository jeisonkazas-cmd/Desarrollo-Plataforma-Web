import { supabase } from './supabaseClient';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function getAuthHeaders() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;
  if (!session?.access_token) throw new Error('No hay una sesión activa.');

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function apiRequest(path, options = {}) {
  const headers = await getAuthHeaders();
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Error de comunicación con el backend.');
  }

  return data;
}

export function getApiUrl() {
  return API_URL;
}
