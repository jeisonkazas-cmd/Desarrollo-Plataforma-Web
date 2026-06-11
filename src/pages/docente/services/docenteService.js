import { supabase } from '../../../services/supabaseClient';

function formatDate(value) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function parseJsonConfig(value) {
  if (!value) return {};
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return {};
  }
}

function normalizePracticeState(estado) {
  if (estado === 'cerrada') return 'cerrada';
  return 'activa';
}

async function getCurrentProfile() {
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

async function getGroupStudentInitials(grupoId) {
  const { data, error } = await supabase
    .from('grupos_estudiantes')
    .select('usuario_id')
    .eq('grupo_id', grupoId)
    .eq('estado', 'activo')
    .limit(3);

  if (error) return [];

  const userIds = (data ?? []).map((row) => row.usuario_id);
  if (userIds.length === 0) return [];

  const { data: users, error: usersError } = await supabase
    .from('usuarios')
    .select('usuario_id, nombre_completo')
    .in('usuario_id', userIds);

  if (usersError) return [];
  const userById = new Map((users ?? []).map((user) => [user.usuario_id, user]));

  return (data ?? []).map((row) => {
    const user = userById.get(row.usuario_id);
    const name = user?.nombre_completo ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0]?.toUpperCase())
      .join('')
      .slice(0, 2) || 'ES';
  });
}

export async function fetchDocenteGrupos() {
  const profile = await getCurrentProfile();

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

  return Promise.all(
    (grupos ?? []).map(async (grupo) => {
      const [estudiantes, practicasCreadas] = await Promise.all([
        countRows('grupos_estudiantes', 'grupo_id', grupo.grupo_id),
        countRows('practicas', 'grupo_id', grupo.grupo_id),
      ]);

      return {
        id: String(grupo.grupo_id),
        nombre: grupo.nombre ?? `Grupo ${grupo.grupo_id}`,
        codigo: `Grupo ${grupo.grupo_id}`,
        descripcion: grupo.descripcion ?? '',
        estado: grupo.estado ?? 'activo',
        semestre: grupo.descripcion || 'Periodo actual',
        estudiantes,
        practicasCreadas,
        icono: 'science',
      };
    })
  );
}

export async function fetchDocenteGrupo(grupoId) {
  const grupos = await fetchDocenteGrupos();
  return grupos.find((grupo) => grupo.id === String(grupoId)) ?? null;
}

export async function fetchPracticasByGrupo(grupoId) {
  const { data, error } = await supabase
    .from('practicas')
    .select('practica_id, grupo_id, titulo, descripcion, objetivos, instrucciones, fecha_publicacion, fecha_entrega, estado, simulaciones(simulacion_id, url_recurso, configuracion_json)')
    .eq('grupo_id', Number(grupoId))
    .order('fecha_publicacion', { ascending: false });

  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (practica) => {
      const [informesRecibidos, estudiantesAsignados] = await Promise.all([
        countRows('informes', 'practica_id', practica.practica_id),
        getGroupStudentInitials(grupoId),
      ]);
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
        estado: normalizePracticeState(practica.estado),
        fechaCreacion: formatDate(practica.fecha_publicacion),
        fechaLimite: formatDate(practica.fecha_entrega),
        fechaFin: formatDate(practica.fecha_entrega),
        simuladorUrl: simulacion?.url_recurso ?? '',
        guiaUrl: config.guiaUrl ?? '',
        guiaNombre: config.guiaNombre ?? '',
        informesRecibidos,
        estudiantesAsignados,
      };
    })
  );
}

export async function fetchPracticaDetalle(grupoId, practicaId) {
  const practicas = await fetchPracticasByGrupo(grupoId);
  return practicas.find((practica) => practica.id === String(practicaId)) ?? null;
}

