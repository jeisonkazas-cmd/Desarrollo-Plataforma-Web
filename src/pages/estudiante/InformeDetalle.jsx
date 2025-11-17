import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import "../../styles/estudiante.css";

// Helper para convertir nota (string/null) a número
function parseNota(nota) {
  if (nota === null || nota === undefined) return null;
  if (typeof nota === "number") return nota;

  const parsed = parseFloat(nota);
  if (isNaN(parsed)) return null;
  return parsed;
}

export default function InformeDetalleEst() {
  const { idInforme } = useParams();
  const navigate = useNavigate();

  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/informes/${idInforme}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("No se pudo cargar el informe");
        const data = await res.json();
        setInfo(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [idInforme]);

  if (loading || !info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <p className="text-muted-foreground">Cargando informe…</p>
      </div>
    );
  }

  // Aquí ya NO usamos info.nota.toFixed directamente
  const notaNum = parseNota(info.nota);
  const notaLabel =
    notaNum !== null ? notaNum.toFixed(1) : "Sin nota aún";

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
          <h1 className="estudiante-header-title">Detalle del informe</h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="estudiante-main">
        <div className="estudiante-detail-container">
          {/* Título práctica / estudiante */}
          <section className="estudiante-detail-section">
            <h2 className="estudiante-detail-title">
              {info.titulo_practica || info.titulo || "Informe"}
            </h2>
            <p className="estudiante-detail-meta">
              Estudiante: {info.nombre_estudiante}
            </p>
            <p className="estudiante-detail-meta">
              Entregado:{" "}
              {info.fecha_entrega
                ? new Date(info.fecha_entrega).toLocaleString("es-CO")
                : "—"}
            </p>
          </section>

          {/* Nota */}
          <section className="estudiante-detail-card">
            <div className="estudiante-detail-card-header">
              <h3 className="estudiante-detail-card-title">Nota</h3>
            </div>
            <div className="estudiante-detail-card-body">
              <div className={`estudiante-detail-nota-display ${notaNum !== null ? (notaNum >= 4 ? 'success' : notaNum >= 3 ? 'warning' : 'error') : ''}`}>
                {notaLabel}
              </div>
              <p className="estudiante-detail-meta">
                Estado: {info.estado}
              </p>
            </div>
          </section>

          {/* Retroalimentación */}
          <section className="estudiante-detail-card">
            <div className="estudiante-detail-card-header">
              <h3 className="estudiante-detail-card-title">Retroalimentación</h3>
            </div>
            <div className="estudiante-detail-card-body">
              {info.retroalimentacion ? (
                <p className="estudiante-detail-feedback">
                  {info.retroalimentacion}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aún no hay retroalimentación del docente.
                </p>
              )}
            </div>
          </section>

          {/* Archivo */}
          <section className="estudiante-detail-card">
            <div className="estudiante-detail-card-header">
              <h3 className="estudiante-detail-card-title">Archivo del informe</h3>
            </div>
            <div className="estudiante-detail-card-body">
              {info.archivo_url ? (
                <a
                  href={`http://localhost:3000${info.archivo_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="estudiante-detail-link"
                >
                  Descargar informe
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay archivo adjunto para este informe.
                </p>
              )}
            </div>
          </section>
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
