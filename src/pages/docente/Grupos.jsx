import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../../styles/docente.css";

export default function TeacherGrupos() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:3000/api/user/mis-cursos", { credentials: "include" });
      const data = await res.json();
      setCursos(data);
    };
    load();
  }, []);

  return (
    <div className="docente-container">
      {/* HEADER */}
      <header className="docente-header">
        <div className="docente-header-left">
          <button
            onClick={() => navigate("/docente")}
            className="docente-header-button"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="docente-header-title">Prácticas</h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="docente-main">
        <div className="docente-welcome">
          <h2 className="docente-welcome-title">Prácticas</h2>
          <p className="docente-welcome-subtitle">Grupos:</p>
        </div>

        <div className="docente-grupos-list">
          {cursos.map(curso => (
            <button
              key={curso.id_curso}
              onClick={() => navigate(`/docente/grupo/${curso.id_curso}/practicas`)}
              className="docente-grupos-item"
            >
              {curso.codigo}
            </button>
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
