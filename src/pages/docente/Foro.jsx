import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocenteLayout from './components/DocenteLayout';
import { ArrowLeftIcon, IconButton } from './components/icons';
import { fetchDocenteForoReciente } from './services/docenteService';

function initials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.[0] || '';
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
  return `${first}${second}`.toUpperCase();
}

export default function Foro() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchDocenteForoReciente();
        if (mounted) setPosts(data);
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'No se pudo cargar el foro.');
          setPosts([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DocenteLayout
      title="Foro / Chat"
      left={(
        <IconButton label="Volver" onClick={() => navigate('/dashboard/docente')}>
          <ArrowLeftIcon />
        </IconButton>
      )}
    >
      <div className="docente-welcome">
        <h2 className="docente-welcome-title">Foro del Laboratorio de Física</h2>
        <p className="docente-welcome-subtitle">
          Comparte dudas, resultados y aportes con tus compañeros.
        </p>
      </div>

      <div className="docente-foro-list">
        {loading && (
          <article className="docente-foro-item">
            <p className="docente-foro-text">Cargando mensajes del foro...</p>
          </article>
        )}

        {!loading && error && (
          <article className="docente-foro-item">
            <p className="docente-foro-text">{error}</p>
          </article>
        )}

        {!loading && !error && posts.length === 0 && (
          <article className="docente-foro-item">
            <p className="docente-foro-text">Aun no hay mensajes en los foros de tus practicas.</p>
          </article>
        )}

        {!loading && !error && posts.map((post) => (
          <article key={post.id} className="docente-foro-item">
            <header className="docente-foro-header">
              <div className="docente-foro-author" aria-label="Autor">
                <div className="docente-avatar" aria-hidden="true">
                  {initials(post.autorNombre)}
                </div>
                <div className="docente-foro-author-text">
                  <div className="docente-foro-author-name">{post.autorNombre}</div>
                  <div className="docente-foro-author-meta">{post.tiempoPublicacion}</div>
                </div>
              </div>

              <div className="docente-foro-right" aria-label="Contexto">
                <span className="docente-pill docente-pill-practica">{post.practica}</span>
                <span className="docente-badge" aria-label="Respuestas">
                  {post.respuestas || 0} resp.
                </span>
              </div>
            </header>
            <p className="docente-foro-text">{post.preview || post.contenido}</p>
          </article>
        ))}
      </div>
    </DocenteLayout>
  );
}
