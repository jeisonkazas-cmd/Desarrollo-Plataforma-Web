import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import StudentDashboard from './pages/estudiante/Dashboard.jsx';
import TeacherDashboard from './pages/docente/Dashboard.jsx';
import CrearPractica from "./pages/docente/CrearPractica";
import PracticaEstudiantes from "./pages/docente/EstudiantesPractica";
import TeacherGrupos from "./pages/docente/Grupos";
import InformeDetalle from "./pages/docente/InformeEstudiante";
import GrupoPracticas from "./pages/docente/PracticasGrupo";  
import PracticasList from "./pages/estudiante/PracticasList";
import PracticaDetalle from "./pages/estudiante/PracticaDetalle";
import InformesList from "./pages/estudiante/InformesList";
import InformeDetalleEst from "./pages/estudiante/InformeDetalle";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Docente */}
      <Route path="/docente" element={<TeacherDashboard />} />

      <Route path="/docente/practicas/crear" element={<CrearPractica />} />

      <Route path="/docente/practicas" element={<TeacherGrupos />} />

      <Route path="/docente/grupo/:idGrupo/practicas" element={<GrupoPracticas />} />

      {/* Estudiante */}
      <Route path="/estudiante" element={<StudentDashboard />} />

      <Route path="/docente/practicas/:idPractica" element={<PracticaEstudiantes />} />

      <Route path="/docente/estudiante/:idUsuario/informe/:idInforme" element={<InformeDetalle />} />

      <Route path="/estudiante/practicas" element={<PracticasList />} />

      <Route path="/estudiante/practicas/:idPractica" element={<PracticaDetalle />} />
      
      <Route path="/estudiante/informes" element={<InformesList />} />

      <Route path="/estudiante/informes/:idInforme" element={<InformeDetalleEst />} />

    </Routes>
  );
}

export default App;
