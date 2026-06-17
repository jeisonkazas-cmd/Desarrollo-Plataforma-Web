import { apiRequest } from '../../../services/apiClient';
import { supabase } from '../../../services/supabaseClient';

function formatDate(value) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 10);
}

function parseJsonConfig(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

async function getCurrentProfileFromSupabase() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!session?.user) throw new Error('No hay una sesión activa.');

  const { data, error } = await supabase
    .from('usuarios')
    .select('usuario_id, entra_oid, correo, nombre_completo, estado')
    .eq('entra_oid', session.user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('No se encontró el perfil del usuario actual.');

  return data;
}

async function countRows(table, column, value) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq(column, value);

  if (error) return 0;
  return count ?? 0;
}

async function fallbackFetchDocenteGrupos() {
  const profile = await getCurrentProfileFromSupabase();
  const { data: links, error: linksError } = await supabase
    .from('grupos_docentes')
    .select('grupo_id')
    .eq('usuario_id', profile.usuario_id);

  if (linksError) throw linksError;

  const grupoIds = (links ?? []).map((row) => row.grupo_id);
  if (grupoIds.length === 0) return [];

  const { data: grupos, error: gruposError } = await supabase
    .from('grupos')
    .select('grupo_id, nombre, descripcion, estado, fecha_creacion')
    .in('grupo_id', grupoIds)
    .order('nombre', { ascending: true });

  if (gruposError) throw gruposError;

  return Promise.all((grupos ?? []).map(async (grupo) => ({
    id: String(grupo.grupo_id),
    nombre: grupo.nombre ?? `Grupo ${grupo.grupo_id}`,
    codigo: `Grupo ${grupo.grupo_id}`,
    descripcion: grupo.descripcion ?? '',
    estado: grupo.estado ?? 'activo',
    semestre: grupo.descripcion || 'Periodo actual',
    semester: grupo.descripcion || 'Periodo actual',
    estudiantes: await countRows('grupos_estudiantes', 'grupo_id', grupo.grupo_id),
    practicasCreadas: await countRows('practicas', 'grupo_id', grupo.grupo_id),
    activo: (grupo.estado || 'activo') === 'activo',
    docente: '',
    horario: '',
    salon: '',
    icono: 'science',
  })));
}

async function fallbackFetchPracticasByGrupo(grupoId) {
  const { data, error } = await supabase
    .from('practicas')
    .select('practica_id, grupo_id, titulo, descripcion, objetivos, instrucciones, fecha_publicacion, fecha_entrega, estado, simulaciones(simulacion_id, url_recurso, configuracion_json)')
    .eq('grupo_id', Number(grupoId))
    .order('fecha_publicacion', { ascending: false });

  if (error) throw error;

  return Promise.all((data ?? []).map(async (practica) => {
    const simulacion = Array.isArray(practica.simulaciones)
      ? practica.simulaciones[0]
      : practica.simulaciones;
    const config = parseJsonConfig(simulacion?.configuracion_json);

    return {
      id: String(practica.practica_id),
      grupoId: String(practica.grupo_id),
      titulo: practica.titulo ?? 'Práctica',
      descripcion: practica.descripcion ?? '',
      objetivos: practica.objetivos ?? '',
      instrucciones: practica.instrucciones ?? '',
      estado: practica.estado === 'cerrada' ? 'cerrada' : 'activa',
      fechaCreacion: formatDate(practica.fecha_publicacion),
      fechaLimite: formatDate(practica.fecha_entrega),
      fechaFin: formatDate(practica.fecha_entrega),
      fechaEntrega: formatDate(practica.fecha_entrega),
      fecha: formatDate(practica.fecha_entrega),
      simuladorUrl: simulacion?.url_recurso ?? '',
      htmlUrl: simulacion?.url_recurso ?? null,
      informeUrl: config.guiaUrl || config.informeUrl || config.plantillaUrl || null,
      guiaUrl: config.guiaUrl ?? '',
      guiaNombre: config.guiaNombre ?? '',
      informesRecibidos: await countRows('informes', 'practica_id', practica.practica_id),
      estudiantesAsignados: [],
    };
  }));
}

async function fallbackFetchInformesByPractica(practicaId) {
  const { data, error } = await supabase
    .from('informes')
    .select('informe_id, practica_id, estudiante_id, archivo_url, archivo_nombre, observaciones_estudiante, estado, fecha_entrega')
    .eq('practica_id', Number(practicaId))
    .order('fecha_entrega', { ascending: false });

  if (error) throw error;

  const informes = data ?? [];
  const estudianteIds = [...new Set(informes.map((informe) => informe.estudiante_id).filter(Boolean))];
  const informeIds = informes.map((informe) => informe.informe_id);

  const [{ data: usuarios }, { data: retros }] = await Promise.all([
    estudianteIds.length > 0
      ? supabase.from('usuarios').select('usuario_id, nombre_completo, correo').in('usuario_id', estudianteIds)
      : Promise.resolve({ data: [] }),
    informeIds.length > 0
      ? supabase.from('retroalimentaciones').select('informe_id, calificacion, comentario').in('informe_id', informeIds)
      : Promise.resolve({ data: [] }),
  ]);

  const usuarioById = new Map((usuarios ?? []).map((usuario) => [usuario.usuario_id, usuario]));
  const retroByInformeId = new Map((retros ?? []).map((retro) => [retro.informe_id, retro]));

  return informes.map((informe) => {
    const estudiante = usuarioById.get(informe.estudiante_id);
    const retro = retroByInformeId.get(informe.informe_id);

    return {
      id: String(informe.informe_id),
      practicaId: String(informe.practica_id),
      estudianteId: String(informe.estudiante_id),
      estudianteNombre: estudiante?.nombre_completo ?? 'Estudiante',
      estudianteEmail: estudiante?.correo ?? '',
      estado: retro?.calificacion !== null && retro?.calificacion !== undefined ? 'calificado' : informe.estado ?? 'entregado',
      fechaEntrega: formatDate(informe.fecha_entrega),
      nota: retro?.calificacion ?? null,
      feedback: retro?.comentario ?? '',
      archivoUrl: informe.archivo_url ?? '',
      archivoNombre: informe.archivo_nombre ?? '',
      observaciones: informe.observaciones_estudiante ?? '',
      facultad: 'Laboratorio de Física',
    };
  });
}

async function fallbackFetchDocenteDashboard() {
  const grupos = await fallbackFetchDocenteGrupos();
  const practicasPorGrupo = await Promise.all(
    grupos.map((grupo) => fallbackFetchPracticasByGrupo(grupo.id))
  );
  const practicas = practicasPorGrupo.flat();
  const informesPorPractica = await Promise.all(
    practicas.map((practica) => fallbackFetchInformesByPractica(practica.id))
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

export async function fetchDocenteGrupos() {
  return apiRequest('/api/platform/docente/grupos');
}

export async function fetchDocenteGrupo(grupoId) {
  return apiRequest(`/api/platform/docente/grupos/${grupoId}`);
}

export async function fetchDocenteRecursos() {
  return apiRequest('/api/platform/docente/recursos');
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
  try {
    const grupos = await fetchDocenteGrupos();
    const practicasResults = await Promise.allSettled(
      grupos.map((grupo) => fetchPracticasByGrupo(grupo.id))
    );
    const practicas = practicasResults
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value);

    const informesResults = await Promise.allSettled(
      practicas.map((practica) => fetchInformesByPractica(practica.id))
    );
    const informes = informesResults
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value);

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
  } catch (error) {
    console.warn('Backend docente no disponible para dashboard, usando Supabase directo:', error);
    return fallbackFetchDocenteDashboard();
  }
}
