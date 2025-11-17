import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/estudiante.css";

function parseNota(nota) {
  if (nota === null || nota === undefined) return null;
  if (typeof nota === "number") return nota;

  const parsed = parseFloat(nota);
  if (isNaN(parsed)) return null;
  return parsed;
}

function getCardColor(notaNum) {
  if (notaNum === null) {
    // Sin nota
    return "border-gray-300 bg-white";
  }

  if (notaNum < 3.0) {
    return "border-red-400 bg-red-50";
  } else if (notaNum < 4.0) {
    return "border-yellow-400 bg-yellow-50";
  } else {
    return "border-green-400 bg-green-50";
  }
}

export default function InformesList() {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/mis-informes", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("No se pudo cargar informes");
        const data = await res.json();
        setInformes(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus informes");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <p className="text-muted-foreground">Cargando informes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
          <h1 className="estudiante-header-title">Mis informes</h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="estudiante-main">
        <div className="estudiante-welcome">
          <h2 className="estudiante-welcome-title">Informes</h2>
          <p className="estudiante-welcome-subtitle">Lista de informes</p>
        </div>

        {informes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Aún no has entregado informes.
          </p>
        ) : (
          <div className="estudiante-informes-list">
            {informes.map((inf) => {
              const notaNum = parseNota(inf.nota);
              const cardColor = getCardColor(notaNum);
              const notaLabel =
                notaNum !== null ? notaNum.toFixed(1) : "Sin nota";

              return (
                <button
                  key={inf.id_informe}
                  className={`estudiante-informe-item ${cardColor}`}
                  onClick={() =>
                    navigate(`/estudiante/informes/${inf.id_informe}`)
                  }
                >
                  <div className="estudiante-informe-content">
                    <h3 className="estudiante-informe-title">
                      {inf.titulo || inf.titulo_practica}
                    </h3>
                    <p className="estudiante-informe-meta">
                      {new Date(inf.fecha_entrega).toLocaleString("es-CO")}
                    </p>
                  </div>

                  <div className="estudiante-informe-nota">
                    <span className="estudiante-informe-nota-label">Nota</span>
                    <span className={`estudiante-informe-nota-valor ${notaNum !== null ? (notaNum >= 4 ? 'success' : notaNum >= 3 ? 'warning' : 'error') : ''}`}>
                      {notaLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
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
