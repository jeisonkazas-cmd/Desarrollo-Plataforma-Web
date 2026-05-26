import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DocenteLayout from '../components/DocenteLayout';
import { ArrowLeftIcon } from '../components/icons';
import '../../../styles/settings-panel.css';
import '../../../styles/docente.css';
import { getMockGrupos, getMockPracticasByGrupo } from '../../../mock/docenteMock';

export default function PracticasGrupo() {
  const navigate = useNavigate();
  const { grupoId } = useParams();
  const [filterStatus, setFilterStatus] = useState('todas');

  const grupo = useMemo(() => {
    const grupos = getMockGrupos();
    return grupos.find((g) => g.id === grupoId) || { nombre: 'Grupo', codigo: '' };
  }, [grupoId]);

  const practicas = useMemo(() => getMockPracticasByGrupo(grupoId), [grupoId]);

  const filteredPracticas = useMemo(() => {
    if (filterStatus === 'todas') return practicas;
    return practicas.filter((p) => p.estado === filterStatus);
  }, [practicas, filterStatus]);

  const counts = useMemo(() => {
    return {
      todas: practicas.length,
      activas: practicas.filter((p) => p.estado === 'activa').length,
      cerradas: practicas.filter((p) => p.estado === 'cerrada').length,
    };
  }, [practicas]);

  const handleNewPractice = () => {
    navigate('/docente/practicas/crear');
  };

  const handleViewReports = (practicaId) => {
    navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`);
  };

  const handleMoreOptions = (practicaId) => {
  };

  const getBadgeStyle = (estado) => {
    return estado === 'activa' 
      ? 'docente-practica-badge-active'
      : 'docente-practica-badge-closed';
  };

  const getDateIcon = (estado) => {
    return estado === 'activa' ? '📅' : '✓';
  };

  return (
    <DocenteLayout
      footerText="© 2026 Universidad - Sistema de Gestión de Prácticas Académicas. Todos los derechos reservados."
      topBand={
        <div className="docente-nav-band">
          <div className="docente-nav-band-inner">
            <button
              type="button"
              className="docente-breadcrumb"
              onClick={() => navigate('/')}
              aria-label="Volver al inicio"
            >
              <ArrowLeftIcon size={14} />
              Inicio
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
              <button
                type="button"
                className="docente-breadcrumb"
                onClick={() => navigate('/docente')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit',
                }}
              >
                Dashboard Docente
              </button>
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
              <button
                type="button"
                className="docente-breadcrumb"
                onClick={() => navigate('/docente/grupos')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit',
                }}
              >
                Grupos
              </button>
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
              <span className="docente-breadcrumb-current">
                {grupo.nombre} - {grupo.codigo}
              </span>
            </button>
          </div>
        </div>
      }
    >
      <div className="docente-practicas-grupo-container">
        {/* Header */}
        <div className="docente-practicas-grupo-header">
          <div className="docente-practicas-grupo-header-left">
            <button
              type="button"
              className="docente-practicas-grupo-back-btn"
              onClick={() => navigate('/docente/grupos')}
              aria-label="Volver a grupos"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <div>
              <h1 className="docente-practicas-grupo-title">
                {grupo.nombre} - {grupo.codigo}
              </h1>
              <p className="docente-practicas-grupo-subtitle">
                Lista de prácticas creadas
              </p>
            </div>
          </div>
          <div className="docente-practicas-grupo-header-right">
            <button
              type="button"
              className="docente-practicas-grupo-new-btn"
              onClick={handleNewPractice}
              aria-label="Crear nueva práctica"
            >
              <span className="docente-practicas-grupo-new-btn-icon">➕</span>
              Nueva Práctica
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="docente-practicas-grupo-filters">
          <button
            type="button"
            className={`docente-practicas-grupo-filter ${filterStatus === 'todas' ? 'active' : ''}`}
            onClick={() => setFilterStatus('todas')}
          >
            Todas ({counts.todas})
          </button>
          <button
            type="button"
            className={`docente-practicas-grupo-filter ${filterStatus === 'activas' ? 'active' : ''}`}
            onClick={() => setFilterStatus('activas')}
          >
            Activas
          </button>
          <button
            type="button"
            className={`docente-practicas-grupo-filter ${filterStatus === 'cerradas' ? 'active' : ''}`}
            onClick={() => setFilterStatus('cerradas')}
          >
            Cerradas
          </button>
        </div>

        {/* Practices Grid */}
        <div className="docente-practicas-grupo-grid">
          {filteredPracticas.length > 0 ? (
            filteredPracticas.map((practica) => (
              <div
                key={practica.id}
                className={`docente-practica-card ${practica.estado === 'cerrada' ? 'closed' : ''}`}
              >
                {/* Card Header */}
                <div className="docente-practica-card-header">
                  <span className={`docente-practica-badge ${getBadgeStyle(practica.estado)}`}>
                    {practica.estado === 'activa' ? 'Activa' : 'Cerrada'}
                  </span>
                  <button
                    type="button"
                    className="docente-practica-card-menu-btn"
                    onClick={() => handleMoreOptions(practica.id)}
                    aria-label="Más opciones"
                  >
                    ⋮
                  </button>
                </div>

                {/* Card Title */}
                <h3 className="docente-practica-card-title">{practica.titulo}</h3>

                {/* Card Dates */}
                <div className="docente-practica-card-dates">
                  <div className="docente-practica-card-date-item">
                    <span className="docente-practica-card-date-icon">📅</span>
                    <span>Creado: {practica.fechaCreacion}</span>
                  </div>
                  <div className="docente-practica-card-date-item">
                    <span className="docente-practica-card-date-icon">
                      {getDateIcon(practica.estado)}
                    </span>
                    <span>
                      {practica.estado === 'activa' ? 'Límite' : 'Finalizado'}:{' '}
                      {practica.estado === 'activa' ? practica.fechaLimite : practica.fechaFin}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="docente-practica-card-footer">
                  <div className="docente-practica-card-footer-left">
                    {practica.estudiantesAsignados && practica.estudiantesAsignados.length > 0 && (
                      <div className="docente-practica-card-avatars">
                        {practica.estudiantesAsignados.map((initials, idx) => (
                          <div key={idx} className="docente-practica-card-avatar">
                            {initials}
                          </div>
                        ))}
                      </div>
                    )}
                    <span className="docente-practica-card-reports-badge">
                      {practica.informesRecibidos} informes recibidos
                    </span>
                  </div>
                  <button
                    type="button"
                    className="docente-practica-card-view-btn"
                    onClick={() => handleViewReports(practica.id)}
                  >
                    Ver informes
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="docente-practicas-grupo-empty">
              <p>No hay prácticas con este filtro</p>
            </div>
          )}
        </div>
      </div>
    </DocenteLayout>
  );
}
