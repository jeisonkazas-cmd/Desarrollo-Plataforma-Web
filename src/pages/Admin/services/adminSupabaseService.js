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

export async function fetchGruposAdmin() {
  return apiRequest('/api/platform/admin/grupos');
}

export async function updateGrupoAdmin(grupoId, patch) {
  return apiRequest(`/api/platform/admin/grupos/${grupoId}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function deleteGrupoAdmin(grupoId) {
  return apiRequest(`/api/platform/admin/grupos/${grupoId}`, {
    method: 'DELETE',
  });
}

export async function fetchContenidoAdmin() {
  return apiRequest('/api/platform/admin/contenido');
}

export async function fetchRecursosAdmin() {
  return apiRequest('/api/platform/admin/recursos');
}

export async function createRecursoAdmin(payload) {
  const body = new FormData();
  body.append('titulo', payload.titulo);
  body.append('tipo', payload.tipo);
  body.append('laboratorio', payload.laboratorio || '');
  body.append('file', payload.file);

  await apiRequest('/api/platform/admin/recursos', {
    method: 'POST',
    body,
  });
  return fetchRecursosAdmin();
}

export async function deleteRecursoAdmin(recursoId) {
  await apiRequest(`/api/platform/admin/recursos/${recursoId}`, {
    method: 'DELETE',
  });
}

export async function updateRecursoAdmin(recursoId, patch) {
  await apiRequest(`/api/platform/admin/recursos/${recursoId}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return fetchRecursosAdmin();
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
