import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ArrowLeftIcon, BarChartIcon } from '../components/AdminIcons';
import { getMockReportes } from '../services/adminService';
import '../../../styles/admin.css';

export default function AdminReportes() {
  const navigate = useNavigate();
  const reportes = useMemo(() => getMockReportes(), []);

  const resumen = reportes.resumen;

  const SimpleBarChart = ({ data, label }) => {
    const max = Math.max(...data.map((d) => d.accesos));
    return (
      <div className="admin-chart">
        <h3>{label}</h3>
        <div className="admin-chart-bars">
          {data.map((item, idx) => (
            <div key={idx} className="admin-chart-bar-group">
              <div
                className="admin-chart-bar"
                style={{
                  height: `${(item.accesos / max) * 200}px`,
                }}
              />
              <label>{item.semana || item.rol}</label>
              <span className="admin-chart-value">{item.accesos}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
              <ArrowLeftIcon size={14} />
              Inicio
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            </button>
            <button
              type="button"
              className="admin-breadcrumb"
              onClick={() => navigate('/dashboard/admin')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit',
                color: 'inherit',
              }}
            >
              Dashboard Administrador
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <span className="admin-breadcrumb-current">Reportes</span>
          </div>
        </div>
      }
    >
      <div className="admin-page-header">
        <div className="admin-header-content">
          <div className="admin-header-title">
            <BarChartIcon />
            <h1>Reportes del Sistema</h1>
          </div>
          <p>Estadísticas y métricas de uso de la plataforma</p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => window.print()}
        >
          📥 Descargar reporte
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">👥</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Total usuarios</p>
            <p className="admin-stat-value">{resumen.totalUsuarios.toLocaleString()}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🎓</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Estudiantes activos</p>
            <p className="admin-stat-value">{resumen.estudiantesActivos.toLocaleString()}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">👨‍🏫</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Docentes activos</p>
            <p className="admin-stat-value">{resumen.docentesActivos}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">⚙️</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Administradores</p>
            <p className="admin-stat-value">{resumen.administradores}</p>
          </div>
        </div>
      </div>

      <div className="admin-charts-section">
        <div className="admin-chart-wrapper">
          <SimpleBarChart data={reportes.accesoPorRol} label="Accesos por rol" />
        </div>

        <div className="admin-chart-wrapper">
          <SimpleBarChart data={reportes.actividadPorSemana} label="Actividad semanal (últimas 7 semanas)" />
        </div>
      </div>

      <div className="admin-report-section">
        <h2>Prácticas más populares</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Práctica</th>
                <th>Realizadas</th>
                <th>Completadas</th>
                <th>Tasa de compleción</th>
                <th>Progreso</th>
              </tr>
            </thead>
            <tbody>
              {reportes.practicasPopulares.map((practica, idx) => (
                <tr key={idx}>
                  <td className="admin-table-name">{practica.titulo}</td>
                  <td className="admin-table-number">{practica.realizadas}</td>
                  <td className="admin-table-number">{practica.completadas}</td>
                  <td className="admin-table-number">{practica.porcentaje}%</td>
                  <td>
                    <div className="admin-progress-bar">
                      <div
                        className="admin-progress-fill"
                        style={{ width: `${practica.porcentaje}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-info-section">
        <h2>Información adicional</h2>
        <div className="admin-info-grid">
          <div className="admin-info-card">
            <h3>Acceso por rol</h3>
            <ul>
              {reportes.accesoPorRol.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.rol}:</strong> {item.accesos.toLocaleString()} accesos ({item.porcentaje}%)
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-info-card">
            <h3>Estadísticas de actividad</h3>
            <ul>
              <li>
                <strong>Semana con más actividad:</strong> Semana 6 (7,100 accesos)
              </li>
              <li>
                <strong>Promedio de usuarios activos/semana:</strong> 1,544
              </li>
              <li>
                <strong>Total de accesos registrados:</strong> {reportes.actividadPorSemana.reduce((sum, s) => sum + s.accesos, 0).toLocaleString()}
              </li>
              <li>
                <strong>Última actualización:</strong> 28 de abril de 2026
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
