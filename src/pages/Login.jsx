import React, { useId, useMemo, useRef, useState } from 'react';
import '../styles/login.css';
import { supabase } from '../services/supabaseClient';

function IconEmail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7.5C4 6.12 5.12 5 6.5 5h11C18.88 5 20 6.12 20 7.5v9c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 19 4 17.88 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M6.5 7.5 12 11.5l5.5-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  const emailId = useId();
  const helpId = useId();
  const errorId = useId();

  const emailRef = useRef(null);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailTrimmed = email.trim();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed);

  const canSubmit = useMemo(
    () => Boolean(emailTrimmed) && isValidEmail,
    [emailTrimmed, isValidEmail]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailTrimmed) {
      setError('Por favor ingresa tu correo electrónico.');
      emailRef.current?.focus();
      return;
    }

    if (!isValidEmail) {
      setError('Por favor ingresa un correo electrónico válido.');
      emailRef.current?.focus();
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          login_hint: emailTrimmed,
        },
      },
    });

    if (error) {
      setLoading(false);
      setError('No se pudo iniciar sesión con Azure.');
      console.error(error);
    }
  };

  const describedBy = error ? `${helpId} ${errorId}` : helpId;

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
              <p className="lp-form-subtitle">Ingresa con tu correo institucional</p>
            </header>

            <form onSubmit={handleSubmit} noValidate>
              <div className="lp-field">
                <label className="lp-label" htmlFor={emailId}>
                  Correo electrónico
                </label>

                <div className="lp-input-wrap">
                  <span className="lp-input-icon">
                    <IconEmail />
                  </span>

                  <input
                    ref={emailRef}
                    id={emailId}
                    name="email"
                    type="email"
                    className={`lp-input${error ? ' is-invalid' : ''}`}
                    placeholder="tu.correo@uniajc.edu.co"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    aria-invalid={!!error}
                    aria-describedby={describedBy}
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <p className="lp-hint" id={helpId}>
                  Usaremos tu correo para autenticarte con Microsoft Entra ID
                </p>
              </div>

              {error && (
                <p className="lp-error" id={errorId} role="alert">
                  {error}
                </p>
              )}

              <button
                className="lp-submit"
                type="submit"
                disabled={loading || !canSubmit}
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
            </form>

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