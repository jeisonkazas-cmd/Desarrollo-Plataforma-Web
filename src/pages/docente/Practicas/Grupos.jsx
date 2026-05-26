import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocenteLayout from '../components/DocenteLayout';
import { ArrowLeftIcon } from '../components/icons';
import '../../../styles/settings-panel.css';
import '../../../styles/docente.css';
import { getMockGrupos } from '../../../mock/docenteMock';

export default function Grupos() {
  const navigate = useNavigate();
  const grupos = useMemo(() => getMockGrupos(), []);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGrupos = useMemo(() => {
    if (!searchTerm.trim()) return grupos;
    const term = searchTerm.toLowerCase();
    return grupos.filter(
      (grupo) =>
        grupo.nombre.toLowerCase().includes(term) ||
        grupo.codigo.toLowerCase().includes(term)
    );
  }, [grupos, searchTerm]);

  const totalEstudiantes = useMemo(() => {
    return grupos.reduce((sum, g) => sum + g.estudiantes, 0);
  }, [grupos]);

  const handleGroupClick = (grupoId) => {
    navigate(`/docente/grupo/${grupoId}/practicas`);
  };

  const handleCreateGroup = () => {
  };

  const handleExportReport = () => {
  };

  const handleNewPractice = () => {
    navigate('/docente/practicas/crear');
  };

  const getIconEmoji = (icono) => {
    const iconMap = {
      functions: '∫',
      calculate: '∑',
      science: '⚗️',
      analytics: '📊',
      biotech: '🧬',
      bar_chart: '📈',
    };
    return iconMap[icono] || '📌';
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
              <span className="docente-breadcrumb-current">Prácticas</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="docente-grupos-container">
        {/* Header */}
        <div className="docente-grupos-header">
          <div className="docente-grupos-header-content">
            <button
              type="button"
              className="docente-grupos-back-btn"
              onClick={() => navigate('/docente')}
              aria-label="Volver"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <div>
              <h1 className="docente-grupos-title">Prácticas Académicas</h1>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="docente-grupos-nav-tabs">
          <button type="button" className="docente-grupos-nav-tab">
            Dashboard
          </button>
          <button type="button" className="docente-grupos-nav-tab active">
            Grupos
          </button>
          <button type="button" className="docente-grupos-nav-tab">
            Reportes
          </button>
        </nav>

        {/* Search Bar */}
        <div className="docente-grupos-search-bar">
          <input
            type="text"
            placeholder="Buscar grupo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="docente-grupos-search-input"
            aria-label="Buscar grupo"
          />
          <button className="docente-grupos-search-btn" aria-label="Buscar">
            🔍
          </button>
        </div>

        {/* Groups Grid */}
        <div className="docente-grupos-grid">
          {filteredGrupos.map((grupo) => (
            <button
              key={grupo.id}
              type="button"
              className="docente-grupo-card"
              onClick={() => handleGroupClick(grupo.id)}
              aria-label={`Ir a ${grupo.nombre} ${grupo.codigo}`}
            >
              {/* Header Icon Area */}
              <div className="docente-grupo-card-icon-area">
                {grupo.estado === 'activo' && (
                  <span className="docente-grupo-card-badge">Activo</span>
                )}
                <span>{getIconEmoji(grupo.icono)}</span>
              </div>

              {/* Group Info */}
              <div className="docente-grupo-card-content">
                <h3 className="docente-grupo-card-title">
                  {grupo.nombre}
                </h3>
                <p className="docente-grupo-card-code">{grupo.codigo}</p>

                {/* Stats */}
                <div className="docente-grupo-card-stats">
                  <div className="docente-grupo-card-stat">
                    <span className="docente-grupo-card-stat-label">Estudiantes</span>
                    <span className="docente-grupo-card-stat-value">{grupo.estudiantes}</span>
                  </div>
                  <div className="docente-grupo-card-stat">
                    <span className="docente-grupo-card-stat-label">Prácticas</span>
                    <span className="docente-grupo-card-stat-value">{grupo.practicasCreadas}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="docente-grupo-card-footer">
                <span className="docente-grupo-card-semester">{grupo.semestre}</span>
                <span className="docente-grupo-card-chevron">→</span>
              </div>
            </button>
          ))}

          {/* Add New Group Card */}
          <button
            type="button"
            className="docente-grupo-card docente-grupo-card-new"
            onClick={handleCreateGroup}
            aria-label="Crear nuevo grupo"
          >
            <div className="docente-grupo-card-new-icon">➕</div>
            <p className="docente-grupo-card-new-text">Crear Grupo</p>
            <p className="docente-grupo-card-new-subtitle">Nuevo curso</p>
          </button>
        </div>

        {/* Bottom Summary Banner */}
        <div className="docente-grupos-summary">
          <div className="docente-grupos-summary-left">
            <h2 className="docente-grupos-summary-title">
              Tienes {totalEstudiantes} estudiantes activos en {grupos.length} grupos
            </h2>
            <div className="docente-grupos-summary-meta">
              <div className="docente-grupos-summary-meta-item">
                <span>Total de estudiantes:</span>
                <span className="docente-grupos-summary-meta-value">{totalEstudiantes}</span>
              </div>
              <div className="docente-grupos-summary-meta-item">
                <span>Grupos activos:</span>
                <span className="docente-grupos-summary-meta-value">{grupos.length}</span>
              </div>
            </div>
          </div>
          <div className="docente-grupos-summary-actions">
            <button
              type="button"
              className="docente-grupos-summary-btn"
              onClick={handleExportReport}
            >
              📥 Exportar Reporte
            </button>
            <button
              type="button"
              className="docente-grupos-summary-btn primary"
              onClick={handleNewPractice}
            >
              ✓ Nueva Práctica
            </button>
          </div>
        </div>
      </div>
    </DocenteLayout>
  );
}
