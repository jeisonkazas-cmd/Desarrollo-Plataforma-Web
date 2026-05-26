import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DocenteLayout from './components/DocenteLayout';
import { ArrowLeftIcon, IconButton } from './components/icons';
import { getMockPosts } from '../../mock/docenteMock';

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
  const posts = useMemo(() => getMockPosts(), []);

  return (
    <DocenteLayout
      title="Foro / Chat"
      left={(
        <IconButton label="Volver" onClick={() => navigate(-1)}>
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
        {posts.map((post) => (
          <article key={post.id} className="docente-foro-item">
            <header className="docente-foro-header">
              <div className="docente-foro-author" aria-label="Autor">
                <div className="docente-avatar" aria-hidden="true">
                  {initials(post.autor)}
                </div>
                <div className="docente-foro-author-text">
                  <div className="docente-foro-author-name">{post.autor}</div>
                  <div className="docente-foro-author-meta">{post.tiempo}</div>
                </div>
              </div>

              <div className="docente-foro-right" aria-label="Contexto">
                <span className="docente-pill docente-pill-practica">{post.practica}</span>
                <span className="docente-badge" aria-label="Respuestas">
                  {post.respuestas} resp.
                </span>
              </div>
            </header>
            <p className="docente-foro-text">{post.texto}</p>
          </article>
        ))}
      </div>
    </DocenteLayout>
  );
}
