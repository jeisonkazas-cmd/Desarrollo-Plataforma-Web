import { supabase } from '../../../services/supabaseClient';

function safeParseJson(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function toDateInputLabel(value) {
  if (!value) return new Date().toISOString();
  return value;
}

function roleLabel(role) {
  if (role === 'admin') return 'Admin';
  if (role === 'docente') return 'Docente';
  if (role === 'estudiante') return 'Estudiante';
  return 'Sin rol';
}

function normalizeRoleToUi(roleNombre) {
  if (!roleNombre) return 'sin_rol';

  const normalized = String(roleNombre).toLowerCase();

  if (normalized === 'administrador') return 'admin';
  if (normalized === 'docente') return 'docente';
  if (normalized === 'estudiante') return 'estudiante';

  return 'sin_rol';
}

function uiRoleToDb(roleUi) {
  if (!roleUi || roleUi === 'sin_rol') return null;

  if (roleUi === 'admin') return 'Administrador';
  if (roleUi === 'docente') return 'Docente';
  if (roleUi === 'estudiante') return 'Estudiante';

  return null;
}

async function selectUsuariosPreferColumns() {
  const baseSelect = `
    usuario_id,
    entra_oid,
    correo,
    nombre_completo,
    estado,
    usuarios_roles (
      roles ( nombre )
    )
  `;

  const withCreatedAt = `${baseSelect}, fecha_creacion`;

  const firstTry = await supabase
    .from('usuarios')
    .select(withCreatedAt)
    .order('usuario_id', { ascending: true });

  if (!firstTry.error) return firstTry;

  return supabase
    .from('usuarios')
    .select(baseSelect)
    .order('usuario_id', { ascending: true });
}

export async function fetchUsuariosAdmin() {
  const { data, error } = await selectUsuariosPreferColumns();

  if (error) throw error;

  return (data ?? []).map((row) => {
    const roleNombre = row?.usuarios_roles?.[0]?.roles?.nombre ?? null;
    const rol = normalizeRoleToUi(roleNombre);

    return {
      id: row.usuario_id,
      entraOid: row.entra_oid ?? null,
      nombre: row.nombre_completo ?? '',
      email: row.correo ?? '',
      rol,
      estado: row.estado ?? 'pendiente',
      fechaRegistro: row.fecha_creacion ?? null,
      ultimoAcceso: null,
      grupo: null,
    };
  });
}

export async function fetchAdminStats() {
  const usuarios = await fetchUsuariosAdmin();

  return {
    totalUsuarios: usuarios.length,
    estudiantesActivos: usuarios.filter(
      (u) => u.rol === 'estudiante' && u.estado === 'activo'
    ).length,
    docentesActivos: usuarios.filter(
      (u) => u.rol === 'docente' && u.estado === 'activo'
    ).length,
    administradores: usuarios.filter((u) => u.rol === 'admin').length,
  };
}

export async function updateUsuarioAdmin(usuarioId, patch) {
  const usuarioUpdate = {};

  if (typeof patch.nombre === 'string') {
    usuarioUpdate.nombre_completo = patch.nombre;
  }

  if (typeof patch.email === 'string') {
    usuarioUpdate.correo = patch.email;
  }

  if (typeof patch.estado === 'string') {
    usuarioUpdate.estado = patch.estado;
  }

  if (Object.keys(usuarioUpdate).length > 0) {
    const { error: updateError } = await supabase
      .from('usuarios')
      .update(usuarioUpdate)
      .eq('usuario_id', usuarioId);

    if (updateError) throw updateError;
  }

  if (patch.rol && patch.rol !== 'sin_rol') {
    const rolNombre = uiRoleToDb(patch.rol);

    if (!rolNombre) {
      throw new Error('Rol inválido.');
    }

    const { data: rolRow, error: rolError } = await supabase
      .from('roles')
      .select('rol_id, nombre')
      .eq('nombre', rolNombre)
      .maybeSingle();

    if (rolError) throw rolError;

    if (!rolRow?.rol_id) {
      throw new Error(`Rol no encontrado en BD: ${rolNombre}`);
    }

    const { error: deleteError } = await supabase
      .from('usuarios_roles')
      .delete()
      .eq('usuario_id', usuarioId);

    if (deleteError) throw deleteError;

    const { error: insertError } = await supabase
      .from('usuarios_roles')
      .insert({
        usuario_id: usuarioId,
        rol_id: rolRow.rol_id,
      });

    if (insertError) throw insertError;
  }
}

export async function deleteUsuarioAdmin(usuarioId) {
  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('usuario_id', usuarioId);

  if (error) throw error;
}

export async function fetchContenidoAdmin() {
  const { data, error } = await supabase
    .from('simulaciones')
    .select(`
      simulacion_id,
      practica_id,
      titulo,
      descripcion,
      url_recurso,
      configuracion_json,
      practicas (
        titulo,
        fecha_publicacion,
        estado
      )
    `)
    .order('simulacion_id', { ascending: false });

  if (error) throw error;

  const rows = [];

  (data ?? []).forEach((simulacion) => {
    const config = safeParseJson(simulacion.configuracion_json);
    const practica = simulacion.practicas ?? {};
    const fechaCreacion = toDateInputLabel(practica.fecha_publicacion);
    const estado = practica.estado ?? 'activo';

    if (simulacion.url_recurso) {
      rows.push({
        id: `sim-${simulacion.simulacion_id}`,
        sourceId: simulacion.simulacion_id,
        practicaId: simulacion.practica_id,
        titulo: simulacion.titulo || practica.titulo || 'Simulacion',
        tipo: 'simulacion',
        url: simulacion.url_recurso,
        fechaCreacion,
        descargas: 0,
        estado,
      });
    }

    if (config.guiaUrl || config.informeUrl || config.plantillaUrl) {
      rows.push({
        id: `guia-${simulacion.simulacion_id}`,
        sourceId: simulacion.simulacion_id,
        practicaId: simulacion.practica_id,
        titulo: config.guiaNombre || config.informeNombre || `Guia - ${practica.titulo || simulacion.titulo || 'Practica'}`,
        tipo: 'recurso',
        url: config.guiaUrl || config.informeUrl || config.plantillaUrl,
        fechaCreacion,
        descargas: 0,
        estado,
      });
    }
  });

  return rows;
}

export async function createContenidoAdmin(payload) {
  if (!payload.practicaId) {
    throw new Error('Selecciona una practica para asociar el contenido.');
  }

  const { data: existing, error: existingError } = await supabase
    .from('simulaciones')
    .select('simulacion_id, configuracion_json')
    .eq('practica_id', payload.practicaId)
    .limit(1);

  if (existingError) throw existingError;

  if (payload.tipo === 'simulacion') {
    const target = existing?.[0];

    if (target?.simulacion_id) {
      const { error } = await supabase
        .from('simulaciones')
        .update({
          titulo: payload.titulo,
          url_recurso: payload.url,
        })
        .eq('simulacion_id', target.simulacion_id);

      if (error) throw error;
      return fetchContenidoAdmin();
    }

    const { error } = await supabase
      .from('simulaciones')
      .insert({
        practica_id: payload.practicaId,
        titulo: payload.titulo,
        url_recurso: payload.url,
        configuracion_json: JSON.stringify({}),
      });

    if (error) throw error;
    return fetchContenidoAdmin();
  }

  const target = existing?.[0];
  const config = safeParseJson(target?.configuracion_json);
  const nextConfig = {
    ...config,
    guiaUrl: payload.url,
    guiaNombre: payload.titulo,
  };

  if (target?.simulacion_id) {
    const { error } = await supabase
      .from('simulaciones')
      .update({ configuracion_json: JSON.stringify(nextConfig) })
      .eq('simulacion_id', target.simulacion_id);

    if (error) throw error;
    return fetchContenidoAdmin();
  }

  const { error } = await supabase
    .from('simulaciones')
    .insert({
      practica_id: payload.practicaId,
      titulo: payload.titulo,
      url_recurso: null,
      configuracion_json: JSON.stringify(nextConfig),
    });

  if (error) throw error;
  return fetchContenidoAdmin();
}

export async function deleteContenidoAdmin(contenido) {
  if (contenido.tipo === 'simulacion') {
    const { error } = await supabase
      .from('simulaciones')
      .update({ url_recurso: null })
      .eq('simulacion_id', contenido.sourceId);

    if (error) throw error;
    return;
  }

  const { data, error: fetchError } = await supabase
    .from('simulaciones')
    .select('configuracion_json')
    .eq('simulacion_id', contenido.sourceId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const config = safeParseJson(data?.configuracion_json);
  delete config.guiaUrl;
  delete config.guiaNombre;
  delete config.informeUrl;
  delete config.informeNombre;
  delete config.plantillaUrl;

  const { error } = await supabase
    .from('simulaciones')
    .update({ configuracion_json: JSON.stringify(config) })
    .eq('simulacion_id', contenido.sourceId);

  if (error) throw error;
}

export async function fetchPracticasCatalogoAdmin() {
  const { data, error } = await supabase
    .from('practicas')
    .select('practica_id, titulo')
    .order('titulo', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.practica_id,
    titulo: row.titulo,
  }));
}

