import { supabase } from './supabaseClient';

export async function getOrCreateUserProfile() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { user: null, perfil: null, rol: null };
  }

  const user = session.user;

  const correo =
    user.email ||
    user.user_metadata?.email ||
    user.user_metadata?.preferred_username ||
    '';

  const nombre =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    correo;

  let { data: perfil } = await supabase
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
    .maybeSingle();

  if (!perfil) {
    const { data: nuevoPerfil, error } = await supabase
      .from('usuarios')
      .insert({
        entra_oid: user.id,
        correo,
        nombre_completo: nombre,
        estado: 'pendiente',
      })
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
      .single();

    if (error) {
      console.error('Error creando usuario:', error);
      return { user, perfil: null, rol: null };
    }

    perfil = nuevoPerfil;
  }

  const rol = perfil?.usuarios_roles?.[0]?.roles?.nombre || null;

  return { user, perfil, rol };
}

export async function logout() {
  await supabase.auth.signOut();
}