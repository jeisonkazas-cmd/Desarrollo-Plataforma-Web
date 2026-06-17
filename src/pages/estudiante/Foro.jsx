import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentBreadcrumb from './components/StudentBreadcrumb';
import { getForoPractica, getGrupoDetalle, getPracticaDetalle, publicarPostForo } from './services/estudianteService';
import '../../styles/estudiante.css';

function getRespuestas(post) {
  return post.respuestasItems || post.respuestasLista || [];
}

function getInitials(nombre) {
  return String(nombre || 'Usuario')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}

export default function Foro() {
  const { practicaId, grupoId } = useParams();
  const [posts, setPosts] = useState([]);
  const [practica, setPractica] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nuevoContenido, setNuevoContenido] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const reloadForo = async () => {
    const data = await getForoPractica(practicaId);
    setPosts(data || []);
  };

  useEffect(() => {
    let alive = true;

    const fetchDatos = async () => {
      setLoading(true);
      setError('');
      try {
        const [practicaData, grupoData, postsData] = await Promise.all([
          getPracticaDetalle(practicaId),
          getGrupoDetalle(grupoId),
          getForoPractica(practicaId),
        ]);

        if (!alive) return;
        setPractica(practicaData);
        setGrupo(grupoData);
        setPosts(postsData || []);
      } catch (err) {
        if (alive) setError(err.message || 'No se pudo cargar el foro.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchDatos();

    return () => {
      alive = false;
    };
  }, [practicaId, grupoId]);

  const totalRespuestas = useMemo(
    () => posts.reduce((total, post) => total + getRespuestas(post).length, 0),
    [posts]
  );

  const handlePublicar = async () => {
    if (!nuevoContenido.trim()) {
      setError('Escribe algo antes de publicar.');
      return;
    }

    try {
      setPublishing(true);
      setError('');
      await publicarPostForo(practicaId, nuevoContenido);
      setNuevoContenido('');
      await reloadForo();
    } catch (err) {
      setError(err.message || 'Error al publicar.');
    } finally {
      setPublishing(false);
    }
  };

  const handleResponder = async (postId) => {
    if (!respuesta.trim()) {
      setError('Escribe una respuesta antes de publicarla.');
      return;
    }

    try {
      setPublishing(true);
      setError('');
      await publicarPostForo(practicaId, respuesta, postId);
      setRespuesta('');
      setReplyingTo(null);
      await reloadForo();
    } catch (err) {
      setError(err.message || 'No se pudo publicar la respuesta.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="student-foro-page">
      <StudentBreadcrumb
        items={[
          { label: 'Inicio', href: '/dashboard/estudiante' },
          { label: grupo?.nombre || 'Grupo', href: grupoId ? `/estudiante/grupos/${grupoId}/practicas` : '/dashboard/estudiante' },
          { label: 'Prácticas del grupo', href: grupoId ? `/estudiante/grupos/${grupoId}/practicas` : '/dashboard/estudiante' },
          { label: practica?.titulo || 'Práctica', href: `/estudiante/practicas/${practicaId}` },
          { label: 'Foro' },
        ]}
      />

      <header className="student-page-header">
        <div>
          <h1>Foro - {practica?.titulo || 'Práctica'}</h1>
          <p>Participa en discusiones, resuelve dudas y colabora con tu grupo.</p>
        </div>
      </header>

      <section className="student-foro-main">
        <div className="student-foro-content">
          <section className="student-foro-composer">
            <div className="student-composer-header">
              <span className="student-composer-avatar">YO</span>
              <textarea
                className="student-composer-input"
                placeholder="Escribe una pregunta o comentario..."
                value={nuevoContenido}
                onChange={(event) => {
                  setNuevoContenido(event.target.value);
                  if (event.target.value.trim()) setError('');
                }}
              />
            </div>
            <button type="button" className="student-btn-publish" onClick={handlePublicar} disabled={publishing}>
              Publicar
            </button>
            {error && <p className="student-foro-error">{error}</p>}
          </section>

          <section className="student-foro-posts">
            {loading ? (
              <p>Cargando foro...</p>
            ) : posts.length > 0 ? (
              posts.map((post) => {
                const respuestas = getRespuestas(post);
                return (
                  <article key={post.id} className="student-foro-post">
                    <div className="student-post-header">
                      <span className="student-post-avatar">{getInitials(post.autorNombre || post.autor)}</span>
                      <div className="student-post-meta">
                        <strong>{post.autorNombre || post.autor}</strong>
                        <span className="student-post-role">
                          {post.rol === 'profesor' || post.autorRol === 'docente' ? 'Docente' : 'Estudiante'}
                        </span>
                        <span className="student-post-time">{post.timestamp || post.tiempoPublicacion}</span>
                      </div>
                    </div>
                    <h3 className="student-post-title">{post.titulo}</h3>
                    <p className="student-post-content">{post.contenido}</p>
                    <div className="student-post-footer">
                      <span>{respuestas.length} respuestas</span>
                      <button
                        type="button"
                        className="student-btn-see-discussion"
                        onClick={() => {
                          setReplyingTo(replyingTo === post.id ? null : post.id);
                          setRespuesta('');
                          setError('');
                        }}
                      >
                        Responder
                      </button>
                    </div>

                    {respuestas.length > 0 && (
                      <div className="student-foro-replies">
                        {respuestas.map((item) => (
                          <div key={item.id} className="student-foro-reply">
                            <div className="student-reply-meta">
                              <strong>{item.autorNombre || item.autor}</strong>
                              <span>{item.autorRol === 'docente' ? 'Docente' : 'Estudiante'}</span>
                              <span>{item.timestamp || item.tiempoPublicacion}</span>
                            </div>
                            <p>{item.contenido}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {replyingTo === post.id && (
                      <div className="student-reply-form">
                        <textarea
                          className="student-composer-input"
                          value={respuesta}
                          onChange={(event) => setRespuesta(event.target.value)}
                          placeholder="Escribe tu respuesta..."
                        />
                        <div className="student-reply-actions">
                          <button
                            type="button"
                            className="student-btn-secondary"
                            onClick={() => {
                              setReplyingTo(null);
                              setRespuesta('');
                            }}
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            className="student-btn-publish"
                            onClick={() => handleResponder(post.id)}
                            disabled={publishing}
                          >
                            Publicar respuesta
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <p className="student-empty-state">No hay publicaciones aún. Sé el primero en comentar.</p>
            )}
          </section>
        </div>

        <aside className="student-foro-sidebar">
          <section className="student-sidebar-card">
            <h3>Actividad</h3>
            <p>{posts.length} publicaciones</p>
            <p>{totalRespuestas} respuestas</p>
          </section>

          <section className="student-sidebar-card">
            <h3>Normas del foro</h3>
            <ul className="student-forum-rules">
              <li>Publica preguntas claras y concisas.</li>
              <li>Mantén el respeto en las respuestas.</li>
              <li>Revisa si tu duda ya fue respondida.</li>
              <li>Comparte datos útiles de tu simulación o informe.</li>
            </ul>
          </section>
        </aside>
      </section>
    </div>
  );
}
