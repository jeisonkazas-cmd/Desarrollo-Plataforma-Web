import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Mail, Settings, ShieldCheck, UserRound } from 'lucide-react';
import { apiRequest } from '../services/apiClient';
import '../styles/cuenta.css';

export default function Cuenta({ mode = 'perfil' }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const data = await apiRequest('/api/platform/profile');
        if (alive) setProfile(data);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

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
        </section>
      )}
    </main>
  );
}
