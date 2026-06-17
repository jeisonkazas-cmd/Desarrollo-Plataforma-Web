import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DocenteLayout from '../components/DocenteLayout';
import { ArrowLeftIcon } from '../components/icons';
import '../../../styles/settings-panel.css';
import '../../../styles/docente.css';
import {
  fetchDocenteGrupo,
  fetchForoPractica,
  fetchPracticaDetalle,
  publicarMensajeForo,
} from '../services/docenteService';

const HILOS_POR_PAGINA = 5;

function getAutorInitials(nombre) {
  return String(nombre || 'Usuario')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase())
    .join('')
    .substring(0, 2);
}

function getRespuestas(hilo) {
  return hilo.respuestasItems || hilo.respuestasLista || [];
}

export default function Foro() {
  const navigate = useNavigate();
  const { grupoId, practicaId } = useParams();
  const [grupo, setGrupo] = useState({ nombre: 'Grupo', codigo: '' });
  const [practica, setPractica] = useState({ titulo: 'Práctica' });
  const [hilos, setHilos] = useState([]);
  const [nuevoHilo, setNuevoHilo] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [errorHilo, setErrorHilo] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('recientes');
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const reloadForo = async () => {
    const data = await fetchForoPractica(practicaId);
    setHilos(data || []);
  };

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setErrorHilo('');
        const [grupoData, practicaData, hilosData] = await Promise.all([
          fetchDocenteGrupo(grupoId),
          fetchPracticaDetalle(grupoId, practicaId),
          fetchForoPractica(practicaId),
        ]);

        if (!alive) return;
        setGrupo(grupoData || { nombre: 'Grupo', codigo: `Grupo ${grupoId}` });
        setPractica(practicaData || { titulo: 'Práctica' });
        setHilos(hilosData || []);
      } catch (err) {
        if (alive) setErrorHilo(err.message || 'No se pudo cargar el foro.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [grupoId, practicaId]);

  const hilosOrdenados = useMemo(() => {
    if (ordenamiento === 'populares') {
      return [...hilos].sort((a, b) => Number(b.respuestas || 0) - Number(a.respuestas || 0));
    }
    return [...hilos];
  }, [hilos, ordenamiento]);

  const totalPages = Math.max(1, Math.ceil(hilosOrdenados.length / HILOS_POR_PAGINA));
  const startIdx = (paginaActual - 1) * HILOS_POR_PAGINA;
  const hilosPaginados = hilosOrdenados.slice(startIdx, startIdx + HILOS_POR_PAGINA);

  const handlePublicar = async () => {
    if (!nuevoHilo.trim()) {
      setErrorHilo('Por favor escribe algo antes de publicar.');
      return;
    }

    try {
      setPublishing(true);
      setErrorHilo('');
      await publicarMensajeForo(practicaId, nuevoHilo);
      await reloadForo();
      setNuevoHilo('');
      setPaginaActual(1);
    } catch (err) {
      setErrorHilo(err.message || 'No se pudo publicar el mensaje.');
    } finally {
      setPublishing(false);
    }
  };

  const handleResponder = async (hiloId) => {
    if (!respuesta.trim()) {
      setErrorHilo('Escribe una respuesta antes de publicarla.');
      return;
    }

    try {
      setPublishing(true);
      setErrorHilo('');
      await publicarMensajeForo(practicaId, respuesta, hiloId);
      await reloadForo();
      setRespuesta('');
      setReplyingTo(null);
    } catch (err) {
      setErrorHilo(err.message || 'No se pudo publicar la respuesta.');
    } finally {
      setPublishing(false);
    }
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
            <span className="docente-breadcrumb-separator">&rsaquo;</span>
            <button type="button" className="docente-breadcrumb" onClick={() => navigate('/docente')}>
              Dashboard Docente
            </button>
            <span className="docente-breadcrumb-separator">&rsaquo;</span>
            <button type="button" className="docente-breadcrumb" onClick={() => navigate('/docente/grupos')}>
              Grupos
            </button>
            <span className="docente-breadcrumb-separator">&rsaquo;</span>
            <span className="docente-breadcrumb-current">Foro</span>
          </div>
        </div>
      }
    >
      <div className="docente-foro-container">
        <div className="docente-foro-header">
          <div>
            <h1 className="docente-foro-title">Foro - {practica.titulo}</h1>
            <p className="docente-foro-subtitle">{grupo.nombre} - {grupo.codigo}</p>
          </div>
          <button
            type="button"
            className="docente-foro-back-btn"
            onClick={() => navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`)}
          >
            <ArrowLeftIcon size={18} />
            Volver a informes
          </button>
        </div>

        <div className="docente-foro-create-post">
          <div className="docente-foro-avatar">
            <span className="docente-foro-avatar-initials">DO</span>
          </div>
          <div className="docente-foro-create-content">
            <textarea
              value={nuevoHilo}
              onChange={(event) => {
                setNuevoHilo(event.target.value);
                if (event.target.value.trim()) setErrorHilo('');
              }}
              placeholder="Escribe una pregunta, aclaración o anuncio para el grupo..."
              className="docente-foro-textarea"
              aria-label="Crear publicación"
            />
            <div className="docente-foro-create-footer">
              <div className="docente-foro-tools" />
              <button
                type="button"
                className="docente-foro-publish-btn"
                onClick={handlePublicar}
                disabled={publishing}
              >
                Publicar
              </button>
            </div>
            {errorHilo && <p className="docente-foro-error">{errorHilo}</p>}
          </div>
        </div>

        <div className="docente-foro-section-header">
          <h3 className="docente-foro-section-title">Discusiones recientes</h3>
          <div className="docente-foro-sort-control">
            <label className="docente-foro-sort-label">Ordenar por:</label>
            <select
              value={ordenamiento}
              onChange={(event) => {
                setOrdenamiento(event.target.value);
                setPaginaActual(1);
              }}
              className="docente-foro-sort-select"
              aria-label="Ordenar discusiones"
            >
              <option value="recientes">Más recientes</option>
              <option value="populares">Más respondidas</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="docente-foro-empty-state">
            <p>Cargando foro...</p>
          </div>
        ) : hilosPaginados.length > 0 ? (
          <div className="docente-foro-threads-list">
            {hilosPaginados.map((hilo) => {
              const respuestas = getRespuestas(hilo);
              return (
                <article key={hilo.id} className="docente-foro-thread-card">
                  <div className="docente-foro-thread-header">
                    <div className="docente-foro-thread-avatar">
                      <span className="docente-foro-avatar-initials">
                        {getAutorInitials(hilo.autorNombre)}
                      </span>
                    </div>

                    <div className="docente-foro-thread-info">
                      <div className="docente-foro-thread-author-info">
                        <span className="docente-foro-author-name">{hilo.autorNombre}</span>
                        <span className={`docente-foro-role-badge docente-foro-role-${hilo.autorRol}`}>
                          {hilo.autorRol === 'docente' ? 'Docente' : 'Estudiante'}
                        </span>
                        <span className="docente-foro-separator">•</span>
                        <span className="docente-foro-timestamp">{hilo.tiempoPublicacion}</span>
                      </div>

                      <h4 className="docente-foro-thread-title">{hilo.titulo}</h4>
                      <p className="docente-foro-thread-preview">{hilo.contenido || hilo.preview}</p>

                      <div className="docente-foro-thread-footer">
                        <div className="docente-foro-thread-stats">
                          <div className="docente-foro-stat">
                            <span className="docente-foro-stat-value">{respuestas.length} respuestas</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="docente-foro-see-discussion-btn"
                          onClick={() => {
                            setReplyingTo(replyingTo === hilo.id ? null : hilo.id);
                            setRespuesta('');
                            setErrorHilo('');
                          }}
                        >
                          Responder
                        </button>
                      </div>

                      {respuestas.length > 0 && (
                        <div className="docente-foro-replies">
                          {respuestas.map((item) => (
                            <div key={item.id} className="docente-foro-reply">
                              <div className="docente-foro-reply-meta">
                                <strong>{item.autorNombre}</strong>
                                <span>{item.autorRol === 'docente' ? 'Docente' : 'Estudiante'}</span>
                                <span>{item.tiempoPublicacion}</span>
                              </div>
                              <p>{item.contenido}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {replyingTo === hilo.id && (
                        <div className="docente-foro-reply-form">
                          <textarea
                            value={respuesta}
                            onChange={(event) => setRespuesta(event.target.value)}
                            className="docente-foro-textarea docente-foro-reply-textarea"
                            placeholder="Escribe tu respuesta para este hilo..."
                          />
                          <div className="docente-foro-reply-actions">
                            <button
                              type="button"
                              className="docente-foro-back-btn"
                              onClick={() => {
                                setReplyingTo(null);
                                setRespuesta('');
                              }}
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              className="docente-foro-publish-btn"
                              onClick={() => handleResponder(hilo.id)}
                              disabled={publishing}
                            >
                              Publicar respuesta
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="docente-foro-empty-state">
            <h3 className="docente-foro-empty-title">Sin publicaciones aún</h3>
            <p className="docente-foro-empty-subtitle">Sé el primero en publicar algo para el grupo.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="docente-foro-pagination">
            <button
              type="button"
              className="docente-foro-pagination-btn"
              onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
              disabled={paginaActual === 1}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                type="button"
                className={`docente-foro-pagination-btn ${paginaActual === idx + 1 ? 'active' : ''}`}
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
            >
              ›
            </button>
          </div>
        )}
      </div>
    </DocenteLayout>
  );
}
