import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Image as ImageIcon,
  UploadCloud,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/docente.css";

function CrearPractica() {
  const navigate = useNavigate();

  // Vistas internas: lista de simulaciones, formulario, selector de simulación
  const [view, setView] = useState("list"); // "list" | "form" | "chooseSim"

  // Prácticas ya creadas (para la primera pantalla)
  const [practicas, setPracticas] = useState([]);
  const [loadingPracticas, setLoadingPracticas] = useState(false);
  const [errorPracticas, setErrorPracticas] = useState(null);

  // Datos de la nueva práctica
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [duracion, setDuracion] = useState("");
  const [selectedSim, setSelectedSim] = useState(null); // {id, nombre, color} etc.
  const [pdfFile, setPdfFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [errorSave, setErrorSave] = useState(null);

  // Simulaciones “plantilla” (mock estático)
  const simulacionesDisponibles = [
    {
      id: "mru",
      nombre: "Movimiento Rectilíneo Uniforme (MRU)",
      descripcion: "Objeto con velocidad constante.",
    },
    {
      id: "mrua",
      nombre: "Movimiento Rectilíneo Uniformemente Acelerado",
      descripcion: "Aceleración constante.",
    },
    {
      id: "caida",
      nombre: "Caída libre",
      descripcion: "Cuerpo en caída bajo gravedad.",
    },
    {
      id: "tiro",
      nombre: "Tiro parabólico",
      descripcion: "Movimiento en dos dimensiones.",
    },
  ];

  // Cargar prácticas ya creadas para la vista “Simulaciones”
  useEffect(() => {
    const fetchPracticas = async () => {
      setLoadingPracticas(true);
      setErrorPracticas(null);

      try {
        const res = await fetch("http://localhost:3000/api/practicas", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("No se pudieron cargar las prácticas");
        }

        const data = await res.json();
        setPracticas(data);
      } catch (err) {
        console.error(err);
        setErrorPracticas("Error al cargar las prácticas existentes");
      } finally {
        setLoadingPracticas(false);
      }
    };

    fetchPracticas();
  }, []);

  // Manejar selección de PDF (botón “Subir”)
  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  // Guardar práctica (botón “Guardar”)
    const handleGuardarPractica = async () => {
    setErrorSave(null);

    if (!titulo) {
        setErrorSave("El título de la práctica es obligatorio");
        return;
    }

    setSaving(true);

    try {
        let pdfUrl = null;
        let pdfFilename = null;

        // 1) Si hay PDF, subirlo primero
        if (pdfFile) {
        const formData = new FormData();
        formData.append("file", pdfFile);

        const uploadRes = await fetch(
            "http://localhost:3000/api/practicas/upload-pdf",
            {
            method: "POST",
            credentials: "include",
            body: formData,
            }
        );

        if (!uploadRes.ok) {
            throw new Error("Error al subir el PDF");
        }

        const uploadData = await uploadRes.json();
        pdfUrl = uploadData.url;          // /uploads/practicas/xxxx.pdf
        pdfFilename = uploadData.filename; // nombre original
        }

        // 2) Crear la práctica con la URL del PDF
        const body = {
        titulo,
        descripcion,
        estado: "activa", // o 'borrador' 
        fecha_cierre: null,
        configuracion_simulacion: {
            simulacion_id: selectedSim?.id || null,
            simulacion_nombre: selectedSim?.nombre || null,
            objetivo,
            duracion,
            pdf_filename: pdfFilename,
            pdf_url: pdfUrl,
        },
        };

        const res = await fetch("http://localhost:3000/api/practicas", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        });

        if (!res.ok) {
        throw new Error("Error al guardar la práctica");
        }

        // 3) Si todo bien, vuelve al dashboard docente
        navigate("/docente");
    } catch (err) {
        console.error(err);
        setErrorSave("Ocurrió un error al guardar la práctica");
    } finally {
        setSaving(false);
    }
    };


  // ---------- RENDER DE CADA VISTA ----------

  // 1) Vista lista de simulaciones / prácticas (estilo dashboard)
  const renderListView = () => (
    <main className="docente-main">
      <div className="docente-welcome">
        <h2 className="docente-welcome-title">Simulaciones</h2>
      </div>

      {loadingPracticas && (
        <p className="text-sm text-muted-foreground">Cargando prácticas existentes…</p>
      )}

      {errorPracticas && (
        <p className="text-sm text-red-500">{errorPracticas}</p>
      )}

      <div className="docente-sim-grid">
        {/* Tarjeta “Crear práctica” */}
        <button
          onClick={() => setView("form")}
          className="docente-sim-card create"
          aria-label="Crear práctica"
        >
          <div className="docente-sim-card-media">
            <Plus className="w-6 h-6" />
          </div>
          <div className="docente-sim-card-title">Crear práctica</div>
        </button>

        {/* Prácticas existentes */}
        {practicas.map((p) => (
          <button
            key={p.id_practica}
            onClick={() => { /* futura navegación a editar */ }}
            className="docente-sim-card"
          >
            <div className="docente-sim-card-media">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="docente-sim-card-title">{p.titulo}</div>
          </button>
        ))}
      </div>
    </main>
  );

  // 2) Vista de formulario de práctica
  const renderFormView = () => (
    <main className="docente-main">
      <div className="docente-form-container">
        {/* Título de la simulación */}
        <input
          type="text"
          placeholder="Título de la práctica"
          className="docente-form-input"
          style={{
            fontSize: "1.3rem",
            fontWeight: "700",
            borderBottom: "2px solid var(--border)",
            borderRadius: 0,
            paddingBottom: "12px",
            marginBottom: "20px",
          }}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        {/* Imagen grande (simulación seleccionada o placeholder) */}
        <div className="docente-form-image">
          <ImageIcon className="w-10 h-10 text-muted-foreground" />
          {selectedSim ? (
            <>
              <span className="text-sm font-medium">
                {selectedSim.nombre}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Simulación seleccionada
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              Sin simulación seleccionada
            </span>
          )}
        </div>

        {/* Botón escoger simulación */}
        <div className="flex justify-start mb-6">
          <button
            onClick={() => setView("chooseSim")}
            className="docente-form-button"
          >
            Escoger simulación
          </button>
        </div>

        {/* Campos descripción / objetivo / duración */}
        <div className="docente-form-group">
          <div className="docente-form-field">
            <label className="docente-form-label">Descripción</label>
            <textarea
              className="docente-form-textarea"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="docente-form-field">
            <label className="docente-form-label">Objetivo</label>
            <textarea
              className="docente-form-textarea"
              rows={3}
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
            />
          </div>

          <div className="docente-form-field">
            <label className="docente-form-label">Duración estimada</label>
            <input
              type="text"
              placeholder="Ej: 45 minutos"
              className="docente-form-input"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
            />
          </div>
        </div>

        {/* Subir PDF */}
        <div className="docente-form-field mt-6">
          <label className="docente-form-label">Subir PDF de la guía</label>
          <label className="docente-form-button inline-flex cursor-pointer">
            <UploadCloud className="w-4 h-4" />
            <span>{pdfFile ? pdfFile.name : "Seleccionar archivo…"}</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfChange}
            />
          </label>
        </div>

        {errorSave && (
          <div className="docente-form-error">{errorSave}</div>
        )}

        {/* Botones Guardar / Cancelar */}
        <div className="docente-form-buttons">
          <button
            type="button"
            onClick={() => navigate("/docente")}
            className="docente-form-button"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleGuardarPractica}
            className="docente-form-button-primary"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </main>
  );

  // 3) Vista de selector de simulación
  const [simSeleccionadaTemp, setSimSeleccionadaTemp] = useState(null);

  const renderChooseSimView = () => (
    <main className="docente-main">
      <div className="docente-form-container">
        <h2 className="docente-form-title">Simulaciones disponibles</h2>

        <div className="docente-form-group">
          {simulacionesDisponibles.map((sim) => (
            <button
              key={sim.id}
              onClick={() => setSimSeleccionadaTemp(sim)}
              className={`flex gap-3 items-center border rounded-md p-3 text-left hover:bg-muted transition ${
                simSeleccionadaTemp?.id === sim.id
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{sim.nombre}</div>
                <div className="text-xs text-muted-foreground">
                  {sim.descripcion}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="docente-form-buttons">
          <button
            type="button"
            onClick={() => setView("form")}
            className="docente-form-button"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!simSeleccionadaTemp}
            onClick={() => {
              if (simSeleccionadaTemp) {
                setSelectedSim(simSeleccionadaTemp);
              }
              setView("form");
            }}
            className="docente-form-button-primary"
          >
            Usar
          </button>
        </div>
      </div>
    </main>
  );

  // ---------- LAYOUT GENERAL (HEADER + vista según estado) ----------

  return (
    <div className="docente-container">
      {/* HEADER */}
      <header className="docente-header">
        <div className="docente-header-left">
          <button
            onClick={() =>
              view === "list" ? navigate("/docente") : setView("list")
            }
            className="docente-header-button"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="docente-header-title">Crear práctica</h1>
        </div>
      </header>

      {view === "list" && renderListView()}
      {view === "form" && renderFormView()}
      {view === "chooseSim" && renderChooseSimView()}

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

export default CrearPractica;
