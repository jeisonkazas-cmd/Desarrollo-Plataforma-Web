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

  // 1. Buscar usuario por entra_oid
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

  // 2. Si no existe por entra_oid, buscar por correo
  if (!perfil && correo) {
    const { data: perfilPorCorreo } = await supabase
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
      .eq('correo', correo)
      .maybeSingle();

    perfil = perfilPorCorreo;
  }

  // 3. Si no existe, crearlo como pendiente
  if (!perfil) {
    const { data: nuevoPerfil, error: insertError } = await supabase
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

    if (insertError) {
      console.error('Error creando usuario:', insertError);
      return { user, perfil: null, rol: null };
    }

    perfil = nuevoPerfil;
  }

  // 4. Si existe por correo pero no tiene el entra_oid actual, actualizar
  if (perfil && perfil.entra_oid !== user.id) {
    const { data: actualizado, error: updateError } = await supabase
      .from('usuarios')
      .update({
        entra_oid: user.id,
        nombre_completo: perfil.nombre_completo || nombre,
      })
      .eq('usuario_id', perfil.usuario_id)
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

    if (!updateError) {
      perfil = actualizado;
    }
  }

  const rol = perfil?.usuarios_roles?.[0]?.roles?.nombre || null;

  return { user, perfil, rol };
}

export async function logout() {
  await supabase.auth.signOut();
}