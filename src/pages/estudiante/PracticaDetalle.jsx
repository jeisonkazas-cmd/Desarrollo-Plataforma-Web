import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Play, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import "../../styles/estudiante.css";

function PracticaDetalle() {
  const { idPractica } = useParams();
  const navigate = useNavigate();

  const [practica, setPractica] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [tituloInforme, setTituloInforme] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/practicas/${idPractica}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Error cargando práctica");
        const data = await res.json();
        setPractica(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la práctica");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [idPractica]);

  const config = practica?.configuracion_simulacion || {};

  const handleUploadInforme = async () => {
    setError(null);
    setSuccessMsg(null);

    if (!file) {
      setError("Debes seleccionar un PDF");
      return;
    }

    setSubmitting(true);

    try {
      // 1) Subir PDF
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(
        "http://localhost:3000/api/practicas/upload-pdf",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!uploadRes.ok) throw new Error("Error al subir el PDF");
      const uploadData = await uploadRes.json();

      // 2) Crear informe
      const body = {
        titulo: tituloInforme || practica.titulo,
        archivo_url: uploadData.url,
        contenido_texto: null,
      };

      const informeRes = await fetch(
        `http://localhost:3000/api/practicas/${idPractica}/informes`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!informeRes.ok) throw new Error("Error al guardar el informe");

      setSuccessMsg("Informe subido correctamente");
      // volver al dashboard
      setTimeout(() => navigate("/estudiante/practicas"), 1000);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al subir el informe");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <p className="text-muted-foreground">Cargando práctica…</p>
      </div>
    );
  }

  if (!practica) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <p className="text-red-500">{error || "Práctica no encontrada"}</p>
      </div>
    );
  }

  return (
    <div className="estudiante-container">
      {/* HEADER */}
      <header className="estudiante-header">
        <div className="estudiante-header-left">
          <button
            onClick={() => navigate("/estudiante/practicas")}
            className="estudiante-header-button"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="estudiante-header-title">{practica.titulo}</h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="estudiante-main">
        <div className="estudiante-detail-container">
          {/* Imagen simulador */}
          <div className="estudiante-detail-image">
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Simulador (imagen por defecto)
            </span>
          </div>

          {/* Descripción */}
          <section className="estudiante-detail-card">
            <div className="estudiante-detail-card-header">
              <h3 className="estudiante-detail-card-title">Descripción</h3>
            </div>
            <div className="estudiante-detail-card-body">
              <p className="estudiante-detail-feedback">
                {practica.descripcion || "Sin descripción"}
              </p>
            </div>
          </section>

          {/* Objetivo */}
          <section className="estudiante-detail-card">
            <div className="estudiante-detail-card-header">
              <h3 className="estudiante-detail-card-title">Objetivo</h3>
            </div>
            <div className="estudiante-detail-card-body">
              <p className="estudiante-detail-feedback">
                {config.objetivo || "Sin objetivo definido"}
              </p>
            </div>
          </section>

          {/* Duración */}
          <section className="estudiante-detail-card">
            <div className="estudiante-detail-card-header">
              <h3 className="estudiante-detail-card-title">Duración</h3>
            </div>
            <div className="estudiante-detail-card-body">
              <p className="estudiante-detail-meta">
                {config.duracion || "No especificada"}
              </p>
            </div>
          </section>

          {/* Botón iniciar simulación */}
          <button
            type="button"
            className="estudiante-button estudiante-button-primary"
            onClick={() => alert("Simulación próximamente")}
          >
            <Play className="w-4 h-4" />
            Iniciar simulación
          </button>

          {/* Subir informe */}
          <section className="estudiante-detail-card">
            <div className="estudiante-detail-card-header">
              <h3 className="estudiante-detail-card-title">Subir informe</h3>
            </div>
            <div className="estudiante-detail-card-body">
              <input
                type="text"
                className="estudiante-detail-input"
                placeholder="Título del informe (opcional)"
                value={tituloInforme}
                onChange={(e) => setTituloInforme(e.target.value)}
              />

              <label className="estudiante-detail-file-label">
                <UploadCloud className="w-4 h-4" />
                <span>{file ? file.name : "Seleccionar PDF…"}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {successMsg && (
                <p className="text-sm text-green-600">{successMsg}</p>
              )}

              <button
                type="button"
                disabled={submitting}
                onClick={handleUploadInforme}
                className="estudiante-button estudiante-button-primary"
              >
                {submitting ? "Subiendo…" : "Subir informe"}
              </button>
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

export default PracticaDetalle;
