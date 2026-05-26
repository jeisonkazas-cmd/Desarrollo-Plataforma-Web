import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import { UsersIcon, BookIcon, BarChartIcon } from './components/AdminIcons';
import '../../styles/admin.css';

export default function DashboardAdmin() {
  const navigate = useNavigate();

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
              ← Inicio
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
          <p>Gestión general de usuarios, roles y configuración</p>
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
          <p>Gestión de laboratorios, recursos y publicaciones institucionales.</p>
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
        <div className="admin-quick-stat-grid">
          <div className="admin-quick-stat">
            <div className="admin-quick-stat-icon">👥</div>
            <div>
              <p>Total usuarios</p>
              <strong>12,842</strong>
            </div>
          </div>
          <div className="admin-quick-stat">
            <div className="admin-quick-stat-icon">🎓</div>
            <div>
              <p>Estudiantes activos</p>
              <strong>9,511</strong>
            </div>
          </div>
          <div className="admin-quick-stat">
            <div className="admin-quick-stat-icon">👨‍🏫</div>
            <div>
              <p>Docentes activos</p>
              <strong>2,730</strong>
            </div>
          </div>
          <div className="admin-quick-stat">
            <div className="admin-quick-stat-icon">⚙️</div>
            <div>
              <p>Administradores</p>
              <strong>601</strong>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
