import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import "../../styles/docente.css";

export default function GrupoPracticas() {
  const { idGrupo } = useParams();
  const navigate = useNavigate();
  const [practicas, setPracticas] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:3000/api/practicas", { credentials: "include" });
      let data = await res.json();
      // Filtrar por id_curso
      data = data.filter(p => String(p.id_curso) === String(idGrupo));
      setPracticas(data);
    };

    load();
  }, [idGrupo]);

  return (
    <div className="docente-container">
      {/* HEADER */}
      <header className="docente-header">
        <div className="docente-header-left">
          <button
            onClick={() => navigate("/docente/practicas")}
            className="docente-header-button"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="docente-header-title">FISICA 1 3303A</h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="docente-main">
        <div className="docente-welcome">
          <h2 className="docente-welcome-title">Prácticas</h2>
          <p className="docente-welcome-subtitle">Lista de prácticas</p>
        </div>

        <div className="docente-grupos-list">
          {practicas.map(p => (
            <button
              key={p.id_practica}
              onClick={() => navigate(`/docente/practicas/${p.id_practica}`)}
              className="docente-grupos-item"
            >
              {p.titulo}
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
