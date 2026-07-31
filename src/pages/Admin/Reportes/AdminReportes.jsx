import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ArrowLeftIcon, BarChartIcon } from '../components/AdminIcons';
import { fetchReportesAdmin } from '../services/adminSupabaseService';
import '../../../styles/admin.css';

const emptyReportes = {
  resumen: {
    totalUsuarios: 0,
    estudiantesActivos: 0,
    docentesActivos: 0,
    administradores: 0,
  },
  accesoPorRol: [],
  actividadPorSemana: [],
  practicasPopulares: [],
  estadisticasActividad: {
    semanaMasActiva: { semana: 'S1', accesos: 0 },
    promedioSemanal: 0,
    totalActividad: 0,
    ultimaActualizacion: '',
  },
};

export default function AdminReportes() {
  const navigate = useNavigate();
  const [reportes, setReportes] = useState(emptyReportes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadReportes() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchReportesAdmin();
        if (mounted) setReportes(data);
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'No se pudieron cargar los reportes.');
          setReportes(emptyReportes);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadReportes();

    return () => {
      mounted = false;
    };
  }, []);

  const resumen = reportes.resumen;

  const SimpleBarChart = ({ data, label }) => {
    const max = Math.max(...data.map((item) => item.accesos), 1);

    return (
      <div className="admin-chart">
        <h3>{label}</h3>
        <div className="admin-chart-bars">
          {data.length > 0 ? data.map((item, idx) => (
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
          )) : (
            <div className="admin-table-empty">Sin datos para graficar</div>
          )}
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
              onClick={() => navigate('/dashboard/admin')}
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
          <p>Estadisticas y metricas de uso de la plataforma</p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => window.print()}
        >
          Descargar reporte
        </button>
      </div>

      {error && <div className="admin-table-empty">{error}</div>}
      {loading && <div className="admin-table-empty">Cargando reportes...</div>}

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Total usuarios</p>
            <p className="admin-stat-value">{resumen.totalUsuarios.toLocaleString()}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Estudiantes activos</p>
            <p className="admin-stat-value">{resumen.estudiantesActivos.toLocaleString()}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Docentes activos</p>
            <p className="admin-stat-value">{resumen.docentesActivos}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Administradores</p>
            <p className="admin-stat-value">{resumen.administradores}</p>
          </div>
        </div>
      </div>

      <div className="admin-charts-section">
        <div className="admin-chart-wrapper">
          <SimpleBarChart data={reportes.accesoPorRol} label="Usuarios por rol" />
        </div>

        <div className="admin-chart-wrapper">
          <SimpleBarChart data={reportes.actividadPorSemana} label="Entregas por semana (ultimas 7 semanas)" />
        </div>
      </div>

      <div className="admin-report-section">
        <h2>Practicas mas activas</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Practica</th>
                <th>Entregas</th>
                <th>Calificadas</th>
                <th>Tasa de revision</th>
                <th>Progreso</th>
              </tr>
            </thead>
            <tbody>
              {reportes.practicasPopulares.length > 0 ? (
                reportes.practicasPopulares.map((practica, idx) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="admin-table-empty">
                    Aun no hay informes entregados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-info-section">
        <h2>Informacion adicional</h2>
        <div className="admin-info-grid">
          <div className="admin-info-card">
            <h3>Usuarios por rol</h3>
            <ul>
              {reportes.accesoPorRol.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.rol}:</strong> {item.accesos.toLocaleString()} usuarios ({item.porcentaje}%)
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-info-card">
            <h3>Estadisticas de actividad</h3>
            <ul>
              <li>
                <strong>Semana con mas entregas:</strong> {reportes.estadisticasActividad.semanaMasActiva.semana} ({reportes.estadisticasActividad.semanaMasActiva.accesos})
              </li>
              <li>
                <strong>Promedio de entregas/semana:</strong> {reportes.estadisticasActividad.promedioSemanal}
              </li>
              <li>
                <strong>Total de entregas registradas:</strong> {reportes.estadisticasActividad.totalActividad.toLocaleString()}
              </li>
              <li>
                <strong>Ultima actualizacion:</strong> {reportes.estadisticasActividad.ultimaActualizacion || 'Sin datos'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
