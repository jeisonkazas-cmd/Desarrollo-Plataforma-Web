import './App.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { getOrCreateUserProfile } from './services/authService';

const Simulaciones = lazy(() => import('./pages/Simulaciones'));
const QuienesSomos = lazy(() => import('./pages/QuienesSomos'));
const Investigacion = lazy(() => import('./pages/Investigacion'));
const Login = lazy(() => import('./pages/Login'));
const DashboardAdmin = lazy(() => import('./pages/Admin/DashboardAdmin'));
const GestionUsuarios = lazy(() => import('./pages/Admin/Usuarios/GestionUsuarios'));
const GestionContenido = lazy(() => import('./pages/Admin/Contenido/GestionContenido'));
const AdminReportes = lazy(() => import('./pages/Admin/Reportes/AdminReportes'));
const DashboardEstudiante = lazy(() => import('./pages/estudiante/DashboardEstudiante'));
const PracticasGrupoEstudiante = lazy(() => import('./pages/estudiante/PracticasGrupo'));
const SimulacionEstudiante = lazy(() => import('./pages/estudiante/Simulacion'));
const ForoEstudiante = lazy(() => import('./pages/estudiante/Foro'));
const TeacherDashboard = lazy(() => import('./pages/docente/TeacherDashboard'));
const Foro = lazy(() => import('./pages/docente/Practicas/Foro'));
const TeacherGrupos = lazy(() => import('./pages/docente/Practicas/Grupos'));
const PracticasGrupo = lazy(() => import('./pages/docente/Practicas/PracticasGrupo'));
const PracticaEstudiantes = lazy(() => import('./pages/docente/Practicas/EstudiantesPractica'));
const InformeEstudiante = lazy(() => import('./pages/docente/Practicas/InformeEstudiante'));
const CrearPractica = lazy(() => import('./pages/docente/Practicas/CrearPractica'));
const HerramientasAcademicas = lazy(() => import('./pages/docente/HerramientasAcademicas'));
const Cuenta = lazy(() => import('./pages/Cuenta'));

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
    return <Home />;
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
      <Suspense fallback={<div style={{ padding: 40 }}>Cargando módulo...</div>}>
        <Routes>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/simulaciones" element={<Simulaciones />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/investigacion" element={<Investigacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pendiente" element={<PendienteAprobacion />} />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute allowedRoles={['Administrador', 'Docente', 'Estudiante']}>
              <Cuenta mode="perfil" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute allowedRoles={['Administrador', 'Docente', 'Estudiante']}>
              <Cuenta mode="configuracion" />
            </ProtectedRoute>
          }
        />

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
        <Route
          path="/docente/herramientas"
          element={
            <ProtectedRoute allowedRoles={['Docente']}>
              <HerramientasAcademicas />
            </ProtectedRoute>
          }
        />

        <Route path="/estudiante" element={<Navigate to="/dashboard/estudiante" replace />} />
        <Route path="/docente" element={<Navigate to="/dashboard/docente" replace />} />
        <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
        </Routes>
      </Suspense>
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
