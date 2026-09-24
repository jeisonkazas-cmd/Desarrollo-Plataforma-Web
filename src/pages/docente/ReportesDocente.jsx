import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocenteLayout from './components/DocenteLayout';
import { ArrowLeftIcon } from './components/icons';
import { fetchDocenteDashboard } from './services/docenteService';
import '../../styles/docente.css';

const initialDashboard = {
  grupos: [],
  practicas: [],
  informes: [],
  stats: { grupos: 0, practicas: 0, pendientes: 0, calificados: 0 },
};

function escapeCsv(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export default function ReportesDocente() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchDocenteDashboard();
        if (alive) setDashboard(data);
      } catch (err) {
        if (alive) setError(err.message || 'No se pudieron cargar los reportes.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const reportRows = useMemo(() => dashboard.informes.map((informe) => {
    const practica = dashboard.practicas.find((item) => item.id === informe.practicaId);
    const grupo = dashboard.grupos.find((item) => item.id === practica?.grupoId);
    const isGraded = informe.estado === 'calificado';

    return {
      id: informe.id,
      estudiante: informe.estudianteNombre || 'Estudiante',
      correo: informe.estudianteEmail || '',
      grupoId: grupo?.id || '',
      grupo: grupo?.nombre || 'Grupo no disponible',
      practicaId: practica?.id || '',
      practica: practica?.titulo || 'Práctica no disponible',
      fecha: informe.fechaEntrega || 'Sin fecha',
      estado: isGraded ? 'calificado' : 'por_calificar',
      estadoLabel: isGraded ? 'Calificado' : 'Por calificar',
      nota: informe.nota ?? '',
    };
  }), [dashboard]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reportRows.filter((row) => {
      const matchesSearch = !term || `${row.estudiante} ${row.correo} ${row.grupo} ${row.practica}`
        .toLowerCase()
        .includes(term);
      const matchesGroup = groupFilter === 'todos' || row.grupoId === groupFilter;
      const matchesStatus = statusFilter === 'todos' || row.estado === statusFilter;
      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [groupFilter, reportRows, search, statusFilter]);

  const averageGrade = useMemo(() => {
    const grades = reportRows
      .map((row) => Number(row.nota))
      .filter((grade) => Number.isFinite(grade));
    if (grades.length === 0) return '—';
    return (grades.reduce((total, grade) => total + grade, 0) / grades.length).toFixed(2);
  }, [reportRows]);

  const handleExport = () => {
    const header = ['Estudiante', 'Correo', 'Grupo', 'Práctica', 'Fecha de entrega', 'Estado', 'Calificación'];
    const rows = filteredRows.map((row) => [
      row.estudiante,
      row.correo,
      row.grupo,
      row.practica,
      row.fecha,
      row.estadoLabel,
      row.nota,
    ]);
    const csv = `\uFEFF${[header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `reportes-docente-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openReport = (row) => {
    if (!row.grupoId || !row.practicaId) return;
    navigate(`/docente/grupo/${row.grupoId}/practica/${row.practicaId}/informe/${row.id}`);
  };

  return (
    <DocenteLayout
      topBand={
        <div className="docente-nav-band">
          <div className="docente-nav-band-inner">
            <button
              type="button"
              className="docente-breadcrumb"
              onClick={() => navigate('/dashboard/docente')}
            >
              <ArrowLeftIcon size={14} />
              Inicio
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <span className="docente-breadcrumb-current">Reportes</span>
          </div>
        </div>
      }
    >
      <div className="docente-reportes-page">
        <header className="docente-grupos-header">
          <div className="docente-grupos-header-content">
            <button
              type="button"
              className="docente-grupos-back-btn"
              onClick={() => navigate('/docente/grupos')}
              aria-label="Volver a grupos"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <div>
              <h1 className="docente-grupos-title">Reportes académicos</h1>
              <p className="docente-reportes-subtitle">Consulta entregas, calificaciones y resultados de tus grupos activos.</p>
            </div>
          </div>
          <button
            type="button"
            className="docente-primary-action"
            onClick={handleExport}
            disabled={loading || filteredRows.length === 0}
          >
            Exportar reporte
          </button>
        </header>

        <nav className="docente-grupos-nav-tabs" aria-label="Secciones del módulo docente">
          <button type="button" className="docente-grupos-nav-tab" onClick={() => navigate('/dashboard/docente')}>
            Dashboard
          </button>
          <button type="button" className="docente-grupos-nav-tab" onClick={() => navigate('/docente/grupos')}>
            Grupos
          </button>
          <button type="button" className="docente-grupos-nav-tab active" aria-current="page">
            Reportes
          </button>
        </nav>

        {error && <p className="docente-form-error">{error}</p>}

        <section className="docente-kpi-grid" aria-label="Resumen de reportes">
          <article className="docente-kpi-card">
            <p className="docente-kpi-label">Informes entregados</p>
            <p className="docente-kpi-value">{reportRows.length}</p>
            <p className="docente-kpi-helper">Total recibido</p>
          </article>
          <article className="docente-kpi-card">
            <p className="docente-kpi-label">Por calificar</p>
            <p className="docente-kpi-value">{reportRows.filter((row) => row.estado === 'por_calificar').length}</p>
            <p className="docente-kpi-helper">Requieren revisión</p>
          </article>
          <article className="docente-kpi-card">
            <p className="docente-kpi-label">Calificados</p>
            <p className="docente-kpi-value">{reportRows.filter((row) => row.estado === 'calificado').length}</p>
            <p className="docente-kpi-helper">Evaluaciones finalizadas</p>
          </article>
          <article className="docente-kpi-card">
            <p className="docente-kpi-label">Promedio general</p>
            <p className="docente-kpi-value">{averageGrade}</p>
            <p className="docente-kpi-helper">Solo informes calificados</p>
          </article>
        </section>

        <section className="docente-reportes-filters" aria-label="Filtros de reportes">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar estudiante, grupo o práctica..."
            aria-label="Buscar reportes"
          />
          <select value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)} aria-label="Filtrar por grupo">
            <option value="todos">Todos los grupos</option>
            {dashboard.grupos.map((grupo) => (
              <option key={grupo.id} value={grupo.id}>{grupo.nombre}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filtrar por estado">
            <option value="todos">Todos los estados</option>
            <option value="por_calificar">Por calificar</option>
            <option value="calificado">Calificados</option>
          </select>
        </section>

        <section className="docente-reports-panel">
          <header className="docente-reports-header">
            <h2 className="docente-reports-title">Detalle de informes</h2>
            <p className="docente-reports-updated">{filteredRows.length} resultado(s)</p>
          </header>
          <div className="docente-reports-table-wrap">
            <table className="docente-reports-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Grupo</th>
                  <th>Práctica</th>
                  <th>Fecha de entrega</th>
                  <th>Estado</th>
                  <th>Calificación</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {!loading && filteredRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="docente-student-cell">
                        <span className="docente-student-avatar" aria-hidden="true">{row.estudiante.charAt(0)}</span>
                        <div>
                          <p className="docente-student-name">{row.estudiante}</p>
                          <p className="docente-student-email">{row.correo}</p>
                        </div>
                      </div>
                    </td>
                    <td>{row.grupo}</td>
                    <td>{row.practica}</td>
                    <td>{row.fecha}</td>
                    <td><span className="docente-status-tag">{row.estadoLabel}</span></td>
                    <td>{row.nota === '' ? '—' : row.nota}</td>
                    <td>
                      <button type="button" className="docente-grade-btn" onClick={() => openReport(row)}>
                        {row.estado === 'calificado' ? 'Ver detalle' : 'Calificar'}
                      </button>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr><td colSpan="7" className="docente-reportes-empty">Cargando reportes...</td></tr>
                )}
                {!loading && filteredRows.length === 0 && (
                  <tr><td colSpan="7" className="docente-reportes-empty">No hay informes que coincidan con los filtros.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocenteLayout>
  );
}
