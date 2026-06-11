import { supabase } from '../../../services/supabaseClient';

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
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

function getPracticeFallbackImage(practicaId) {
  const images = [
    '/imagenes/CAIDA_LIBRE.png',
    '/imagenes/CAMPO_MAGNETICO.png',
    '/imagenes/REPRESENTACION_VECTORIAL.png',
    '/imagenes/MUR.png',
    '/imagenes/PROYECTILES.png',
    '/imagenes/ONDA_ESTACIONARIA.png',
  ];
  const index = Number(practicaId) % images.length;
  return images[index] || '/imagenes/is3.png';
}

function parseSimulationConfig(value) {
  if (!value) return {};

  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return {};
  }
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
  if (!data) throw new Error('No se encontró el perfil del estudiante.');

  return data;
}

async function getInformeByPractica(practicaId, estudianteId) {
  const { data, error } = await supabase
    .from('informes')
    .select('informe_id, estado, archivo_url, archivo_nombre, fecha_entrega')
    .eq('practica_id', Number(practicaId))
    .eq('estudiante_id', estudianteId)
    .order('fecha_entrega', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getRetroalimentacion(informeId) {
  if (!informeId) return null;

  const { data, error } = await supabase
    .from('retroalimentaciones')
    .select('calificacion, comentario, fecha_retroalimentacion')
    .eq('informe_id', informeId)
    .order('fecha_retroalimentacion', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getSimulacionByPractica(practicaId) {
  const { data, error } = await supabase
    .from('simulaciones')
    .select('simulacion_id, titulo, descripcion, url_recurso, configuracion_json')
    .eq('practica_id', Number(practicaId))
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data;
}

function mapEstado(informe, retroalimentacion, practica) {
  if (retroalimentacion?.calificacion !== null && retroalimentacion?.calificacion !== undefined) {
    return 'calificado';
  }

  if (informe) return informe.estado || 'entregado';
  if (practica?.estado === 'cerrada') return 'pendiente';
  return 'pendiente';
}

async function mapPractica(practica, estudianteId) {
  const [informe, simulacion] = await Promise.all([
    getInformeByPractica(practica.practica_id, estudianteId),
    getSimulacionByPractica(practica.practica_id),
  ]);
  const retroalimentacion = await getRetroalimentacion(informe?.informe_id);
  const estado = mapEstado(informe, retroalimentacion, practica);
  const simulationConfig = parseSimulationConfig(simulacion?.configuracion_json);
  const guiaUrl =
    simulationConfig.guiaUrl ||
    simulationConfig.informeUrl ||
    simulationConfig.plantillaUrl ||
    null;

  return {
    id: String(practica.practica_id),
    grupoId: String(practica.grupo_id),
    titulo: practica.titulo || 'Práctica',
    descripcion: practica.descripcion || '',
    htmlUrl: simulacion?.url_recurso || simulationConfig.simuladorUrl || null,
    informeUrl: guiaUrl,
    informeEntregadoUrl: informe?.archivo_url || null,
    tipo: simulacion?.url_recurso ? 'virtual' : 'presencial',
    estado,
    fechaEntrega: formatDate(practica.fecha_entrega),
    fecha: formatDate(practica.fecha_entrega),
    fechaCalificacion: formatDate(retroalimentacion?.fecha_retroalimentacion),
    calificacion: retroalimentacion?.calificacion ?? null,
    puntaje: retroalimentacion?.calificacion ?? undefined,
    instrucciones: practica.instrucciones || practica.objetivos || practica.descripcion || '',
    objetivos: practica.objetivos || '',
    image: getPracticeFallbackImage(practica.practica_id),
    informeId: informe?.informe_id ? String(informe.informe_id) : null,
    archivoNombre: informe?.archivo_nombre || null,
    retroalimentacion: retroalimentacion?.comentario || '',
    simulacion,
  };
}

export async function getGrupos() {
  const profile = await getCurrentProfile();

  const { data: links, error: linksError } = await supabase
    .from('grupos_estudiantes')
    .select('grupo_id, estado, fecha_inscripcion')
    .eq('usuario_id', profile.usuario_id);

  if (linksError) throw linksError;

  const grupoIds = (links ?? []).map((link) => link.grupo_id);
  if (grupoIds.length === 0) return [];

  const { data: grupos, error: gruposError } = await supabase
    .from('grupos')
    .select('grupo_id, nombre, descripcion, estado, fecha_creacion')
    .in('grupo_id', grupoIds)
    .order('nombre', { ascending: true });

  if (gruposError) throw gruposError;

  const linkByGroup = new Map((links ?? []).map((link) => [link.grupo_id, link]));

  return (grupos ?? []).map((grupo) => {
    const link = linkByGroup.get(grupo.grupo_id);

    return {
      id: String(grupo.grupo_id),
      nombre: grupo.nombre || `Grupo ${grupo.grupo_id}`,
      semester: grupo.descripcion || 'Periodo actual',
      docente: '',
      horario: '',
      salon: '',
      activo: (link?.estado || grupo.estado || 'activo') === 'activo',
      descripcion: grupo.descripcion || '',
    };
  });
}

export async function getGrupoDetalle(grupoId) {
  const grupos = await getGrupos();
  return grupos.find((grupo) => grupo.id === String(grupoId)) || null;
}

export async function getPerfilEstudiante() {
  const profile = await getCurrentProfile();

  return {
    id: String(profile.usuario_id),
    nombre: profile.nombre_completo || 'Estudiante',
    correo: profile.correo || '',
    primerNombre: (profile.nombre_completo || 'Estudiante').split(' ')[0],
  };
}

export async function getPracticasByGrupo(grupoId) {
  const profile = await getCurrentProfile();

  const { data, error } = await supabase
    .from('practicas')
    .select('practica_id, grupo_id, titulo, descripcion, objetivos, instrucciones, fecha_publicacion, fecha_entrega, estado')
    .eq('grupo_id', Number(grupoId))
    .order('fecha_entrega', { ascending: true, nullsFirst: false });

  if (error) throw error;

  return Promise.all((data ?? []).map((practica) => mapPractica(practica, profile.usuario_id)));
}

export async function getPracticaDetalle(practicaId) {
  const profile = await getCurrentProfile();

  const { data, error } = await supabase
    .from('practicas')
    .select('practica_id, grupo_id, titulo, descripcion, objetivos, instrucciones, fecha_publicacion, fecha_entrega, estado')
    .eq('practica_id', Number(practicaId))
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapPractica(data, profile.usuario_id);
}

async function getOrCreateForo(practicaId) {
  const { data: existing, error: existingError } = await supabase
    .from('foros')
    .select('foro_id, practica_id, titulo, descripcion, estado')
    .eq('practica_id', Number(practicaId))
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return existing;

  const practica = await getPracticaDetalle(practicaId);
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

export async function getForoPractica(practicaId) {
  const foro = await getOrCreateForo(practicaId);

  const { data: mensajes, error } = await supabase
    .from('mensajes_foro')
    .select('mensaje_id, foro_id, autor_id, mensaje_padre_id, contenido, fecha_creacion')
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
    const rol = autor?.usuarios_roles?.[0]?.roles?.nombre === 'Docente' ? 'profesor' : 'estudiante';

    return {
      id: String(mensaje.mensaje_id),
      autor: autor?.nombre_completo || 'Usuario',
      autorAvatar: null,
      rol,
      contenido: mensaje.contenido,
      timestamp: formatDateTime(mensaje.fecha_creacion),
      visitas: 0,
      respuestas: 0,
      mensajePadreId: mensaje.mensaje_padre_id ? String(mensaje.mensaje_padre_id) : null,
    };
  });
}

export async function publicarPostForo(practicaId, contenido) {
  const profile = await getCurrentProfile();
  const foro = await getOrCreateForo(practicaId);

  const { error } = await supabase.from('mensajes_foro').insert({
    foro_id: foro.foro_id,
    autor_id: profile.usuario_id,
    contenido: contenido.trim(),
  });

  if (error) throw error;

  return { success: true, mensaje: 'Post publicado' };
}

export async function subirInforme(practicaId, file) {
  const profile = await getCurrentProfile();
  let archivoUrl = null;
  let archivoNombre = file?.name || null;

  if (file) {
    const safeName = file.name.replace(/\s+/g, '_');
    const storagePath = `${profile.usuario_id}/${practicaId}/${Date.now()}_${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from('informes')
      .upload(storagePath, file, { upsert: true });

    if (uploadError) {
      throw new Error(
        'No se pudo subir el archivo. Verifica que exista el bucket "informes" en Supabase.'
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from('informes')
      .getPublicUrl(storagePath);

    archivoUrl = publicUrlData?.publicUrl || storagePath;
  }

  const existing = await getInformeByPractica(practicaId, profile.usuario_id);

  if (existing?.informe_id) {
    const { error } = await supabase
      .from('informes')
      .update({
        archivo_url: archivoUrl,
        archivo_nombre: archivoNombre,
        estado: 'entregado',
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq('informe_id', existing.informe_id);

    if (error) throw error;
  } else {
    const { error } = await supabase.from('informes').insert({
      practica_id: Number(practicaId),
      estudiante_id: profile.usuario_id,
      archivo_url: archivoUrl,
      archivo_nombre: archivoNombre,
      estado: 'entregado',
    });

    if (error) throw error;
  }

  return { success: true, mensaje: 'Informe subido correctamente' };
}
