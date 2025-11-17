import { useEffect, useState } from "react";
import { BookOpen, FileText, MessageSquare, User, LogOut, HelpCircle, UserCog } from "lucide-react";
import "../../styles/settings-panel.css";
import "../../styles/estudiante.css";
import MenuButton from "../../components/common/MenuButton";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // << PANEL LATERAL

  const navigate = useNavigate();

  // Logout simple (ajusta a tu backend si cambia)
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
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("No se pudo obtener el usuario");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del estudiante");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const studentName = user?.nombre || "Estudiante";

  const menuItems = [
    {
      title: "Prácticas",
      description: "Accede a tus prácticas y tareas",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      action: () => navigate("/estudiante/practicas"),
    },
    {
      title: "Mis Informes",
      description: "Revisa tu desempeño académico",
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      action: () => navigate("/estudiante/informes"),
    },
    {
      title: "Foro / Chat",
      description: "Comunícate con otros estudiantes",
      icon: MessageSquare,
      color: "from-teal-500 to-teal-600",
      textColor: "text-teal-600",
      action: () => navigate("/estudiante/foro"),
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
    <div className="estudiante-container">
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
      <header className="estudiante-header">
        <div className="estudiante-header-left">
          <MenuButton onClick={() => setIsSettingsOpen(true)} />
          <h1 className="estudiante-header-title">Portal Estudiantil</h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="estudiante-main">
        <div className="estudiante-welcome">
          <h2 className="estudiante-welcome-title">Menú principal</h2>
          <p className="estudiante-welcome-subtitle">
            Bienvenido, <span className="estudiante-welcome-name">{studentName}</span> 👋
          </p>
        </div>

        {/* Lista de menú */}
        <div className="estudiante-menu-list">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.title}
                onClick={item.action}
                className="estudiante-menu-list-item"
              >
                <div className="estudiante-menu-list-icon">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="estudiante-menu-list-content">
                  <h3 className="estudiante-menu-list-title">{item.title}</h3>
                  <p className="estudiante-menu-list-description">{item.description}</p>
                </div>
              </button>
            );
          })}
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

export default StudentDashboard;
