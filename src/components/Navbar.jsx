import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setProfileOpen(false);
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  const isAuthenticated = useMemo(
    () => ['/docente', '/admin', '/estudiante'].some((p) => location.pathname.startsWith(p)),
    [location.pathname]
  );

  const roleLabel = useMemo(() => {
    if (location.pathname.startsWith('/docente')) return { name: 'Docente', sub: 'Panel académico' };
    if (location.pathname.startsWith('/admin')) return { name: 'Administrador', sub: 'Panel de gestión' };
    if (location.pathname.startsWith('/estudiante')) return { name: 'Estudiante', sub: 'Panel académico' };
    return null;
  }, [location.pathname]);

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

    if (location.pathname.startsWith('/estudiante')) {
      return {
        navLinks: [
          { label: 'Mis cursos', to: '/dashboard/estudiante' },
        ],
        menus: [],
      };
    }
    if (location.pathname.startsWith('/docente')) {
      return {
        navLinks: [
          { label: 'Mis cursos', to: '/dashboard/docente' },
        ],
        menus: [],
      };
    }
    if (location.pathname.startsWith('/admin')) {
      return {
        navLinks: [
          { label: 'Dashboard', to: '/dashboard/admin' },
        ],
        menus: [],
      };
    }
    return { navLinks: [], menus: visitorMenus };
  }, [location.pathname]);

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
                  className={({ isActive }) =>
                    `wl-nav-link ${isActive ? 'active' : ''}`
                  }
                  role="menuitem"
                >
                  {link.label}
                </NavLink>
              </li>
            ))
          ) : (
            menus && menus.map((menu) => (
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

        <div className="wl-nav-right" ref={profileRef}>
          {isAuthenticated ? (
            <div className="wl-profile-wrapper">
              <button
                type="button"
                className="wl-login wl-profile-btn"
                aria-label="Menú de usuario"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((v) => !v)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 12c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5Z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M20 22c0-4.4183-3.5817-8-8-8s-8 3.5817-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              {profileOpen && (
                <div className="wl-profile-dropdown" role="menu">
                  {roleLabel && (
                    <div className="wl-profile-info">
                      <span className="wl-profile-name">{roleLabel.name}</span>
                      <span className="wl-profile-sub">{roleLabel.sub}</span>
                    </div>
                  )}
                  <button type="button" className="wl-profile-item" role="menuitem" onClick={() => setProfileOpen(false)}>Mi perfil</button>
                  <button type="button" className="wl-profile-item" role="menuitem" onClick={() => setProfileOpen(false)}>Configuración</button>
                  <div className="wl-profile-divider" />
                  <button
                    type="button"
                    className="wl-profile-item wl-profile-logout"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="wl-login" aria-label="Iniciar sesión">
              <svg className="wl-login-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 12c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M20 22c0-4.4183-3.5817-8-8-8s-8 3.5817-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
