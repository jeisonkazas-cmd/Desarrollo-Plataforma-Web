import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGrupos, getPerfilEstudiante, getPracticasByGrupo } from './services/estudianteService';
import '../../styles/estudiante-dashboard.css';

const imageMap = {
  '1': '/imagenes/CAIDA_LIBRE.png',
  '2': '/imagenes/CAMPO_MAGNETICO.png',
  '3': '/imagenes/REPRESENTACION_VECTORIAL.png',
  '4': '/imagenes/is3.png',
};

function getValidDate(value) {
  if (!value || value === 'Sin fecha') return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.getFullYear() < 2000) return null;
  return date;
}

export default function DashboardEstudiante() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('todos');
  const [onlyActive, setOnlyActive] = useState(true);
  const [grupos, setGrupos] = useState([]);
  const [practicas, setPracticas] = useState([]);
  const [perfil, setPerfil] = useState({ nombre: 'Estudiante', primerNombre: 'Estudiante' });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [perfilData, gruposData] = await Promise.all([
          getPerfilEstudiante(),
          getGrupos(),
        ]);
        setPerfil(perfilData);
        setGrupos(gruposData);
        
        // Cargar prácticas de todos los grupos
        const todasPracticas = [];
        for (const grupo of gruposData) {
          const practicasGrupo = await getPracticasByGrupo(grupo.id);
          todasPracticas.push(...practicasGrupo);
        }
        setPracticas(todasPracticas);
      } catch (error) {
        console.error('No se pudo cargar el panel del estudiante:', error);
      }
    };

    cargarDatos();
  }, []);

  const enrolledGroups = useMemo(() => {
    return grupos.map(grupo => {
      const practicasDelGrupo = practicas.filter(p => p.grupoId === grupo.id);
      const progress = practicasDelGrupo.length > 0 
        ? Math.round((practicasDelGrupo.filter(p => p.estado === 'calificado').length / practicasDelGrupo.length) * 100)
        : 0;
      
      return {
        id: grupo.id,
        course: grupo.nombre,
        status: grupo.activo ? 'Activo' : 'Inactivo',
        practicesAssigned: practicasDelGrupo.length,
        progress: progress,
        semester: grupo.semester,
        active: grupo.activo,
        image: imageMap[grupo.id] || '/imagenes/is3.png',
      };
    });
  }, [grupos, practicas]);

  const filteredGroups = useMemo(() => {
    const term = search.trim().toLowerCase();

    return enrolledGroups.filter((group) => {
      const matchesSearch =
        term.length === 0 ||
        group.course.toLowerCase().includes(term) ||
        `${group.practicesAssigned} prácticas`.toLowerCase().includes(term);
      const matchesSemester = semester === 'todos' || group.semester === semester;
      const matchesActive = !onlyActive || group.active;

      return matchesSearch && matchesSemester && matchesActive;
    });
  }, [search, semester, onlyActive, enrolledGroups]);

  const summary = useMemo(() => {
    return {
      pending: practicas.filter(p => p.estado === 'pendiente').length,
      submitted: practicas.filter(p => p.estado === 'entregado').length,
      graded: practicas.filter(p => p.estado === 'calificado').length,
    };
  }, [practicas]);

  const nextPractice = useMemo(() => {
    const pendientes = practicas.filter(p => p.estado === 'pendiente').sort((a, b) => {
      const dateA = getValidDate(a.fechaEntrega)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const dateB = getValidDate(b.fechaEntrega)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return dateA - dateB;
    });
    
    if (pendientes.length > 0) {
      const grupo = grupos.find(g => g.id === pendientes[0].grupoId);
      const dueDate = getValidDate(pendientes[0].fechaEntrega);
      return {
        id: pendientes[0].id,
        title: `${grupo?.nombre} - ${pendientes[0].titulo}`,
        dueDate: dueDate
          ? dueDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
          : 'Sin fecha límite',
      };
    }
    
    return {
      id: null,
      title: 'No hay prácticas pendientes',
      dueDate: '-',
    };
  }, [practicas, grupos]);

  return (
    <div className="student-dashboard-page">
      <section className="student-dashboard-shell" aria-label="Panel de estudiante">
        <div className="student-shell-nav">
          <div className="student-shell-brand">Plataforma Universitaria</div>
          <nav className="student-shell-menu" aria-label="Menú principal estudiante">
            <button type="button" className="student-shell-link active">
              Inicio
            </button>
            <button
              type="button"
              className="student-shell-link"
              onClick={() => navigate('/estudiante/practicas')}
            >
              Cursos
            </button>
          </nav>
          <div className="student-shell-user">{perfil.nombre}</div>
        </div>

        <header className="student-dashboard-header">
          <div>
            <h1>Bienvenido, {perfil.primerNombre}</h1>
            <p>Accede a tus grupos y prácticas asignadas</p>
          </div>
        </header>

        <section className="student-filters" aria-label="Búsqueda y filtros">
          <div className="student-search-input-wrap">
            <span aria-hidden="true">🔎</span>
            <input
              type="text"
              className="student-search-input"
              placeholder="Buscar curso o práctica"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar curso o práctica"
            />
          </div>

          <select
            className="student-semester-filter"
            value={semester}
            onChange={(event) => setSemester(event.target.value)}
            aria-label="Filtrar por semestre"
          >
            <option value="todos">Todos</option>
            <option value="2024-I">Semestre: 2024-I</option>
            <option value="2024-II">Semestre: 2024-II</option>
            <option value="2023-II">Semestre: 2023-II</option>
          </select>

          <label className="student-active-toggle" htmlFor="only-active">
            <span>Sólo activos</span>
            <input
              id="only-active"
              type="checkbox"
              checked={onlyActive}
              onChange={(event) => setOnlyActive(event.target.checked)}
            />
          </label>
        </section>

        <section className="student-main-grid" aria-label="Cursos y resumen">
          <div>
            <div className="student-groups-header">
              <h2>Grupos académicos</h2>
              <button type="button" onClick={() => navigate('/dashboard/estudiante')}>
                Ver todos
              </button>
            </div>

            <div className="student-group-cards-grid">
              {filteredGroups.map((group) => (
                <article key={group.id} className="student-group-card">
                  <div className="student-group-card-head">
                    <h3>{group.course}</h3>
                    <span className="student-status-pill">{group.status}</span>
                  </div>

                  <p className="student-practices-assigned">
                    {group.practicesAssigned} prácticas asignadas
                  </p>

                  <img src={group.image} alt={group.course} className="student-group-image" />

                  <div className="student-progress-row">
                    <span>Progreso</span>
                    <span>{group.progress}%</span>
                  </div>
                  <div className="student-progress-track" aria-hidden="true">
                    <div
                      className="student-progress-fill"
                      style={{ width: `${group.progress}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    className="student-card-btn"
                    onClick={() => navigate(`/estudiante/grupos/${group.id}/practicas`)}
                  >
                    Ver prácticas
                  </button>
                </article>
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <div className="student-empty-state">
                No se encontraron cursos con los filtros seleccionados.
              </div>
            )}
          </div>

          <aside className="student-side-panel">
            <section className="student-side-card">
              <h3>Resumen rápido</h3>

              <div className="student-summary-item">
                <p>Prácticas pendientes</p>
                <strong>{summary.pending}</strong>
              </div>

              <div className="student-summary-item">
                <p>Prácticas entregadas</p>
                <strong>{summary.submitted}</strong>
              </div>

              <div className="student-summary-item">
                <p>Prácticas calificadas</p>
                <strong>{summary.graded}</strong>
              </div>

              <button
                type="button"
                className="student-primary-btn"
                onClick={() => navigate('/estudiante/practicas')}
              >
                Ir a Mis prácticas
              </button>
            </section>

            <section className="student-side-card student-next-practice">
              <h3>Próxima práctica</h3>
              <p className="student-next-title">{nextPractice.title}</p>
              <p className="student-next-date">
                Fecha límite <strong>{nextPractice.dueDate}</strong>
              </p>

              <button
                type="button"
                className="student-secondary-btn"
                onClick={() => nextPractice.id && navigate(`/estudiante/practicas/${nextPractice.id}`)}
                disabled={!nextPractice.id}
              >
                Ver detalles
              </button>
            </section>
          </aside>
        </section>
      </section>
    </div>
  );
}
