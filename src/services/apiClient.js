import { supabase } from './supabaseClient';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function getAccessToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;
  if (session?.access_token) return session.access_token;

  const {
    data: { session: refreshedSession },
    error: refreshError,
  } = await supabase.auth.refreshSession();

  if (refreshError) throw refreshError;
  if (!refreshedSession?.access_token) throw new Error('No hay una sesión activa.');

  return refreshedSession.access_token;
}

async function getAuthHeaders() {
  const token = await getAccessToken();
  return { Authorization: `Bearer ${token}` };
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function performRequest(path, options = {}) {
  const headers = await getAuthHeaders();
  const isFormData = options.body instanceof FormData;

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });
}

export async function apiRequest(path, options = {}) {
  let response = await performRequest(path, options);

  if (response.status === 401) {
    await supabase.auth.refreshSession();
    response = await performRequest(path, options);
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(data?.message || data?.error || 'Error de comunicación con el backend.');
    error.status = response.status;
    error.code = data?.code;
    throw error;
  }

  return data;
}

export function getApiUrl() {
  return API_URL;
}
