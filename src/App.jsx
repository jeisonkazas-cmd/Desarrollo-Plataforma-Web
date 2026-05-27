import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Simulaciones from './pages/Simulaciones';
import QuienesSomos from './pages/QuienesSomos';
import Investigacion from './pages/Investigacion';
import Login from './pages/Login';
import DashboardAdmin from './pages/Admin/DashboardAdmin';
import GestionUsuarios from './pages/Admin/Usuarios/GestionUsuarios';
import GestionContenido from './pages/Admin/Contenido/GestionContenido';
import AdminReportes from './pages/Admin/Reportes/AdminReportes';
import DashboardEstudiante from './pages/estudiante/DashboardEstudiante';
import PracticasGrupoEstudiante from './pages/estudiante/PracticasGrupo';
import SimulacionEstudiante from './pages/estudiante/Simulacion';
import ForoEstudiante from './pages/estudiante/Foro';
import TeacherDashboard from './pages/docente/TeacherDashboard';
import Foro from './pages/docente/Practicas/Foro';
import TeacherGrupos from './pages/docente/Practicas/Grupos';
import PracticasGrupo from './pages/docente/Practicas/PracticasGrupo';
import PracticaEstudiantes from './pages/docente/Practicas/EstudiantesPractica';
import InformeEstudiante from './pages/docente/Practicas/InformeEstudiante';
import CrearPractica from './pages/docente/Practicas/CrearPractica';
import { getOrCreateUserProfile } from './services/authService';

function PendienteAprobacion() {
  return (
    <div style={{ padding: '80px 20px', textAlign: 'center' }}>
      <h1>Cuenta pendiente de aprobación</h1>
      <p>Tu cuenta ya fue registrada. Un administrador debe asignarte un rol.</p>
    </div>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const { user, perfil, rol } = await getOrCreateUserProfile();

      if (!user) {
        setCheckingAuth(false);
        return;
      }

      if (!perfil || perfil.estado !== 'activo' || !rol) {
        navigate('/pendiente', { replace: true });
        setCheckingAuth(false);
        return;
      }

      if (window.location.pathname === '/' || window.location.pathname === '/login') {
        if (rol === 'Administrador') navigate('/dashboard/admin', { replace: true });
        else if (rol === 'Docente') navigate('/dashboard/docente', { replace: true });
        else if (rol === 'Estudiante') navigate('/dashboard/estudiante', { replace: true });
      }

      setCheckingAuth(false);
    };

    verificarSesion();
  }, [navigate]);

  if (checkingAuth) {
    return <div style={{ padding: 40 }}>Cargando...</div>;
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulaciones" element={<Simulaciones />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/investigacion" element={<Investigacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pendiente" element={<PendienteAprobacion />} />

        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/admin/usuarios" element={<GestionUsuarios />} />
        <Route path="/admin/contenido" element={<GestionContenido />} />
        <Route path="/admin/reportes" element={<AdminReportes />} />

        <Route path="/dashboard/estudiante" element={<DashboardEstudiante />} />
        <Route path="/estudiante/grupos/:grupoId/practicas" element={<PracticasGrupoEstudiante />} />
        <Route path="/estudiante/practicas/:practicaId" element={<SimulacionEstudiante />} />
        <Route path="/estudiante/practicas/:practicaId/foro/:grupoId" element={<ForoEstudiante />} />

        <Route path="/dashboard/docente" element={<TeacherDashboard />} />
        <Route path="/docente/grupos" element={<TeacherGrupos />} />
        <Route path="/docente/grupo/:grupoId/practicas" element={<PracticasGrupo />} />
        <Route path="/docente/grupo/:grupoId/practica/:practicaId" element={<PracticaEstudiantes />} />
        <Route path="/docente/grupo/:grupoId/practica/:practicaId/foro" element={<Foro />} />
        <Route path="/docente/grupo/:grupoId/practica/:practicaId/informe/:informeId" element={<InformeEstudiante />} />
        <Route path="/docente/practicas/crear" element={<CrearPractica />} />

        <Route path="/estudiante" element={<Navigate to="/dashboard/estudiante" replace />} />
        <Route path="/docente" element={<Navigate to="/dashboard/docente" replace />} />
        <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;