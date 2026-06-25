import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentBreadcrumb from './components/StudentBreadcrumb';
import PracticeCard from './components/PracticeCard';
import StateFilterTabs from './components/StateFilterTabs';
import { getGrupos, getPracticasByGrupo } from './services/estudianteService';
import '../../styles/estudiante.css';

export default function MisPracticas() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [practicas, setPracticas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      try {
        const grupos = await getGrupos();
        const practicasPorGrupo = await Promise.all(
          grupos.map(async (grupo) => {
            const practicasGrupo = await getPracticasByGrupo(grupo.id);
            return (practicasGrupo || []).map((practica) => ({
              ...practica,
              grupoNombre: grupo.nombre,
            }));
          })
        );
        setPracticas(practicasPorGrupo.flat());
      } catch (error) {
        console.error('No se pudieron cargar las prácticas del estudiante:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  const filteredPracticas = useMemo(() => {
    let result = practicas;
    const term = search.trim().toLowerCase();

    if (term) {
      result = result.filter((practica) =>
        `${practica.titulo} ${practica.descripcion} ${practica.grupoNombre}`
          .toLowerCase()
          .includes(term)
      );
    }

    if (filter !== 'Todos') {
      const filterKey = filter.toLowerCase();
      result = result.filter((practica) => practica.estado?.includes(filterKey));
    }

    return result;
  }, [practicas, search, filter]);

  const resumen = useMemo(() => ({
    pendientes: practicas.filter((practica) => practica.estado === 'pendiente').length,
    entregados: practicas.filter((practica) => practica.estado === 'entregado').length,
    calificados: practicas.filter((practica) => practica.estado === 'calificado').length,
  }), [practicas]);

  return (
    <div className="student-practicas-grupo-page">
      <StudentBreadcrumb
        items={[
          { label: 'Inicio', href: '/dashboard/estudiante' },
          { label: 'Mis prácticas' },
        ]}
      />

      <header className="student-page-header">
        <div>
          <h1>Mis prácticas</h1>
          <p>Consulta todas las prácticas asignadas en tus grupos académicos.</p>
        </div>
      </header>

      <section className="student-practicas-controls">
        <div className="student-search-box">
          <span>Buscar</span>
          <input
            type="text"
            placeholder="Buscar práctica o grupo"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <StateFilterTabs activeFilter={filter} onFilterChange={setFilter} />
      </section>

      <section className="student-practicas-main">
        <div className="student-practicas-grid">
          {loading ? (
            <p>Cargando prácticas...</p>
          ) : filteredPracticas.length > 0 ? (
            filteredPracticas.map((practica) => (
              <PracticeCard
                key={`${practica.grupoId}-${practica.id}`}
                practice={{
                  ...practica,
                  descripcion: practica.grupoNombre
                    ? `${practica.grupoNombre} - ${practica.descripcion || 'Sin descripción'}`
                    : practica.descripcion,
                }}
                onVerDetalle={(practicaId) => navigate(`/estudiante/practicas/${practicaId}`)}
              />
            ))
          ) : (
            <p className="student-empty-state">No hay prácticas que coincidan.</p>
          )}
        </div>

        <aside className="student-practicas-sidebar">
          <div className="student-sidebar-card">
            <h3>Resumen general</h3>
            <div className="student-summary-item">
              <span className="student-summary-icon pending">PD</span>
              <div>
                <p>Pendientes</p>
                <strong>{resumen.pendientes}</strong>
              </div>
            </div>
            <div className="student-summary-item">
              <span className="student-summary-icon submitted">EN</span>
              <div>
                <p>Entregadas</p>
                <strong>{resumen.entregados}</strong>
              </div>
            </div>
            <div className="student-summary-item">
              <span className="student-summary-icon graded">CA</span>
              <div>
                <p>Calificadas</p>
                <strong>{resumen.calificados}</strong>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
