import { apiRequest } from '../../../services/apiClient';

function normalizeRoleToUi(roleNombre) {
  if (!roleNombre) return 'sin_rol';
  const normalized = String(roleNombre).toLowerCase();
  if (normalized === 'administrador') return 'admin';
  if (normalized === 'docente') return 'docente';
  if (normalized === 'estudiante') return 'estudiante';
  return normalized;
}

export async function fetchUsuariosAdmin() {
  const rows = await apiRequest('/api/admin/usuarios');
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

export async function fetchAdminStats() {
  return apiRequest('/api/admin/stats');
}

export async function updateUsuarioAdmin(usuarioId, patch) {
  return apiRequest(`/api/admin/usuarios/${usuarioId}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function deleteUsuarioAdmin(usuarioId) {
  return apiRequest(`/api/admin/usuarios/${usuarioId}`, {
    method: 'DELETE',
  });
}

export async function fetchContenidoAdmin() {
  return apiRequest('/api/platform/admin/contenido');
}

export async function createContenidoAdmin(payload) {
  await apiRequest('/api/platform/admin/contenido', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return fetchContenidoAdmin();
}

export async function deleteContenidoAdmin(contenido) {
  await apiRequest(`/api/platform/admin/contenido/${contenido.tipo}/${contenido.sourceId}`, {
    method: 'DELETE',
  });
}

export async function fetchPracticasCatalogoAdmin() {
  return apiRequest('/api/platform/admin/practicas');
}

export async function fetchReportesAdmin() {
  return apiRequest('/api/platform/admin/reportes');
}
