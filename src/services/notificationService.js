import { apiRequest } from './apiClient';

export async function fetchNotificaciones() {
  return apiRequest('/api/platform/notificaciones');
}

export async function markNotificacionLeida(notificacionId) {
  return apiRequest(`/api/platform/notificaciones/${notificacionId}/leida`, {
    method: 'PATCH',
  });
}

export async function markNotificacionesLeidas() {
  return apiRequest('/api/platform/notificaciones/leidas', {
    method: 'PATCH',
  });
}

export async function deleteNotificacion(notificacionId) {
  return apiRequest(`/api/platform/notificaciones/${notificacionId}`, {
    method: 'DELETE',
  });
}

export async function clearNotificaciones() {
  return apiRequest('/api/platform/notificaciones', {
    method: 'DELETE',
  });
}
