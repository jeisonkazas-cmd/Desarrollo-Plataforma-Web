import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StudentBreadcrumb from './components/StudentBreadcrumb';
import { getForoPractica, publicarPostForo, getPracticaDetalle, getGrupoDetalle } from './services/estudianteService';
import '../../styles/estudiante.css';

export default function Foro() {
  const { practicaId, grupoId } = useParams();
  const [posts, setPosts] = useState([]);
  const [practica, setPractica] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nuevoContenido, setNuevoContenido] = useState('');

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      try {
        const practicaData = await getPracticaDetalle(practicaId);
        setPractica(practicaData);
        
        const grupoData = await getGrupoDetalle(grupoId);
        setGrupo(grupoData);
        
        const postsData = await getForoPractica(practicaId);
        setPosts(postsData || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, [practicaId, grupoId]);

  const handlePublicar = async () => {
    if (!nuevoContenido.trim()) {
      window.alert('Escribe algo antes de publicar');
      return;
    }

    try {
      await publicarPostForo(practicaId, nuevoContenido);
      setNuevoContenido('');
      window.alert('Publicado correctamente');
      // Recargar posts
      const data = await getForoPractica(practicaId);
      setPosts(data || []);
    } catch (error) {
      window.alert('Error al publicar');
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
          <p>Participa en discusiones, resuelve dudas y colabora con otros estudiantes</p>
        </div>
      </header>

      <section className="student-foro-main">
        <div className="student-foro-content">
          <section className="student-foro-composer">
            <div className="student-composer-header">
              <span className="student-composer-avatar">👤</span>
              <textarea
                className="student-composer-input"
                placeholder="Escribe una pregunta o comentario..."
                value={nuevoContenido}
                onChange={(e) => setNuevoContenido(e.target.value)}
              />
            </div>
            <button type="button" className="student-btn-publish" onClick={handlePublicar}>
              Publicar
            </button>
          </section>

          <section className="student-foro-posts">
            {loading ? (
              <p>Cargando foro...</p>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <article key={post.id} className="student-foro-post">
                  <div className="student-post-header">
                    <span className="student-post-avatar">{post.autorAvatar || '👤'}</span>
                    <div className="student-post-meta">
                      <strong>{post.autor}</strong>
                      <span className="student-post-role">
                        {post.rol === 'profesor' ? '👨‍🏫 Docente' : '👨‍🎓 Estudiante'}
                      </span>
                      <span className="student-post-time">{post.timestamp}</span>
                    </div>
                  </div>
                  <p className="student-post-content">{post.contenido}</p>
                  <div className="student-post-footer">
                    <span>👁 {post.visitas} vistas</span>
                    <span>💬 {post.respuestas} respuestas</span>
                    {post.id && (
                      <button type="button" className="student-btn-see-discussion">
                        Ver discusión
                      </button>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <p className="student-empty-state">No hay posts aún. ¡Sé el primero en comentar!</p>
            )}
          </section>
        </div>

        <aside className="student-foro-sidebar">
          <section className="student-sidebar-card">
            <h3>Normas del foro</h3>
            <ul className="student-forum-rules">
              <li>Publica preguntas claras y concisas</li>
              <li>Cita siempre que sea necesario</li>
              <li>Exta lenguaje ofensivo o despectivo</li>
              <li>Una etiquetas para indicar nivel de dificultad</li>
            </ul>
          </section>

          <section className="student-sidebar-card">
            <h3>Recomendaciones</h3>
            <p>Consulta primero los temas ya publicados antes de hacer preguntas nuevas.</p>
          </section>

          <section className="student-sidebar-card">
            <h3>Recursos útiles</h3>
            <ul className="student-resources">
              <li>
                📄{' '}
                <button type="button" className="student-resource-link">
                  Apuntes: Ley de Ohm (PDF)
                </button>
              </li>
              <li>
                🎥{' '}
                <button type="button" className="student-resource-link">
                  Tutorial: Medición de corriente (Video)
                </button>
              </li>
            </ul>
          </section>
        </aside>
      </section>
    </div>
  );
}
