import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Mail, Settings, ShieldCheck, UserRound } from 'lucide-react';
import { apiRequest } from '../services/apiClient';
import '../styles/cuenta.css';

function formatEmailError(error) {
  const detail = error?.detail || error?.payload?.detalle;
  if (!detail) return error?.message || 'No se pudo enviar el correo de prueba.';

  if (detail.error) {
    try {
      const parsed = JSON.parse(detail.error);
      return parsed?.message || parsed?.error || detail.error;
    } catch {
      return detail.error;
    }
  }

  if (detail.reason) return detail.reason;
  if (detail.status) return `${error.message} Código: ${detail.status}.`;
  return error?.message || 'No se pudo enviar el correo de prueba.';
}

export default function Cuenta({ mode = 'perfil' }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailStatus, setEmailStatus] = useState('');
  const [emailConfig, setEmailConfig] = useState(null);
  const [testingEmail, setTestingEmail] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await apiRequest('/api/platform/profile');
        if (alive) setProfile(data);
        if (mode === 'configuracion') {
          const config = await apiRequest('/api/platform/notificaciones/email-status');
          if (alive) setEmailConfig(config);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [mode]);

  const handleTestEmail = async () => {
    try {
      setTestingEmail(true);
      setEmailStatus('');
      const result = await apiRequest('/api/platform/notificaciones/test-email', { method: 'POST' });
      setEmailStatus(result?.mensaje || 'Correo de prueba enviado.');
    } catch (error) {
      setEmailStatus(formatEmailError(error));
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading) {
    return <main className="account-page"><p>Cargando...</p></main>;
  }

  const isSettings = mode === 'configuracion';

  return (
    <main className="account-page">
      <header className="account-header">
        <div className="account-avatar">
          {isSettings ? <Settings size={30} /> : <UserRound size={30} />}
        </div>
        <div>
          <h1>{isSettings ? 'Configuración' : 'Mi perfil'}</h1>
          <p>{isSettings ? 'Preferencias de la plataforma' : 'Información de tu cuenta institucional'}</p>
        </div>
      </header>

      {!isSettings ? (
        <section className="account-panel">
          <div className="account-row">
            <UserRound size={20} />
            <div>
              <span>Nombre</span>
              <strong>{profile?.nombre || 'Usuario'}</strong>
            </div>
          </div>
          <div className="account-row">
            <Mail size={20} />
            <div>
              <span>Correo</span>
              <strong>{profile?.correo || 'Sin correo registrado'}</strong>
            </div>
          </div>
          <div className="account-row">
            <ShieldCheck size={20} />
            <div>
              <span>Rol</span>
              <strong>{profile?.rol || 'Sin rol'}</strong>
            </div>
          </div>
          <div className="account-row">
            <CheckCircle2 size={20} />
            <div>
              <span>Estado</span>
              <strong>{profile?.estado || 'Sin estado'}</strong>
            </div>
          </div>
        </section>
      ) : (
        <section className="account-panel">
          <div className="account-row">
            <Bell size={20} />
            <div>
              <span>Notificaciones en la aplicación</span>
              <strong>Activas</strong>
              <p>Se muestran en la campana superior y se guardan en la base de datos.</p>
            </div>
          </div>
          <div className="account-row account-row-action">
            <Mail size={20} />
            <div>
              <span>Correo de notificaciones</span>
              <strong>{profile?.correo || 'Sin correo registrado'}</strong>
              <p>Envía un correo de prueba al usuario actual para validar Resend en el backend.</p>
              {emailConfig && (
                <div className="account-email-config">
                  <span>{emailConfig.configured ? 'Configuración detectada' : 'Configuración incompleta'}</span>
                  <small>Remitente: {emailConfig.from || 'No configurado'}</small>
                  <small>Destino de prueba: {emailConfig.testRecipient || 'Sin correo'}</small>
                </div>
              )}
              <button type="button" onClick={handleTestEmail} disabled={testingEmail}>
                {testingEmail ? 'Enviando...' : 'Enviar prueba'}
              </button>
              {emailStatus && <p className="account-status">{emailStatus}</p>}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
