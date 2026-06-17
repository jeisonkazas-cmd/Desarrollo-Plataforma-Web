import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Settings, UserRound } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import NotificationBell from './NotificationBell';

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
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

  const isAuthenticated = Boolean(currentArea);

  const handleLogout = async () => {
    setProfileOpen(false);
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  const roleLabel = useMemo(() => {
    if (currentArea === 'docente') return { name: 'Docente', sub: 'Panel académico' };
    if (currentArea === 'admin') return { name: 'Administrador', sub: 'Panel de gestión' };
    if (currentArea === 'estudiante') return { name: 'Estudiante', sub: 'Panel académico' };
    if (currentArea === 'cuenta') return { name: 'Cuenta', sub: 'Perfil y configuración' };
    return null;
  }, [currentArea]);

  const { navLinks, menus } = useMemo(() => {
    const visitorMenus = [
      {
        id: 'presencial',
        label: 'Laboratorios de Física Presencial',
        items: [
          { label: 'Laboratorio de Física I Presencial', to: '/simulaciones' },
          { label: 'Laboratorio de Física II Presencial', to: '/simulaciones' },
          { label: 'Laboratorio de Física III Presencial', to: '/simulaciones' },
        ],
      },
      {
        id: 'virtual',
        label: 'Laboratorios de Física Virtual',
        items: [
          { label: 'Laboratorio de Física I Virtual', to: '/simulaciones' },
          { label: 'Laboratorio de Física II Virtual', to: '/simulaciones' },
          { label: 'Laboratorio de Física III Virtual', to: '/simulaciones' },
        ],
      },
      {
        id: 'remotos',
        label: 'Laboratorios de Física Remotos',
        items: [
          { label: 'Laboratorio de Física I Remoto', to: '/simulaciones' },
          { label: 'Laboratorio de Física II Remoto', to: '/simulaciones' },
          { label: 'Laboratorio de Física III Remoto', to: '/simulaciones' },
        ],
      },
    ];

    if (currentArea === 'estudiante') {
      return { navLinks: [{ label: 'Mis cursos', to: '/dashboard/estudiante' }], menus: [] };
    }
    if (currentArea === 'docente') {
      return { navLinks: [{ label: 'Mis cursos', to: '/dashboard/docente' }], menus: [] };
    }
    if (currentArea === 'admin') {
      return { navLinks: [{ label: 'Dashboard', to: '/dashboard/admin' }], menus: [] };
    }
    if (currentArea === 'cuenta') {
      return {
        navLinks: [
          { label: 'Mi perfil', to: '/perfil' },
          { label: 'Configuración', to: '/configuracion' },
        ],
        menus: [],
      };
    }
    return { navLinks: [], menus: visitorMenus };
  }, [currentArea]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!navRef.current) return;
      if (navRef.current.contains(event.target)) return;
      setOpenMenu(null);
      setProfileOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
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
    setOpenMenu(null);
    setProfileOpen(false);
  }, [location.pathname]);

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

        <ul className="wl-nav-list line" role="menubar">
          {isAuthenticated ? (
            navLinks.map((link) => (
              <li key={link.to} className="wl-nav-item">
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `wl-nav-link ${isActive ? 'active' : ''}`}
                  role="menuitem"
                >
                  {link.label}
                </NavLink>
              </li>
            ))
          ) : (
            menus.map((menu) => (
              <li
                key={menu.id}
                className={`wl-nav-item wl-dropdown ${openMenu === menu.id ? 'is-open' : ''}`}
                onMouseEnter={() => setOpenMenu(menu.id)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  className="wl-nav-link wl-dropdown-toggle"
                  aria-haspopup="true"
                  aria-expanded={openMenu === menu.id}
                  onClick={() => setOpenMenu((prev) => (prev === menu.id ? null : menu.id))}
                >
                  {menu.label}
                  <span className="wl-caret" aria-hidden="true">▾</span>
                </button>

                <ul className="wl-dropdown-menu" role="menu">
                  {menu.items.map((item) => (
                    <li key={item.label} role="none">
                      <NavLink
                        to={item.to}
                        className="wl-dropdown-item"
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))
          )}
        </ul>

        <div className="wl-nav-right">
          {isAuthenticated ? (
            <>
              <NotificationBell enabled={isAuthenticated} />
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
