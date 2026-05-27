import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const [state, setState] = useState({
    loading: true,
    user: null,
    perfil: null,
    rol: null,
  });

  useEffect(() => {
    const check = async () => {
      const auth = await getOrCreateUserProfile();
      setState({
        loading: false,
        user: auth.user,
        perfil: auth.perfil,
        rol: auth.rol,
      });
    };

    check();
  }, []);

  if (state.loading) {
    return <div style={{ padding: 40 }}>Cargando...</div>;
  }

  if (!state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!state.perfil || state.perfil.estado !== 'activo' || !state.rol) {
    return <Navigate to="/pendiente" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(state.rol)) {
    if (state.rol === 'Administrador') return <Navigate to="/dashboard/admin" replace />;
    if (state.rol === 'Docente') return <Navigate to="/dashboard/docente" replace />;
    if (state.rol === 'Estudiante') return <Navigate to="/dashboard/estudiante" replace />;
    return <Navigate to="/pendiente" replace />;
  }

  return children;
}

function RoleRedirect() {
  const [state, setState] = useState({
    loading: true,
    user: null,
    perfil: null,
    rol: null,
  });

  useEffect(() => {
    const check = async () => {
      const auth = await getOrCreateUserProfile();
      setState({
        loading: false,
        user: auth.user,
        perfil: auth.perfil,
        rol: auth.rol,
      });
    };

    check();
  }, []);

  if (state.loading) {
    return <div style={{ padding: 40 }}>Cargando...</div>;
  }

  if (!state.user) return <Home />;

  if (!state.perfil || state.perfil.estado !== 'activo' || !state.rol) {
    return <Navigate to="/pendiente" replace />;
  }

  if (state.rol === 'Administrador') return <Navigate to="/dashboard/admin" replace />;
  if (state.rol === 'Docente') return <Navigate to="/dashboard/docente" replace />;
  if (state.rol === 'Estudiante') return <Navigate to="/dashboard/estudiante" replace />;

  return <Navigate to="/pendiente" replace />;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/simulaciones" element={<Simulaciones />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/investigacion" element={<Investigacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pendiente" element={<PendienteAprobacion />} />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <GestionUsuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contenido"
          element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <GestionContenido />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reportes"
          element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <AdminReportes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/estudiante"
          element={
            <ProtectedRoute allowedRoles={['Estudiante']}>
              <DashboardEstudiante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estudiante/grupos/:grupoId/practicas"
          element={
            <ProtectedRoute allowedRoles={['Estudiante']}>
              <PracticasGrupoEstudiante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estudiante/practicas/:practicaId"
          element={
            <ProtectedRoute allowedRoles={['Estudiante']}>
              <SimulacionEstudiante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estudiante/practicas/:practicaId/foro/:grupoId"
          element={
            <ProtectedRoute allowedRoles={['Estudiante']}>
              <ForoEstudiante />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/docente"
          element={
            <ProtectedRoute allowedRoles={['Docente']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docente/grupos"
          element={
            <ProtectedRoute allowedRoles={['Docente']}>
              <TeacherGrupos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docente/grupo/:grupoId/practicas"
          element={
            <ProtectedRoute allowedRoles={['Docente']}>
              <PracticasGrupo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docente/grupo/:grupoId/practica/:practicaId"
          element={
            <ProtectedRoute allowedRoles={['Docente']}>
              <PracticaEstudiantes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docente/grupo/:grupoId/practica/:practicaId/foro"
          element={
            <ProtectedRoute allowedRoles={['Docente']}>
              <Foro />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docente/grupo/:grupoId/practica/:practicaId/informe/:informeId"
          element={
            <ProtectedRoute allowedRoles={['Docente']}>
              <InformeEstudiante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docente/practicas/crear"
          element={
            <ProtectedRoute allowedRoles={['Docente']}>
              <CrearPractica />
            </ProtectedRoute>
          }
        />

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