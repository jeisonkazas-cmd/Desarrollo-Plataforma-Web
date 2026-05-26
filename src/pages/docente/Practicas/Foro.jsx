import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DocenteLayout from '../components/DocenteLayout';
import { ArrowLeftIcon } from '../components/icons';
import '../../../styles/settings-panel.css';
import '../../../styles/docente.css';
import { getMockGrupos, getMockPracticasByGrupo, getMockHilosForo, getMockTeacher } from '../../../mock/docenteMock';

const HILOS_POR_PAGINA = 5;

export default function Foro() {
  const navigate = useNavigate();
  const { grupoId, practicaId } = useParams();

  const grupo = useMemo(() => {
    const grupos = getMockGrupos();
    return grupos.find((g) => g.id === grupoId) || { nombre: 'Grupo', codigo: '' };
  }, [grupoId]);

  const practica = useMemo(() => {
    const practicas = getMockPracticasByGrupo(grupoId);
    return practicas.find((p) => p.id === practicaId) || { titulo: 'Práctica' };
  }, [grupoId, practicaId]);

  const teacher = useMemo(() => getMockTeacher(), []);

  const hilosOriginales = useMemo(() => getMockHilosForo(practicaId), [practicaId]);

  const [hilos, setHilos] = useState(hilosOriginales);
  const [nuevoHilo, setNuevoHilo] = useState('');
  const [errorHilo, setErrorHilo] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('recientes');
  const [paginaActual, setPaginaActual] = useState(1);

  const hilosOrdenados = useMemo(() => {
    if (ordenamiento === 'recientes') {
      return [...hilos];
    } else if (ordenamiento === 'populares') {
      return [...hilos].sort((a, b) => b.respuestas - a.respuestas);
    }
    return [...hilos];
  }, [hilos, ordenamiento]);

  const totalPages = Math.ceil(hilosOrdenados.length / HILOS_POR_PAGINA);
  const startIdx = (paginaActual - 1) * HILOS_POR_PAGINA;
  const hilosPaginados = hilosOrdenados.slice(startIdx, startIdx + HILOS_POR_PAGINA);

  const handlePublicar = () => {
    if (!nuevoHilo.trim()) {
      setErrorHilo('Por favor escribe algo antes de publicar');
      return;
    }

    setErrorHilo('');
    const hilo = {
      id: String(Math.random()),
      practicaId,
      autorNombre: teacher.nombre,
      autorAvatar: null,
      autorRol: 'docente',
      titulo: nuevoHilo.split('\n')[0].substring(0, 100) || 'Sin título',
      preview: nuevoHilo.substring(0, 150),
      respuestas: 0,
      vistas: 0,
      tiempoPublicacion: 'ahora',
    };

    setHilos([hilo, ...hilos]);
    setNuevoHilo('');
    setPaginaActual(1);
  };

  const handleAttach = () => {
  };

  const handleImage = () => {
  };

  const handleBold = () => {
  };

  const handleVerDiscusion = (hiloId) => {
  };

  const getAutorInitials = (nombre) => {
    return nombre
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('')
      .substring(0, 2);
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
              <button
                type="button"
                className="docente-breadcrumb"
                onClick={() => navigate(`/docente/grupo/${grupoId}/practicas`)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit',
                }}
              >
                {grupo.nombre} - {grupo.codigo}
              </button>
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
              <button
                type="button"
                className="docente-breadcrumb"
                onClick={() => navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit',
                }}
              >
                {practica.titulo}
              </button>
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
              <span className="docente-breadcrumb-current">Foro</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="docente-foro-container">
        {/* Header */}
        <div className="docente-foro-header">
          <div>
            <h1 className="docente-foro-title">Foro – {practica.titulo}</h1>
            <p className="docente-foro-subtitle">{grupo.nombre} – Grupo {grupo.codigo}</p>
          </div>
          <button
            type="button"
            className="docente-foro-back-btn"
            onClick={() => navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`)}
            aria-label="Volver a informes"
          >
            <ArrowLeftIcon size={18} />
            Volver a informes
          </button>
        </div>

        {/* Nueva publicación */}
        <div className="docente-foro-create-post">
          <div className="docente-foro-avatar">
            {teacher.avatar ? (
              <img
                src={teacher.avatar}
                alt="Tu foto de perfil"
                className="docente-foro-avatar-img"
              />
            ) : (
              <span className="docente-foro-avatar-initials">
                {getAutorInitials(teacher.nombre)}
              </span>
            )}
          </div>
          <div className="docente-foro-create-content">
            <textarea
              value={nuevoHilo}
              onChange={(e) => {
                setNuevoHilo(e.target.value);
                if (e.target.value.trim()) setErrorHilo('');
              }}
              placeholder="Escribe una pregunta o anuncio para el grupo..."
              className="docente-foro-textarea"
              aria-label="Crear nuevo hilo"
            />
            <div className="docente-foro-create-footer">
              <div className="docente-foro-tools">
                <button
                  type="button"
                  className="docente-foro-tool-btn"
                  onClick={handleAttach}
                  title="Adjuntar archivo"
                  aria-label="Adjuntar archivo"
                >
                  📎
                </button>
                <button
                  type="button"
                  className="docente-foro-tool-btn"
                  onClick={handleImage}
                  title="Insertar imagen"
                  aria-label="Insertar imagen"
                >
                  🖼️
                </button>
                <button
                  type="button"
                  className="docente-foro-tool-btn"
                  onClick={handleBold}
                  title="Formato de texto"
                  aria-label="Formato de texto"
                >
                  𝐁
                </button>
              </div>
              <button
                type="button"
                className="docente-foro-publish-btn"
                onClick={handlePublicar}
                aria-label="Publicar"
              >
                <span>📤</span>
                Publicar
              </button>
            </div>
            {errorHilo && (
              <p className="docente-foro-error">{errorHilo}</p>
            )}
          </div>
        </div>

        {/* Discusiones recientes */}
        <div className="docente-foro-section-header">
          <h3 className="docente-foro-section-title">Discusiones recientes</h3>
          <div className="docente-foro-sort-control">
            <label className="docente-foro-sort-label">Ordenar por:</label>
            <select
              value={ordenamiento}
              onChange={(e) => {
                setOrdenamiento(e.target.value);
                setPaginaActual(1);
              }}
              className="docente-foro-sort-select"
              aria-label="Ordenar discusiones"
            >
              <option value="recientes">Más recientes</option>
              <option value="populares">Populares</option>
            </select>
          </div>
        </div>

        {/* Lista de hilos */}
        {hilosPaginados.length > 0 ? (
          <div className="docente-foro-threads-list">
            {hilosPaginados.map((hilo) => (
              <div
                key={hilo.id}
                className="docente-foro-thread-card"
              >
                <div className="docente-foro-thread-header">
                  {/* Avatar */}
                  <div className="docente-foro-thread-avatar">
                    {hilo.autorRol === 'docente' ? (
                      <div className="docente-foro-avatar-docente">
                        👨‍🏫
                      </div>
                    ) : hilo.autorAvatar ? (
                      <img
                        src={hilo.autorAvatar}
                        alt={hilo.autorNombre}
                        className="docente-foro-avatar-img"
                      />
                    ) : (
                      <span className="docente-foro-avatar-initials">
                        {getAutorInitials(hilo.autorNombre)}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="docente-foro-thread-info">
                    <div className="docente-foro-thread-author-info">
                      <span className="docente-foro-author-name">
                        {hilo.autorNombre}
                      </span>
                      <span className={`docente-foro-role-badge docente-foro-role-${hilo.autorRol}`}>
                        {hilo.autorRol.charAt(0).toUpperCase() + hilo.autorRol.slice(1)}
                      </span>
                      <span className="docente-foro-separator">•</span>
                      <span className="docente-foro-timestamp">
                        {hilo.tiempoPublicacion}
                      </span>
                    </div>

                    <h4 className="docente-foro-thread-title">
                      {hilo.titulo}
                    </h4>

                    <p className="docente-foro-thread-preview">
                      {hilo.preview}
                    </p>

                    <div className="docente-foro-thread-footer">
                      <div className="docente-foro-thread-stats">
                        <div className="docente-foro-stat">
                          <span className="docente-foro-stat-icon">💬</span>
                          <span className="docente-foro-stat-value">
                            {hilo.respuestas} respuestas
                          </span>
                        </div>
                        <div className="docente-foro-stat">
                          <span className="docente-foro-stat-icon">👁️</span>
                          <span className="docente-foro-stat-value">
                            {hilo.vistas} vistas
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="docente-foro-see-discussion-btn"
                        onClick={() => handleVerDiscusion(hilo.id)}
                        aria-label={`Ver discusión: ${hilo.titulo}`}
                      >
                        Ver discusión
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="docente-foro-empty-state">
            <div className="docente-foro-empty-icon">💬</div>
            <h3 className="docente-foro-empty-title">Sin publicaciones aún</h3>
            <p className="docente-foro-empty-subtitle">
              Sé el primero en publicar algo para el grupo.
            </p>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="docente-foro-pagination">
            <button
              type="button"
              className="docente-foro-pagination-btn"
              onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
              disabled={paginaActual === 1}
              aria-label="Página anterior"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                type="button"
                className={`docente-foro-pagination-btn ${
                  paginaActual === idx + 1 ? 'active' : ''
                }`}
                onClick={() => setPaginaActual(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              type="button"
              className="docente-foro-pagination-btn"
              onClick={() => setPaginaActual(Math.min(totalPages, paginaActual + 1))}
              disabled={paginaActual === totalPages}
              aria-label="Página siguiente"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </DocenteLayout>
  );
}
