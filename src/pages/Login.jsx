import React, { useState } from 'react';
import '../styles/login.css';
import { supabase } from '../services/supabaseClient';

function IconArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSupport() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMicrosoftLogin = async () => {
    setError('');
    setLoading(true);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      redirectTo: `${window.location.origin}/`,
      scopes: 'openid profile email User.Read',
    },
  });

    if (error) {
      setLoading(false);
      setError('No se pudo iniciar sesión con Microsoft.');
      console.error(error);
    }
  };

  return (
    <div className="lp-root">
      <div className="lp-bg" aria-hidden="true" />

      <main className="lp-shell" aria-label="Inicio de sesión">
        <div className="lp-left" aria-hidden="true">
          <div className="lp-left-overlay" />

          <div className="lp-left-logo">
            <img
              src="/imagenes/logo_camacho.png"
              alt="Laboratorios de Física UNIAJC"
              className="lp-left-logo-img"
            />
          </div>

          <div className="lp-left-hero">
            <h2 className="lp-left-headline">
              Explora el universo<br />desde tu laboratorio.
            </h2>
            <p className="lp-left-subline">
              Accede a simulaciones interactivas, gestión de prácticas
              y seguimiento académico en tiempo real.
            </p>
          </div>
        </div>

        <div className="lp-right">
          <div className="lp-mobile-logo">
            <img
              src="/imagenes/logo_camacho.png"
              alt="Laboratorios de Física UNIAJC"
              className="lp-mobile-logo-img"
            />
            <span className="lp-mobile-logo-label">Plataforma de Laboratorios</span>
          </div>

          <div className="lp-form-wrap">
            <header className="lp-form-header">
              <h1 className="lp-form-title">Bienvenido</h1>
              <p className="lp-form-subtitle">
                Inicia sesión con tu cuenta Microsoft institucional
              </p>
            </header>

            {error && (
              <p className="lp-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="lp-submit"
              type="button"
              onClick={handleMicrosoftLogin}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="lp-spinner" aria-hidden="true" />
                  Redirigiendo…
                </>
              ) : (
                <>
                  <span>Continuar con Microsoft</span>
                  <IconArrow />
                </>
              )}
            </button>

            <div className="lp-footer">
              <p className="lp-footer-text">
                <IconSupport />
                ¿Necesitas ayuda? Contacta al soporte académico
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}