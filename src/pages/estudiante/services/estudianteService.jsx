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

function normalizePracticeStatus(practica) {
  const rawStatus = String(practica?.estado || '').trim().toLowerCase();
  const hasGrade = practica?.calificacion !== null && practica?.calificacion !== undefined;
  const gradedStatuses = new Set(['calificado', 'calificada', 'evaluado', 'evaluada', 'graded']);
  const submittedStatuses = new Set([
    'entregado',
    'entregada',
    'enviado',
    'enviada',
    'submitted',
    'pendiente_revision',
    'pendiente de revisión',
    'revisado',
    'revisada',
  ]);

  if (hasGrade || gradedStatuses.has(rawStatus)) return 'calificado';
  if (
    practica?.informeId
    || practica?.informeEntregadoUrl
    || practica?.archivoNombre
    || submittedStatuses.has(rawStatus)
  ) {
    return 'entregado';
  }
  return 'pendiente';
}

function normalizePractice(practica) {
  return {
    ...practica,
    estado: normalizePracticeStatus(practica),
  };
}

export async function getPracticasByGrupo(grupoId) {
  const practicas = await apiRequest(`/api/platform/estudiante/grupos/${grupoId}/practicas`);
  return (practicas || []).map(normalizePractice);
}

export async function getPracticaDetalle(practicaId) {
  const practica = await apiRequest(`/api/platform/estudiante/practicas/${practicaId}`);
  return practica ? normalizePractice(practica) : practica;
}

export async function getForoPractica(practicaId) {
  return apiRequest(`/api/platform/practicas/${practicaId}/foro`);
}

export async function publicarPostForo(practicaId, contenido, mensajePadreId = null) {
  return apiRequest(`/api/platform/practicas/${practicaId}/foro`, {
    method: 'POST',
    body: JSON.stringify({
      contenido,
      mensajePadreId,
      mensaje_padre_id: mensajePadreId,
      parentId: mensajePadreId,
    }),
  });
}

export async function subirInforme(practicaId, file) {
  let stableFile = file;
  try {
    const buffer = await file.arrayBuffer();
    stableFile = new File([buffer], file.name, {
      type: file.type || 'application/octet-stream',
      lastModified: Date.now(),
    });
  } catch {
    throw new Error('No se pudo leer el archivo. Vuelve a seleccionarlo y verifica que no esté abierto, movido o sincronizándose.');
  }

  const body = new FormData();
  body.append('file', stableFile, stableFile.name);

  return apiRequest(`/api/platform/estudiante/practicas/${practicaId}/informes`, {
    method: 'POST',
    body,
  });
}
