import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import "../../styles/estudiante.css";

function PracticasList() {
  const navigate = useNavigate();
  const [practicas, setPracticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/practicas", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error cargando prácticas");
        const data = await res.json();
        setPracticas(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las prácticas");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando prácticas…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="estudiante-container">
      {/* Header */}
      <header className="estudiante-header">
        <div className="estudiante-header-left">
          <button
            onClick={() => navigate("/estudiante")}
            className="estudiante-header-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="estudiante-header-title">Prácticas</h1>
        </div>
      </header>

      {/* Lista */}
      <main className="estudiante-main">
        <h2 className="estudiante-list-title">Prácticas disponibles</h2>

        <div className="estudiante-list-grid">
          {practicas.map((p) => (
            <button
              key={p.id_practica}
              onClick={() =>
                navigate(`/estudiante/practicas/${p.id_practica}`)
              }
              className="estudiante-list-item"
            >
              <div className="estudiante-list-item-image">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="estudiante-list-item-content">
                <p className="estudiante-list-item-title">{p.titulo}</p>
                <p className="estudiante-list-item-description">
                  {p.descripcion}
                </p>
              </div>
            </button>
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

export default PracticasList;
