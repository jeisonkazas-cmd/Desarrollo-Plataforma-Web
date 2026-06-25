import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import { BarChartIcon, BookIcon, UsersIcon } from './components/AdminIcons';
import { fetchAdminStats } from './services/adminSupabaseService';
import '../../styles/admin.css';

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    estudiantesActivos: 0,
    docentesActivos: 0,
    administradores: 0,
  });

  useEffect(() => {
    let alive = true;

    const guardAndLoad = async () => {
      try {
        const realStats = await fetchAdminStats();
        if (!alive) return;
        setStats(realStats);
      } catch (err) {
        console.error('Error cargando stats admin:', err);
        if (!alive) return;

        if (err?.status === 401) {
          setStatsError('No se pudieron cargar las estadísticas porque el backend no recibió la autenticación.');
          return;
        }

        if (err?.status === 403) {
          navigate('/pendiente', { replace: true });
          return;
        }

        setStatsError('No se pudieron cargar las estadísticas.');
      } finally {
        if (alive) setLoadingStats(false);
      }
    };

    guardAndLoad();
    return () => {
      alive = false;
    };
  }, [navigate]);

  return (
    <AdminLayout
      topBand={
        <div className="admin-nav-band">
          <div className="admin-nav-band-inner">
            <button
              type="button"
              className="admin-breadcrumb"
              onClick={() => navigate('/')}
              aria-label="Volver al inicio"
            >
              {'<-'} Inicio
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <span className="admin-breadcrumb-current">Dashboard Administrador</span>
          </div>
        </div>
      }
    >
      <header className="admin-dashboard-header">
        <div>
          <h1>Panel de Administración</h1>
          <p>Gestión general de usuarios, roles, grupos y configuración</p>
        </div>
      </header>

      <section className="admin-dashboard-cards">
        <div className="admin-action-card">
          <div className="admin-card-icon">
            <UsersIcon />
          </div>
          <h3>Gestión de Usuarios</h3>
          <p>Administración de roles, permisos y estado de cuentas.</p>
          <button
            type="button"
            className="admin-btn-card"
            onClick={() => navigate('/admin/usuarios')}
          >
            Abrir gestión
          </button>
        </div>

        <div className="admin-action-card">
          <div className="admin-card-icon">
            <BookIcon />
          </div>
          <h3>Gestión de Contenido</h3>
          <p>Gestión de simulaciones, guías, informes y recursos institucionales.</p>
          <button
            type="button"
            className="admin-btn-card"
            onClick={() => navigate('/admin/contenido')}
          >
            Abrir gestión
          </button>
        </div>

        <div className="admin-action-card">
          <div className="admin-card-icon">
            <UsersIcon />
          </div>
          <h3>Gestión de Grupos</h3>
          <p>Administra grupos académicos, estado y trazabilidad de asignaciones.</p>
          <button
            type="button"
            className="admin-btn-card"
            onClick={() => navigate('/admin/grupos')}
          >
            Abrir gestión
          </button>
        </div>

        <div className="admin-action-card">
          <div className="admin-card-icon">
            <BarChartIcon />
          </div>
          <h3>Reportes</h3>
          <p>Indicadores de uso, métricas de acceso y actividad académica.</p>
          <button
            type="button"
            className="admin-btn-card"
            onClick={() => navigate('/admin/reportes')}
          >
            Ver reportes
          </button>
        </div>
      </section>

      <section className="admin-dashboard-quick-stats">
        <h2>Estadísticas rápidas</h2>
        {statsError && (
          <p style={{ marginTop: 8, color: '#b00020' }} role="alert">
            {statsError}
          </p>
        )}
        <div className="admin-quick-stat-grid">
          <div className="admin-quick-stat">
            <div className="admin-quick-stat-icon">US</div>
            <div>
              <p>Total usuarios</p>
              <strong>{loadingStats ? '-' : stats.totalUsuarios}</strong>
            </div>
          </div>
          <div className="admin-quick-stat">
            <div className="admin-quick-stat-icon">ES</div>
            <div>
              <p>Estudiantes activos</p>
              <strong>{loadingStats ? '-' : stats.estudiantesActivos}</strong>
            </div>
          </div>
          <div className="admin-quick-stat">
            <div className="admin-quick-stat-icon">DO</div>
            <div>
              <p>Docentes activos</p>
              <strong>{loadingStats ? '-' : stats.docentesActivos}</strong>
            </div>
          </div>
          <div className="admin-quick-stat">
            <div className="admin-quick-stat-icon">AD</div>
            <div>
              <p>Administradores</p>
              <strong>{loadingStats ? '-' : stats.administradores}</strong>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
