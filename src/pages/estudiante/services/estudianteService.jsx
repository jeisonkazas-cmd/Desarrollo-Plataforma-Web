import { apiRequest } from '../../../services/apiClient';

export async function getPerfilEstudiante() {
  return apiRequest('/api/platform/profile');
}

export async function getGrupos() {
  return apiRequest('/api/platform/estudiante/grupos');
}

export async function getGrupoDetalle(grupoId) {
  return apiRequest(`/api/platform/estudiante/grupos/${grupoId}`);
}

export async function getPracticasByGrupo(grupoId) {
  return apiRequest(`/api/platform/estudiante/grupos/${grupoId}/practicas`);
}

export async function getPracticaDetalle(practicaId) {
  return apiRequest(`/api/platform/estudiante/practicas/${practicaId}`);
}

export async function getForoPractica(practicaId) {
  return apiRequest(`/api/platform/practicas/${practicaId}/foro`);
}

export async function publicarPostForo(practicaId, contenido) {
  return apiRequest(`/api/platform/practicas/${practicaId}/foro`, {
    method: 'POST',
    body: JSON.stringify({ contenido }),
  });
}

export async function subirInforme(practicaId, file) {
  const body = new FormData();
  body.append('file', file);

  return apiRequest(`/api/platform/estudiante/practicas/${practicaId}/informes`, {
    method: 'POST',
    body,
  });
}
