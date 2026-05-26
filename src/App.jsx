import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
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

function AppContent() {
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
  return <AppContent />;
}

export default App;
