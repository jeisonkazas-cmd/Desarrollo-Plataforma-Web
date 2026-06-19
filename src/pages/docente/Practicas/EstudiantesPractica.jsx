import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DocenteLayout from '../components/DocenteLayout';
import { ArrowLeftIcon } from '../components/icons';
import '../../../styles/settings-panel.css';
import '../../../styles/docente.css';
import {
  fetchDocenteGrupo,
  fetchInformesByPractica,
  fetchPracticaDetalle,
} from '../services/docenteService';

const ITEMS_PER_PAGE = 6;

export default function EstudiantesPractica() {
  const navigate = useNavigate();
  const { grupoId, practicaId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [grupo, setGrupo] = useState({ nombre: 'Grupo', codigo: '' });
  const [practica, setPractica] = useState({ titulo: 'Práctica' });
  const [todosInformes, setTodosInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [grupoData, practicaData, informesData] = await Promise.all([
          fetchDocenteGrupo(grupoId),
          fetchPracticaDetalle(grupoId, practicaId),
          fetchInformesByPractica(practicaId),
        ]);

        if (!alive) return;
        setGrupo(grupoData || { nombre: 'Grupo', codigo: `Grupo ${grupoId}` });
        setPractica(practicaData || { titulo: 'Práctica' });
        setTodosInformes(informesData);
      } catch (err) {
        if (alive) setError(err.message || 'No se pudieron cargar los informes.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [grupoId, practicaId]);

  const filteredInformes = useMemo(() => {
    let result = todosInformes;

    if (filterStatus !== 'todos') {
      result = result.filter((informe) => informe.estado === filterStatus);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((informe) =>
        informe.estudianteNombre.toLowerCase().includes(term)
      );
    }

    return result;
  }, [todosInformes, searchTerm, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredInformes.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInformes = filteredInformes.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleViewForum = () => {
    navigate(`/docente/grupo/${grupoId}/practica/${practicaId}/foro`);
  };

  const handleViewReport = (informeId) => {
    navigate(`/docente/grupo/${grupoId}/practica/${practicaId}/informe/${informeId}`);
  };

  const handleExportPdf = () => {
    window.print();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const getBadgeStyle = (estado) => {
    const styles = {
      entregado: 'docente-informe-badge-entregado',
      calificado: 'docente-informe-badge-calificado',
      pendiente: 'docente-informe-badge-pendiente',
    };
    return styles[estado] || 'docente-informe-badge-entregado';
  };

  const getButtonStyle = (estado) => {
    const styles = {
      entregado: 'docente-informe-btn-entregado',
      calificado: 'docente-informe-btn-calificado',
      pendiente: 'docente-informe-btn-pendiente',
    };
    return styles[estado] || 'docente-informe-btn-entregado';
  };

  return (
    <DocenteLayout
      footerText="© 2026 Universidad - Sistema de Gestión de Prácticas Académicas. Todos los derechos reservados."
      topBand={
        <div className="docente-nav-band">
          <div className="docente-nav-band-inner">
            <button type="button" className="docente-breadcrumb" onClick={() => navigate('/')}>
              <ArrowLeftIcon size={14} />
              Inicio
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <button type="button" className="docente-breadcrumb" onClick={() => navigate('/docente')}>
              Dashboard Docente
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <button type="button" className="docente-breadcrumb" onClick={() => navigate('/docente/grupos')}>
              Grupos
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <button
              type="button"
              className="docente-breadcrumb"
              onClick={() => navigate(`/docente/grupo/${grupoId}/practicas`)}
            >
              {grupo.nombre} - {grupo.codigo}
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <span className="docente-breadcrumb-current">{practica.titulo}</span>
          </div>
        </div>
      }
    >
      <div className="docente-estudiantes-practica-container">
        <div className="docente-estudiantes-practica-header">
          <div className="docente-estudiantes-practica-header-left">
            <button
              type="button"
              className="docente-estudiantes-practica-back-btn"
              onClick={() => navigate(`/docente/grupo/${grupoId}/practicas`)}
              aria-label="Volver a prácticas"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <div>
              <h1 className="docente-estudiantes-practica-title">
                Práctica: {practica.titulo}
              </h1>
              <p className="docente-estudiantes-practica-subtitle">
                Listado de informes enviados
              </p>
            </div>
          </div>
          <div className="docente-estudiantes-practica-header-right">
            <span className="docente-estudiantes-practica-badge-info">
              {todosInformes.length} informes recibidos
            </span>
            <button
              type="button"
              className="docente-estudiantes-practica-forum-btn"
              onClick={handleViewForum}
              aria-label="Ver foro"
            >
              Ver foro
            </button>
            <button
              type="button"
              className="docente-estudiantes-practica-forum-btn"
              onClick={handleExportPdf}
              aria-label="Exportar resultados a PDF"
            >
              Exportar PDF
            </button>
          </div>
        </div>

        <div className="docente-estudiantes-practica-controls">
          <div className="docente-estudiantes-practica-search">
            <span className="docente-estudiantes-practica-search-icon">Buscar</span>
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              className="docente-estudiantes-practica-search-input"
              aria-label="Buscar estudiante"
            />
          </div>

          <div className="docente-estudiantes-practica-filter-group">
            {[
              ['todos', 'Todos'],
              ['entregado', 'Entregados'],
              ['calificado', 'Calificados'],
              ['pendiente', 'Pendientes'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`docente-estudiantes-practica-filter ${filterStatus === value ? 'active' : ''}`}
                onClick={() => {
                  setFilterStatus(value);
                  setCurrentPage(1);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="docente-estudiantes-practica-grid">
          {error && (
            <div className="docente-practicas-grupo-empty">
              <p>{error}</p>
            </div>
          )}
          {loading ? (
            <div className="docente-practicas-grupo-empty">
              <p>Cargando informes...</p>
            </div>
          ) : paginatedInformes.length > 0 ? (
            paginatedInformes.map((informe) => (
              <div key={informe.id} className="docente-informe-card">
                <div className="docente-informe-card-header">
                  <div className="docente-informe-avatar">
                    {informe.estudianteAvatar ? (
                      <img
                        src={informe.estudianteAvatar}
                        alt={informe.estudianteNombre}
                        className="docente-informe-avatar-img"
                      />
                    ) : (
                      <span className="docente-informe-avatar-initials">
                        {getInitials(informe.estudianteNombre)}
                      </span>
                    )}
                  </div>
                  <span className={`docente-informe-badge ${getBadgeStyle(informe.estado)}`}>
                    {informe.estado.charAt(0).toUpperCase() + informe.estado.slice(1)}
                  </span>
                </div>

                <div className="docente-informe-card-info">
                  <h3 className="docente-informe-card-name">{informe.estudianteNombre}</h3>
                  <div className="docente-informe-card-meta">
                    <div className="docente-informe-card-date">
                      <span>Fecha</span>
                      <span>{informe.fechaEntrega || 'Sin fecha'}</span>
                    </div>
                    {informe.estado === 'calificado' && (
                      <div className="docente-informe-card-note">
                        <span>Nota</span>
                        <span>{informe.nota}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className={`docente-informe-card-btn ${getButtonStyle(informe.estado)}`}
                  onClick={() => handleViewReport(informe.id)}
                >
                  Ver informe
                </button>
              </div>
            ))
          ) : (
            <div className="docente-practicas-grupo-empty">
              <p>No hay informes para esta práctica.</p>
            </div>
          )}
        </div>

        <div className="docente-estudiantes-practica-footer">
          <p className="docente-estudiantes-practica-pagination-info">
            Mostrando {paginatedInformes.length > 0 ? startIdx + 1 : 0} de{' '}
            {filteredInformes.length} informes de laboratorio
          </p>
          <div className="docente-estudiantes-practica-pagination">
            <button
              type="button"
              className="docente-estudiantes-practica-pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                type="button"
                className={`docente-estudiantes-practica-pagination-btn ${
                  currentPage === idx + 1 ? 'active' : ''
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              type="button"
              className="docente-estudiantes-practica-pagination-btn"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              aria-label="Página siguiente"
            >
              &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </DocenteLayout>
  );
}
