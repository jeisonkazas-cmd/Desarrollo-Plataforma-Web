import { supabase } from '../../../services/supabaseClient';

function normalizeRoleToUi(roleNombre) {
  if (!roleNombre) return null;
  const normalized = String(roleNombre).toLowerCase();
  if (normalized === 'administrador') return 'admin';
  if (normalized === 'docente') return 'docente';
  if (normalized === 'estudiante') return 'estudiante';
  return normalized;
}

function uiRoleToDb(roleUi) {
  if (!roleUi) return null;
  if (roleUi === 'admin') return 'Administrador';
  if (roleUi === 'docente') return 'Docente';
  if (roleUi === 'estudiante') return 'Estudiante';
  return roleUi;
}

async function selectUsuariosPreferColumns() {
  // Algunas instancias tienen `created_at`; otras no. Intentamos con fallback.
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

  const withCreatedAt = `${baseSelect}, created_at`;

  const firstTry = await supabase
    .from('usuarios')
    .select(withCreatedAt)
    .order('usuario_id', { ascending: true });

  if (!firstTry.error) return firstTry;

  const fallback = await supabase
    .from('usuarios')
    .select(baseSelect)
    .order('usuario_id', { ascending: true });

  return fallback;
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
      rol: rol ?? 'sin_rol',
      estado: row.estado ?? 'pendiente',
      fechaRegistro: row.created_at ?? null,
      ultimoAcceso: null,
      grupo: null,
    };
  });
}

export async function fetchAdminStats() {
  const usuarios = await fetchUsuariosAdmin();

  const totalUsuarios = usuarios.length;
  const estudiantesActivos = usuarios.filter(
    (u) => u.rol === 'estudiante' && u.estado === 'activo'
  ).length;
  const docentesActivos = usuarios.filter(
    (u) => u.rol === 'docente' && u.estado === 'activo'
  ).length;
  const administradores = usuarios.filter((u) => u.rol === 'admin').length;

  return {
    totalUsuarios,
    estudiantesActivos,
    docentesActivos,
    administradores,
  };
}

export async function updateUsuarioAdmin(usuarioId, patch) {
  const usuarioUpdate = {};
  if (typeof patch.nombre === 'string') usuarioUpdate.nombre_completo = patch.nombre;
  if (typeof patch.email === 'string') usuarioUpdate.correo = patch.email;
  if (typeof patch.estado === 'string') usuarioUpdate.estado = patch.estado;

  if (Object.keys(usuarioUpdate).length > 0) {
    const { error: updateError } = await supabase
      .from('usuarios')
      .update(usuarioUpdate)
      .eq('usuario_id', usuarioId);

    if (updateError) throw updateError;
  }

  if (patch.rol) {
    const rolNombre = uiRoleToDb(patch.rol);
    if (!rolNombre) return;

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
      .insert({ usuario_id: usuarioId, rol_id: rolRow.rol_id });

    if (insertError) throw insertError;
  }
}

export async function deleteUsuarioAdmin(usuarioId) {
  // Nota: puede fallar si hay FK; en ese caso conviene suspender en vez de borrar.
  const { error } = await supabase.from('usuarios').delete().eq('usuario_id', usuarioId);
  if (error) throw error;
}
