import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/estudiante.css";

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
    <div className="estudiante-container">
      {/* HEADER */}
      <header className="estudiante-header">
        <div className="estudiante-header-left">
          <button
            onClick={() => navigate(-1)}
            className="estudiante-header-button"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="estudiante-header-title">Foro / Chat</h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="estudiante-main">
        <div className="estudiante-welcome">
          <h2 className="estudiante-welcome-title">Foro del Laboratorio de Física</h2>
          <p className="estudiante-welcome-subtitle">
            Comparte tus dudas, resultados y aportes con tus compañeros.
          </p>
        </div>

        <div className="estudiante-foro-list">
          {posts.map((post) => (
            <div
              key={post.id}
              className="estudiante-foro-item"
            >
              <div className="estudiante-foro-header">
                <span className="estudiante-foro-practica">{post.practica}</span>
              </div>
              <p className="estudiante-foro-text">{post.texto}</p>
              <div className="estudiante-foro-footer">
                <span className="estudiante-foro-meta">{post.autor}</span>
                <span className="estudiante-foro-meta">·</span>
                <span className="estudiante-foro-meta">{post.tiempo}</span>
                <span className="estudiante-foro-meta">·</span>
                <span className="estudiante-foro-meta">{post.respuestas} respuestas</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="estudiante-footer">
        <div className="estudiante-footer-content">
          <img src="/UNIAJC.png" alt="Logo UNIAJC" className="estudiante-footer-logo" />
          <p className="estudiante-footer-text">
            © 2025 Plataforma Educativa. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Foro;
