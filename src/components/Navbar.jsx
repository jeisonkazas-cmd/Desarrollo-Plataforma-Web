import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Settings, UserRound } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { getOrCreateUserProfile } from '../services/authService';
import NotificationBell from './NotificationBell';

function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [authState, setAuthState] = useState({ user: null, rol: null });
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const currentArea = useMemo(() => {
    if (location.pathname.startsWith('/docente') || location.pathname.startsWith('/dashboard/docente')) return 'docente';
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard/admin')) return 'admin';
    if (location.pathname.startsWith('/estudiante') || location.pathname.startsWith('/dashboard/estudiante')) return 'estudiante';
    if (location.pathname.startsWith('/perfil') || location.pathname.startsWith('/configuracion')) return 'cuenta';
    return null;
  }, [location.pathname]);

  const isAuthenticated = Boolean(authState.user);
  const notificationsEnabled = isAuthenticated && Boolean(authState.rol);

  useEffect(() => {
    let active = true;

    const loadAuth = async () => {
      const auth = await getOrCreateUserProfile();
      if (active) setAuthState({ user: auth.user, rol: auth.rol });
    };

    loadAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        if (active) setAuthState({ user: null, rol: null });
        return;
      }
      window.setTimeout(loadAuth, 0);
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await supabase.auth.signOut();
    setAuthState({ user: null, rol: null });
    navigate('/login', { replace: true });
  };

  const roleLabel = useMemo(() => {
    if (authState.rol === 'Docente') return { name: 'Docente', sub: 'Panel académico' };
    if (authState.rol === 'Administrador') return { name: 'Administrador', sub: 'Panel de gestión' };
    if (authState.rol === 'Estudiante') return { name: 'Estudiante', sub: 'Panel académico' };
    if (currentArea === 'cuenta') return { name: 'Cuenta', sub: 'Perfil y configuración' };
    return null;
  }, [authState.rol, currentArea]);

  const navLinks = useMemo(() => {
    if (currentArea === 'estudiante') {
      return [{ label: 'Mis cursos', to: '/dashboard/estudiante' }];
    }
    if (currentArea === 'docente') {
      return [
        { label: 'Mis cursos', to: '/dashboard/docente' },
        { label: 'Reportes', to: '/docente/reportes' },
        { label: 'Herramientas', to: '/docente/herramientas' },
      ];
    }
    if (currentArea === 'admin') {
      return [{ label: 'Dashboard', to: '/dashboard/admin' }];
    }
    if (currentArea === 'cuenta') {
      return [
        { label: 'Mi perfil', to: '/perfil' },
        { label: 'Configuración', to: '/configuracion' },
      ];
    }
    return [{ label: 'Laboratorios de Física', to: '/' }];
  }, [currentArea]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!navRef.current) return;
      if (navRef.current.contains(event.target)) return;
      setProfileOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return undefined;

    const updateVar = () => {
      const height = el.offsetHeight || 84;
      document.documentElement.style.setProperty('--wl-navbar-height', `${height}px`);
    };

    updateVar();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateVar());
      ro.observe(el);
    } else {
      window.addEventListener('resize', updateVar);
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', updateVar);
    };
  }, []);

  return (
    <nav ref={navRef} className="wl-navbar" aria-label="Barra de navegación">
      <div className="wl-navbar-container">
        <NavLink to="/" className="wl-brand" aria-label="Inicio">
          <img
            src="/imagenes/logo_camacho.png"
            alt="Laboratorios de Física UNIAJC"
            className="wl-brand-logo"
          />
        </NavLink>

        <ul className="wl-nav-list line">
          {navLinks.map((link) => (
            <li key={link.to} className="wl-nav-item">
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `wl-nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="wl-nav-right">
          {isAuthenticated ? (
            <>
              <NotificationBell enabled={notificationsEnabled} />
              <div className="wl-profile-wrapper">
                <button
                  type="button"
                  className="wl-login wl-profile-btn"
                  aria-label="Menú de usuario"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((value) => !value)}
                >
                  <UserRound size={22} />
                </button>
                {profileOpen && (
                  <div className="wl-profile-dropdown" role="menu">
                    {roleLabel && (
                      <div className="wl-profile-info">
                        <span className="wl-profile-name">{roleLabel.name}</span>
                        <span className="wl-profile-sub">{roleLabel.sub}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="wl-profile-item"
                      role="menuitem"
                      onClick={() => navigate('/perfil')}
                    >
                      <UserRound size={16} />
                      Mi perfil
                    </button>
                    <button
                      type="button"
                      className="wl-profile-item"
                      role="menuitem"
                      onClick={() => navigate('/configuracion')}
                    >
                      <Settings size={16} />
                      Configuración
                    </button>
                    <div className="wl-profile-divider" />
                    <button
                      type="button"
                      className="wl-profile-item wl-profile-logout"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <NavLink to="/login" className="wl-login" aria-label="Iniciar sesión">
              <UserRound size={22} />
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
