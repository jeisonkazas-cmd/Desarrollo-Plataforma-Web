import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import "../../styles/docente.css";

export default function InformeDetalle() {
  const { idInforme } = useParams();
  const navigate = useNavigate();

  const [info, setInfo] = useState(null);
  const [nota, setNota] = useState("");
  const [retro, setRetro] = useState("");
  const [saving, setSaving] = useState(false);

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

        // Precargar nota y retro si existen
        if (data.nota !== null && data.nota !== undefined) {
          setNota(String(data.nota));
        }
        if (data.retroalimentacion) {
          setRetro(data.retroalimentacion);
        }
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, [idInforme]);

  if (!info) return <div className="p-4 text-center">Cargando…</div>;

  const handleEnviar = async () => {
    try {
      setSaving(true);

      // Convertir la nota a número por si viene como string
      const notaNum =
        nota === "" ? null : parseFloat(nota.replace(",", "."));

      if (notaNum === null || Number.isNaN(notaNum)) {
        alert("Por favor ingresa una nota válida (ej: 4.5)");
        setSaving(false);
        return;
      }

      await fetch(
        `http://localhost:3000/api/informes/${idInforme}/calificar`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nota: notaNum, retroalimentacion: retro }),
        }
      );

      navigate(-1);
    } catch (err) {
      console.error("Error al guardar calificación", err);
      alert("Ocurrió un error al guardar la calificación");
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="docente-header-title">{info.nombre_estudiante}</h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="docente-main">
        <div className="docente-informe-detail">
          <div className="docente-informe-section">
            <label className="docente-informe-label">Informe</label>
            {info.archivo_url ? (
              <a
                href={`http://localhost:3000${info.archivo_url}`}
                target="_blank"
                rel="noreferrer"
                className="docente-informe-link"
              >
                ↓ Descargar
              </a>
            ) : (
              <p className="text-xs text-muted-foreground">
                Este informe no tiene archivo adjunto.
              </p>
            )}
          </div>

          <div className="docente-informe-section">
            <label className="docente-informe-label">Nota</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="docente-form-input"
              placeholder="Ingrese la nota (0.0 - 5.0)"
            />
          </div>

          <div className="docente-informe-section">
            <label className="docente-informe-label">Retroalimentación</label>
            <textarea
              className="docente-form-textarea"
              value={retro}
              onChange={(e) => setRetro(e.target.value)}
              placeholder="Escriba comentarios para el estudiante"
              rows={5}
            />
          </div>

          <div className="docente-form-buttons">
            <button
              onClick={() => navigate(-1)}
              className="docente-form-button"
            >
              Cancelar
            </button>
            <button
              onClick={handleEnviar}
              disabled={saving}
              className="docente-form-button-primary"
            >
              {saving ? "Guardando..." : "Enviar"}
            </button>
          </div>
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
