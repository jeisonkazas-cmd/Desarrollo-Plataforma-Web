import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Home from './pages/Home.jsx';
import Simulaciones from './pages/Simulaciones.jsx';
import QuienesSomos from './pages/QuienesSomos.jsx';
import Investigacion from './pages/Investigacion.jsx';
import Login from './pages/Login.jsx';
import DashboardAdmin from './pages/Admin/DashboardAdmin.jsx';
import GestionUsuarios from './pages/Admin/Usuarios/GestionUsuarios.jsx';
import GestionContenido from './pages/Admin/Contenido/GestionContenido.jsx';
import AdminReportes from './pages/Admin/Reportes/AdminReportes.jsx';
import DashboardEstudiante from './pages/Estudiante/DashboardEstudiante.jsx';
import PracticasGrupoEstudiante from './pages/Estudiante/PracticasGrupo.jsx';
import SimulacionEstudiante from './pages/Estudiante/Simulacion.jsx';
import ForoEstudiante from './pages/Estudiante/Foro.jsx';
import TeacherDashboard from './pages/Docente/TeacherDashboard.jsx';
import Foro from './pages/Docente/Practicas/Foro.jsx';
import TeacherGrupos from './pages/Docente/Practicas/Grupos.jsx';
import PracticasGrupo from './pages/Docente/Practicas/PracticasGrupo.jsx';
import PracticaEstudiantes from './pages/Docente/Practicas/EstudiantesPractica.jsx';
import InformeEstudiante from './pages/Docente/Practicas/InformeEstudiante.jsx';
import CrearPractica from './pages/Docente/Practicas/CrearPractica.jsx';

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
