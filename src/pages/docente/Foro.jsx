import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/docente.css";

function Foro() {
  const navigate = useNavigate();

  const posts = [
    {
      id: 1,
      practica: "Práctica 1: \"XXXXXXX\"",
      autor: "Sleydier Díaz",
      tiempo: "Hace 2 h",
      respuestas: 3,
      texto:
        "¿Alguien sabe cómo calcular la constante de tiempo? Tengo varias dudas y no he podido resolverlo.",
    },
    {
      id: 2,
      practica: "Práctica 2: \"XXXXXXX\"",
      autor: "Jeyson Arenas",
      tiempo: "Hace un momento",
      respuestas: 0,
      texto:
        "Subo mi gráfica, ¿pueden revisarla? No estoy completamente seguro de cómo debe quedar.",
    },
  ];

  return (
    <div className="docente-container">
      {/* HEADER */}
      <header className="docente-header">
        <div className="docente-header-left">
          <button
            onClick={() => navigate(-1)}
            className="docente-header-button"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="docente-header-title">Foro / Chat</h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="docente-main">
        <div className="docente-welcome">
          <h2 className="docente-welcome-title">Foro del Laboratorio de Física</h2>
          <p className="docente-welcome-subtitle">
            Comparte tus dudas, resultados y aportes con tus compañeros.
          </p>
        </div>

        <div className="docente-foro-list">
          {posts.map((post) => (
            <div
              key={post.id}
              className="docente-foro-item"
            >
              <div className="docente-foro-header">
                <span className="docente-foro-practica">{post.practica}</span>
              </div>
              <p className="docente-foro-text">{post.texto}</p>
              <div className="docente-foro-footer">
                <span className="docente-foro-meta">{post.autor}</span>
                <span className="docente-foro-meta">·</span>
                <span className="docente-foro-meta">{post.tiempo}</span>
                <span className="docente-foro-meta">·</span>
                <span className="docente-foro-meta">{post.respuestas} respuestas</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="docente-footer">
        <div className="docente-footer-content">
          <img src="/UNIAJC.png" alt="Logo UNIAJC" className="docente-footer-logo" />
          <p className="docente-footer-text">
            © 2025 Plataforma Docente. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Foro;
