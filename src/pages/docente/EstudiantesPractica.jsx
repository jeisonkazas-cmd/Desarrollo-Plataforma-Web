import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import "../../styles/docente.css";

export default function PracticaEstudiantes() {
  const { idPractica } = useParams();
  const navigate = useNavigate();
  const [informes, setInformes] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://localhost:3000/api/practicas/${idPractica}/informes`, {
        credentials: "include",
      });
      const data = await res.json();
      setInformes(data);
    };

    load();
  }, [idPractica]);

  return (
    <div className="docente-container">
      {/* HEADER */}
      <header className="docente-header">
        <div className="docente-header-left">
          <button
            onClick={() => navigate(`/docente/practicas`)}
            className="docente-header-button"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="docente-header-title">Práctica 1: "XXXXXX"</h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="docente-main">
        <div className="docente-welcome">
          <h2 className="docente-welcome-title">Listado de estudiantes</h2>
        </div>

        <div className="docente-grupos-list">
          {informes.map(info => (
            <button
              key={info.id_informe}
              onClick={() =>
                navigate(`/docente/estudiante/${info.id_usuario}/informe/${info.id_informe}`)
              }
              className="docente-grupos-item"
            >
              {info.nombre}
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