export async function fetchReportesAdmin() {
  const [usuarios, informesResult, practicasResult] = await Promise.all([
    fetchUsuariosAdmin(),
    supabase
      .from('informes')
      .select('informe_id, practica_id, estado, fecha_entrega'),
    supabase
      .from('practicas')
      .select('practica_id, titulo'),
  ]);

  if (informesResult.error) throw informesResult.error;
  if (practicasResult.error) throw practicasResult.error;

  const resumen = {
    totalUsuarios: usuarios.length,
    estudiantesActivos: usuarios.filter((u) => u.rol === 'estudiante' && u.estado === 'activo').length,
    docentesActivos: usuarios.filter((u) => u.rol === 'docente' && u.estado === 'activo').length,
    administradores: usuarios.filter((u) => u.rol === 'admin').length,
  };

  const totalUsuarios = Math.max(usuarios.length, 1);
  const roles = ['admin', 'docente', 'estudiante'];
  const accesoPorRol = roles.map((rol) => {
    const accesos = usuarios.filter((u) => u.rol === rol).length;
    return {
      rol: roleLabel(rol),
      accesos,
      porcentaje: Math.round((accesos / totalUsuarios) * 100),
    };
  });

  const informes = informesResult.data ?? [];
  const now = new Date();
  const actividadPorSemana = Array.from({ length: 7 }, (_, index) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (6 - index) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const accesos = informes.filter((informe) => {
      if (!informe.fecha_entrega) return false;
      const fecha = new Date(informe.fecha_entrega);
      return fecha >= weekStart && fecha < weekEnd;
    }).length;

    return {
      semana: `S${index + 1}`,
      accesos,
    };
  });

  const practicasById = new Map(
    (practicasResult.data ?? []).map((row) => [row.practica_id, row.titulo])
  );
  const grouped = new Map();

  informes.forEach((informe) => {
    const current = grouped.get(informe.practica_id) ?? {
      titulo: practicasById.get(informe.practica_id) ?? 'Practica sin titulo',
      realizadas: 0,
      completadas: 0,
    };

    current.realizadas += 1;
    if (['calificado', 'revisado', 'aprobado'].includes(String(informe.estado || '').toLowerCase())) {
      current.completadas += 1;
    }

    grouped.set(informe.practica_id, current);
  });

  const practicasPopulares = Array.from(grouped.values())
    .map((practica) => ({
      ...practica,
      porcentaje: practica.realizadas
        ? Math.round((practica.completadas / practica.realizadas) * 100)
        : 0,
    }))
    .sort((a, b) => b.realizadas - a.realizadas)
    .slice(0, 8);

  const actividadTotal = actividadPorSemana.reduce((sum, item) => sum + item.accesos, 0);
  const semanaMasActiva = actividadPorSemana.reduce(
    (best, item) => (item.accesos > best.accesos ? item : best),
    actividadPorSemana[0] ?? { semana: 'S1', accesos: 0 }
  );

  return {
    resumen,
    accesoPorRol,
    actividadPorSemana,
    practicasPopulares,
    estadisticasActividad: {
      semanaMasActiva,
      promedioSemanal: Math.round(actividadTotal / Math.max(actividadPorSemana.length, 1)),
      totalActividad: actividadTotal,
      ultimaActualizacion: new Date().toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
  };
}
