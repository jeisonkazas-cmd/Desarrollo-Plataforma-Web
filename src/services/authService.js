import { supabase } from './supabaseClient';

export async function getOrCreateUserProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, perfil: null, rol: null };
  }

  const correo =
    user.email ||
    user.user_metadata?.email ||
    user.user_metadata?.preferred_username ||
    '';

  const nombre =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    correo;

  // Crear usuario si no existe
  await supabase
    .from('usuarios')
    .upsert(
      {
        entra_oid: user.id,
        correo,
        nombre_completo: nombre,
        estado: 'pendiente',
      },
      {
        onConflict: 'entra_oid',
        ignoreDuplicates: true,
      }
    );

  // Consultar usuario con rol
  const { data: perfil, error } = await supabase
    .from('usuarios')
    .select(`
      usuario_id,
      entra_oid,
      correo,
      nombre_completo,
      estado,
      usuarios_roles (
        roles (
          nombre
        )
      )
    `)
    .eq('entra_oid', user.id)
    .single();

  if (error) {
    console.error(error);
    return { user, perfil: null, rol: null };
  }

  const rol = perfil?.usuarios_roles?.[0]?.roles?.nombre || null;

  return { user, perfil, rol };
}

export async function logout() {
  await supabase.auth.signOut();
}