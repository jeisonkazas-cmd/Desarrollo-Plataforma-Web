import { supabase } from '../../../services/supabaseClient';

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