export async function fetchInformesByPractica(practicaId) {
  const { data, error } = await supabase
    .from('informes')
    .select('informe_id, practica_id, estudiante_id, archivo_url, archivo_nombre, observaciones_estudiante, estado, fecha_entrega')
    .eq('practica_id', Number(practicaId))
    .order('fecha_entrega', { ascending: false });

  if (error) throw error;

  const informes = data ?? [];
  const estudianteIds = [...new Set(informes.map((informe) => informe.estudiante_id).filter(Boolean))];
  const informeIds = informes.map((informe) => informe.informe_id);

  const [{ data: usuarios, error: usuariosError }, { data: retros, error: retrosError }] = await Promise.all([
    estudianteIds.length > 0
      ? supabase
          .from('usuarios')
          .select('usuario_id, nombre_completo, correo')
          .in('usuario_id', estudianteIds)
      : Promise.resolve({ data: [], error: null }),
    informeIds.length > 0
      ? supabase
          .from('retroalimentaciones')
          .select('informe_id, calificacion, comentario, fecha_retroalimentacion')
          .in('informe_id', informeIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (usuariosError) throw usuariosError;
  if (retrosError) throw retrosError;

  const usuarioById = new Map((usuarios ?? []).map((usuario) => [usuario.usuario_id, usuario]));
  const retroByInformeId = new Map((retros ?? []).map((retro) => [retro.informe_id, retro]));

  return informes.map((informe) => {
    const estudiante = usuarioById.get(informe.estudiante_id);
    const retro = retroByInformeId.get(informe.informe_id);
    const nota = retro?.calificacion ?? null;
    const estado = nota !== null ? 'calificado' : informe.estado ?? 'entregado';

    return {
      id: String(informe.informe_id),
      practicaId: String(informe.practica_id),
      estudianteId: String(informe.estudiante_id),
      estudianteNombre: estudiante?.nombre_completo ?? 'Estudiante',
      estudianteEmail: estudiante?.correo ?? '',
      estado,
      fechaEntrega: formatDate(informe.fecha_entrega),
      nota,
      feedback: retro?.comentario ?? '',
      archivoUrl: informe.archivo_url ?? '',
      archivoNombre: informe.archivo_nombre ?? '',
      observaciones: informe.observaciones_estudiante ?? '',
      facultad: 'Laboratorio de Física',
    };
  });
}

export async function fetchInformeDetalle(informeId) {
  const informes = await supabase
    .from('informes')
    .select('informe_id, practica_id')
    .eq('informe_id', Number(informeId))
    .maybeSingle();

  if (informes.error) throw informes.error;
  if (!informes.data) return null;

  const mapped = await fetchInformesByPractica(informes.data.practica_id);
  return mapped.find((informe) => informe.id === String(informeId)) ?? null;
}

export async function saveInformeGrade(informeId, nota, comentario) {
  const profile = await getCurrentProfile();

  const { data: existing, error: existingError } = await supabase
    .from('retroalimentaciones')
    .select('retroalimentacion_id')
    .eq('informe_id', Number(informeId))
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing?.retroalimentacion_id) {
    const { error } = await supabase
      .from('retroalimentaciones')
      .update({
        docente_id: profile.usuario_id,
        calificacion: Number(nota),
        comentario,
        fecha_retroalimentacion: new Date().toISOString(),
      })
      .eq('retroalimentacion_id', existing.retroalimentacion_id);

    if (error) throw error;
  } else {
    const { error } = await supabase.from('retroalimentaciones').insert({
      informe_id: Number(informeId),
      docente_id: profile.usuario_id,
      calificacion: Number(nota),
      comentario,
    });

    if (error) throw error;
  }

  const { error: informeError } = await supabase
    .from('informes')
    .update({ estado: 'calificado', fecha_actualizacion: new Date().toISOString() })
    .eq('informe_id', Number(informeId));

  if (informeError) throw informeError;
}

export async function createPracticaForGrupo(grupoId, payload) {
  const { data, error } = await supabase
    .from('practicas')
    .insert({
      grupo_id: Number(grupoId),
      titulo: payload.titulo,
      descripcion: payload.descripcion || null,
      objetivos: payload.objetivos || null,
      instrucciones: payload.instrucciones || null,
      fecha_entrega: payload.fecha_entrega || null,
      estado: 'activa',
    })
    .select('practica_id')
    .single();

  if (error) throw error;

  const hasSimulationResource = payload.simuladorUrl || payload.guiaUrl;
  if (hasSimulationResource) {
    const { error: simulationError } = await supabase.from('simulaciones').insert({
      practica_id: data.practica_id,
      titulo: payload.simulacionTitulo || payload.titulo,
      descripcion: payload.simulacionDescripcion || null,
      url_recurso: payload.simuladorUrl || null,
      configuracion_json: JSON.stringify({
        guiaUrl: payload.guiaUrl || null,
        guiaNombre: payload.guiaNombre || null,
      }),
    });

    if (simulationError) throw simulationError;
  }

  return data;
}

export async function uploadPracticaGuide(file) {
  if (!file) return null;

  const profile = await getCurrentProfile();
  const safeName = file.name.replace(/\s+/g, '_');
  const storagePath = `${profile.usuario_id}/guias/${Date.now()}_${safeName}`;
  const { error } = await supabase.storage
    .from('guias')
    .upload(storagePath, file, { upsert: true });

  if (error) {
    throw new Error('No se pudo subir la guía. Verifica que exista el bucket "guias" en Supabase Storage.');
  }

  const { data } = supabase.storage.from('guias').getPublicUrl(storagePath);
  return {
    url: data?.publicUrl || storagePath,
    nombre: file.name,
  };
}

async function getOrCreateForo(practicaId) {
  const { data: existing, error: existingError } = await supabase
    .from('foros')
    .select('foro_id, practica_id, titulo, descripcion, estado')
    .eq('practica_id', Number(practicaId))
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return existing;

  const { data: practica, error: practicaError } = await supabase
    .from('practicas')
    .select('titulo')
    .eq('practica_id', Number(practicaId))
    .maybeSingle();

  if (practicaError) throw practicaError;

  const { data, error } = await supabase
    .from('foros')
    .insert({
      practica_id: Number(practicaId),
      titulo: practica?.titulo ? `Foro - ${practica.titulo}` : 'Foro de práctica',
      descripcion: 'Espacio de discusión de la práctica',
      estado: 'activo',
    })
    .select('foro_id, practica_id, titulo, descripcion, estado')
    .single();

  if (error) throw error;
  return data;
}

export async function fetchForoPractica(practicaId) {
  const foro = await getOrCreateForo(practicaId);
  const { data: mensajes, error } = await supabase
    .from('mensajes_foro')
    .select('mensaje_id, autor_id, contenido, fecha_creacion')
    .eq('foro_id', foro.foro_id)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;

  const autorIds = [...new Set((mensajes ?? []).map((mensaje) => mensaje.autor_id).filter(Boolean))];
  const { data: autores, error: autoresError } = autorIds.length > 0
    ? await supabase
        .from('usuarios')
        .select('usuario_id, nombre_completo, usuarios_roles(roles(nombre))')
        .in('usuario_id', autorIds)
    : { data: [], error: null };

  if (autoresError) throw autoresError;

  const autorById = new Map((autores ?? []).map((autor) => [autor.usuario_id, autor]));

  return (mensajes ?? []).map((mensaje) => {
    const autor = autorById.get(mensaje.autor_id);
    const rol = autor?.usuarios_roles?.[0]?.roles?.nombre === 'Docente' ? 'docente' : 'estudiante';

    return {
      id: String(mensaje.mensaje_id),
      autorNombre: autor?.nombre_completo || 'Usuario',
      autorAvatar: null,
      autorRol: rol,
      titulo: mensaje.contenido.split('\n')[0].slice(0, 100) || 'Publicación',
      preview: mensaje.contenido,
      respuestas: 0,
      vistas: 0,
      tiempoPublicacion: formatDateTime(mensaje.fecha_creacion),
    };
  });
}

export async function publicarMensajeForo(practicaId, contenido) {
  const profile = await getCurrentProfile();
  const foro = await getOrCreateForo(practicaId);
  const { error } = await supabase.from('mensajes_foro').insert({
    foro_id: foro.foro_id,
    autor_id: profile.usuario_id,
    contenido: contenido.trim(),
  });

  if (error) throw error;
}

export async function fetchDocenteForoReciente() {
  const grupos = await fetchDocenteGrupos();
  const practicasPorGrupo = await Promise.all(
    grupos.map((grupo) => fetchPracticasByGrupo(grupo.id))
  );
  const practicas = practicasPorGrupo.flat();
  const practicaIds = practicas.map((practica) => Number(practica.id));

  if (practicaIds.length === 0) return [];

  const { data: foros, error: forosError } = await supabase
    .from('foros')
    .select('foro_id, practica_id')
    .in('practica_id', practicaIds);

  if (forosError) throw forosError;
  const foroIds = (foros ?? []).map((foro) => foro.foro_id);
  if (foroIds.length === 0) return [];

  const { data: mensajes, error } = await supabase
    .from('mensajes_foro')
    .select('mensaje_id, foro_id, autor_id, contenido, fecha_creacion')
    .in('foro_id', foroIds)
    .order('fecha_creacion', { ascending: false })
    .limit(20);

  if (error) throw error;

  const autorIds = [...new Set((mensajes ?? []).map((mensaje) => mensaje.autor_id).filter(Boolean))];
  const { data: autores } = autorIds.length > 0
    ? await supabase.from('usuarios').select('usuario_id, nombre_completo').in('usuario_id', autorIds)
    : { data: [] };

  const autorById = new Map((autores ?? []).map((autor) => [autor.usuario_id, autor]));
  const foroById = new Map((foros ?? []).map((foro) => [foro.foro_id, foro]));
  const practicaById = new Map(practicas.map((practica) => [Number(practica.id), practica]));

  return (mensajes ?? []).map((mensaje) => {
    const foro = foroById.get(mensaje.foro_id);
    const practica = practicaById.get(foro?.practica_id);
    const autor = autorById.get(mensaje.autor_id);

    return {
      id: String(mensaje.mensaje_id),
      autor: autor?.nombre_completo || 'Usuario',
      tiempo: formatDateTime(mensaje.fecha_creacion),
      practica: practica?.titulo || 'Práctica',
      respuestas: 0,
      texto: mensaje.contenido,
    };
  });
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
