import React, { useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const MOCK_USERS = [
  { key: 'admin',      password: 'admin',      to: '/dashboard/admin'     },
  { key: 'estudiante', password: 'estudiante', to: '/dashboard/estudiante' },
  { key: 'profesor',   password: 'profesor',   to: '/docente'             },
];

function normalize(str) {
  return str.trim().toLowerCase();
}

function IconEmail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7.5C4 6.12 5.12 5 6.5 5h11C18.88 5 20 6.12 20 7.5v9c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 19 4 17.88 4 16.5v-9Z"
        stroke="currentColor" strokeWidth="1.7" />
      <path d="M6.5 7.5 12 11.5l5.5-4"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10V8.5C7 5.46 9.46 3 12.5 3 15.54 3 18 5.46 18 8.5V10"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="4" y="10" width="16" height="11" rx="2"
        stroke="currentColor" strokeWidth="1.7" />
      <path d="M12.5 14v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSupport() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const emailId    = useId();
  const passwordId = useId();
  const helpId     = useId();
  const errorId    = useId();
  const noticeId   = useId();

  const emailRef    = useRef(null);
  const passwordRef = useRef(null);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [touched,  setTouched]  = useState(false);
  const [error,    setError]    = useState('');
  const [notice,   setNotice]   = useState('');

  const emailTrimmed    = email.trim();
  const passwordTrimmed = password;

  const canSubmit = useMemo(
    () => Boolean(emailTrimmed) && Boolean(passwordTrimmed),
    [emailTrimmed, passwordTrimmed]
  );

  const findUser = () =>
    MOCK_USERS.find(
      (u) => u.key === normalize(emailTrimmed) && u.password === passwordTrimmed
    ) || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    setError('');
    setNotice('');

    if (!emailTrimmed) {
      setError('Ingresa tu usuario o correo.');
      emailRef.current?.focus();
      return;
    }
    if (!passwordTrimmed) {
      setError('Ingresa tu contraseña.');
      passwordRef.current?.focus();
      return;
    }

    setLoading(true);
    const user = findUser();
    window.setTimeout(() => {
      if (!user) {
        setLoading(false);
        setError('Credenciales inválidas. Verifica e inténtalo de nuevo.');
        return;
      }
      navigate(user.to);
    }, 550);
  };

  const handleMicrosoft = () => {
    setTouched(true);
    setError('');
    setNotice('');
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setNotice('La autenticación institucional Microsoft se integrará más adelante.');
    }, 650);
  };

  const describedBy = error
    ? `${helpId} ${errorId}`
    : notice
      ? `${helpId} ${noticeId}`
      : helpId;

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
              <p className="lp-form-subtitle">Ingresa con tus credenciales para continuar</p>
            </header>

            <form onSubmit={handleSubmit} noValidate>

              <div className="lp-field">
                <label className="lp-label" htmlFor={emailId}>
                  Usuario o correo
                </label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon"><IconEmail /></span>
                  <input
                    ref={emailRef}
                    id={emailId}
                    name="email"
                    type="text"
                    className={`lp-input${touched && !emailTrimmed ? ' is-invalid' : ''}`}
                    placeholder="admin | estudiante | profesor"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(''); if (notice) setNotice(''); }}
                    onBlur={() => setTouched(true)}
                    required
                    aria-invalid={touched && !emailTrimmed}
                    aria-describedby={describedBy}
                    disabled={loading}
                  />
                </div>
                <p className="lp-hint" id={helpId}>
                  Demo: <strong>admin/admin</strong> · <strong>estudiante/estudiante</strong> · <strong>profesor/profesor</strong>
                </p>
              </div>

              <div className="lp-field">
                <div className="lp-label-row">
                  <label className="lp-label" htmlFor={passwordId}>Contraseña</label>
                  <button type="button" className="lp-forgot">¿Olvidaste tu contraseña?</button>
                </div>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon"><IconLock /></span>
                  <input
                    ref={passwordRef}
                    id={passwordId}
                    name="password"
                    type="password"
                    className={`lp-input${touched && !passwordTrimmed ? ' is-invalid' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error) setError(''); if (notice) setNotice(''); }}
                    onBlur={() => setTouched(true)}
                    autoComplete="current-password"
                    required
                    aria-invalid={touched && !passwordTrimmed}
                    aria-describedby={describedBy}
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <p className="lp-error" id={errorId} role="alert">{error}</p>
              )}
              {notice && !error && (
                <p className="lp-notice" id={noticeId} role="status" aria-live="polite">{notice}</p>
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
                    Verificando…
                  </>
                ) : (
                  <>
                    <span>Iniciar sesión</span>
                    <IconArrow />
                  </>
                )}
              </button>

              <div className="lp-divider" role="separator">
                <span>O</span>
              </div>

              <button
                className="lp-ms"
                type="button"
                onClick={handleMicrosoft}
                disabled={loading}
              >
                <svg className="lp-ms-icon" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M0 0h23v23H0z" fill="#f3f3f3" />
                  <path d="M1 1h10v10H1z" fill="#f35325" />
                  <path d="M12 1h10v10H12z" fill="#81bc06" />
                  <path d="M1 12h10v10H1z" fill="#05a6f0" />
                  <path d="M12 12h10v10H12z" fill="#ffba08" />
                </svg>
                Continuar con Microsoft
              </button>

            </form>

            <footer className="lp-footer">
              <p className="lp-footer-text">¿Problemas para acceder?</p>
              <button type="button" className="lp-support">
                <IconSupport />
                Contacta a soporte
              </button>
            </footer>

          </div>
        </div>

      </main>
    </div>
  );
}


