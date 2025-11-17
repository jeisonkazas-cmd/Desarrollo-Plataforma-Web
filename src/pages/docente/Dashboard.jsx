import { useState, useEffect } from "react";
import { Pencil, Folder, MessageSquare, User, LogOut, HelpCircle, UserCog } from "lucide-react";
import "../../styles/settings-panel.css";
import "../../styles/docente.css";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  };

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("No se pudo obtener el usuario");

        const data = await res.json();
        setTeacher(data);
      } catch (err) {
        setError("No se pudo cargar la información del docente");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, []);

  const teacherName = teacher?.nombre || "Julián";

  const menuItems = [
    {
      title: "Crear práctica",
      description: "Genera nuevas actividades",
      icon: Pencil,
      color: "from-blue-500 to-blue-600",
      action: () => navigate("/docente/practicas/crear"),
    },
    {
      title: "Prácticas",
      description: "Gestiona todas tus prácticas",
      icon: Folder,
      color: "from-purple-500 to-purple-600",
      action: () => navigate("/docente/practicas"),
    },
    {
      title: "Foro / Chat",
      description: "Comunícate con estudiantes",
      icon: MessageSquare,
      color: "from-teal-500 to-teal-600",
      action: () => navigate("/docente/foro"),
    },
  ];

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <p className="text-muted-foreground">Cargando tu panel…</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="docente-container">

      {/* ===== Overlay ===== */}
      <div
        className={`settings-panel-overlay ${isSettingsOpen ? "" : "hidden"}`}
        onClick={() => setIsSettingsOpen(false)}
      ></div>

      {/* ===== Panel lateral ===== */}
      <div className={`settings-panel ${isSettingsOpen ? "open" : ""}`}>
        <div className="settings-panel-header">Configuración</div>

        <nav className="settings-panel-menu">

          <div className="settings-panel-item">
            <User className="w-5 h-5" />
            Perfil
          </div>

          <div className="settings-panel-item">
            <HelpCircle className="w-5 h-5" />
            Ayuda
          </div>

          <div
            className="settings-panel-item logout"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Salir
          </div>

        </nav>
      </div>

      {/* HEADER */}
      <header className="docente-header">
        <div className="docente-header-left">
          <button
            className="docente-header-button"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Configuración"
          >
            <UserCog className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="docente-main">
        <div className="docente-welcome">
          <h2 className="docente-welcome-title">Menú principal</h2>
          <p className="docente-welcome-subtitle">
            Bienvenido, <span style={{ fontWeight: "600" }}>{teacherName}</span> 👋
          </p>
        </div>

        {/* Tarjetas con navegación */}
        <div className="docente-menu-grid">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.title}
                className="docente-menu-card"
                onClick={item.action}
              >
                <div className="docente-menu-card-icon">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="docente-menu-card-content">
                  <h3 className="docente-menu-card-title">{item.title}</h3>
                  <p className="docente-menu-card-description">{item.description}</p>
                </div>
              </button>
            );
          })}
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

export default TeacherDashboard;
