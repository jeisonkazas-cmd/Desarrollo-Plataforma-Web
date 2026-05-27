import { supabase } from '../../../services/supabaseClient';

const API_BASE = import.meta.env.VITE_API_URL;

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data?.session?.access_token || null;
}

async function apiFetch(path, options = {}) {
  if (!API_BASE) {
    throw new Error('Falta configurar VITE_API_URL');
  }

  const token = await getAccessToken();
  if (!token) {
    const err = new Error('No autenticado');
    err.status = 401;
    throw err;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(text || res.statusText);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

export async function fetchAdminStats() {
  return apiFetch('/api/admin/stats');
}

function normalizeRoleToUi(roleNombre) {
  if (!roleNombre) return 'estudiante';
  const normalized = String(roleNombre).toLowerCase();
  if (normalized === 'administrador') return 'admin';
  if (normalized === 'docente') return 'docente';
  if (normalized === 'estudiante') return 'estudiante';
  return normalized;
}

export async function fetchUsuariosAdmin() {
  const rows = await apiFetch('/api/admin/usuarios');
  return (rows ?? []).map((row) => ({
    id: row.id,
    nombre: row.nombre ?? '',
    email: row.email ?? '',
    rol: normalizeRoleToUi(row.rol),
    estado: row.estado ?? 'pendiente',
    fechaRegistro: row.fechaRegistro ?? null,
    ultimoAcceso: null,
    grupo: null,
  }));
}

export async function updateUsuarioAdmin(usuarioId, patch) {
  return apiFetch(`/api/admin/usuarios/${usuarioId}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function deleteUsuarioAdmin(usuarioId) {
  return apiFetch(`/api/admin/usuarios/${usuarioId}`, {
    method: 'DELETE',
  });
}
