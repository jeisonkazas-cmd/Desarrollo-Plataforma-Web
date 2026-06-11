import { apiRequest } from '../../../services/apiClient';

export async function fetchDocenteGrupos() {
  return apiRequest('/api/platform/docente/grupos');
}

export async function fetchDocenteGrupo(grupoId) {
  return apiRequest(`/api/platform/docente/grupos/${grupoId}`);
}

export async function createDocenteGrupo(payload) {
  return apiRequest('/api/platform/docente/grupos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchPracticasByGrupo(grupoId) {
  return apiRequest(`/api/platform/docente/grupos/${grupoId}/practicas`);
}

export async function fetchPracticaDetalle(grupoId, practicaId) {
  const practicas = await fetchPracticasByGrupo(grupoId);
  return practicas.find((practica) => practica.id === String(practicaId)) ?? null;
}

export async function createPracticaForGrupo(grupoId, payload) {
  return apiRequest(`/api/platform/docente/grupos/${grupoId}/practicas`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function uploadPracticaGuide(file) {
  if (!file) return null;
  const body = new FormData();
  body.append('file', file);

  return apiRequest('/api/platform/docente/guias', {
    method: 'POST',
    body,
  });
}

export async function fetchInformesByPractica(practicaId) {
  return apiRequest(`/api/platform/docente/practicas/${practicaId}/informes`);
}

export async function fetchInformeDetalle(informeId) {
  return apiRequest(`/api/platform/docente/informes/${informeId}`);
}

export async function saveInformeGrade(informeId, nota, comentario) {
  return apiRequest(`/api/platform/docente/informes/${informeId}/calificacion`, {
    method: 'PUT',
    body: JSON.stringify({ nota, comentario }),
  });
}

export async function fetchForoPractica(practicaId) {
  return apiRequest(`/api/platform/practicas/${practicaId}/foro`);
}

export async function publicarMensajeForo(practicaId, contenido) {
  return apiRequest(`/api/platform/practicas/${practicaId}/foro`, {
    method: 'POST',
    body: JSON.stringify({ contenido }),
  });
}

export async function fetchDocenteForoReciente() {
  const grupos = await fetchDocenteGrupos();
  const practicasPorGrupo = await Promise.all(
    grupos.map((grupo) => fetchPracticasByGrupo(grupo.id))
  );
  const practicas = practicasPorGrupo.flat();
  const hilosPorPractica = await Promise.all(
    practicas.map(async (practica) => {
      const hilos = await fetchForoPractica(practica.id);
      return hilos.map((hilo) => ({
        ...hilo,
        practica: practica.titulo,
      }));
    })
  );

  return hilosPorPractica
    .flat()
    .sort((a, b) => String(b.tiempoPublicacion).localeCompare(String(a.tiempoPublicacion)))
    .slice(0, 20);
}

export async function fetchDocenteDashboard() {
  const grupos = await fetchDocenteGrupos();
  const practicasPorGrupo = await Promise.all(
    grupos.map((grupo) => fetchPracticasByGrupo(grupo.id))
  );
  const practicas = practicasPorGrupo.flat();
  const informesPorPractica = await Promise.all(
    practicas.map((practica) => fetchInformesByPractica(practica.id))
  );
  const informes = informesPorPractica.flat();

  return {
    grupos,
    practicas,
    informes,
    stats: {
      grupos: grupos.length,
      practicas: practicas.length,
      pendientes: informes.filter((informe) => informe.estado !== 'calificado').length,
      calificados: informes.filter((informe) => informe.estado === 'calificado').length,
    },
  };
}
