import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentBreadcrumb from './components/StudentBreadcrumb';
import PracticeCard from './components/PracticeCard';
import StateFilterTabs from './components/StateFilterTabs';
import { getPracticasByGrupo, getGrupoDetalle } from './services/estudianteService';
import '../../styles/estudiante.css';

export default function PracticasGrupo() {
  const { grupoId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [practicas, setPracticas] = useState([]);
  const [grupo, setGrupo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      try {
        const grupoData = await getGrupoDetalle(grupoId);
        setGrupo(grupoData);
        
        const practicasData = await getPracticasByGrupo(grupoId);
        setPracticas(practicasData || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, [grupoId]);

  const filteredPracticas = useMemo(() => {
    let result = practicas;

    if (search.trim()) {
      result = result.filter((p) =>
        p.titulo?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter !== 'Todos') {
      const filterKey = filter.toLowerCase();
      result = result.filter((p) => p.estado?.includes(filterKey));
    }

    return result;
  }, [practicas, search, filter]);

  const getResumenPorEstado = () => {
    return {
      pendientes: practicas.filter((p) => p.estado === 'pendiente').length,
      entregados: practicas.filter((p) => p.estado === 'entregado').length,
      calificados: practicas.filter((p) => p.estado === 'calificado').length,
    };
  };

  const resumen = getResumenPorEstado();

  return (
    <div className="student-practicas-grupo-page">
      <StudentBreadcrumb
        items={[
          { label: 'Inicio', href: '/dashboard/estudiante' },
          { label: grupo?.nombre || 'Grupo', href: '/dashboard/estudiante' },
          { label: 'Prácticas del grupo' },
        ]}
      />

      <header className="student-page-header">
        <div>
          <h1>Prácticas del grupo</h1>
          <p>Consulta y accede a las prácticas asignadas</p>
        </div>
      </header>

      <section className="student-practicas-controls">
        <div className="student-search-box">
          <span>🔎</span>
          <input
            type="text"
            placeholder="Buscar práctica"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                key={practica.id}
                practice={practica}
                onVerDetalle={(practicaId) =>
                  navigate(`/estudiante/practicas/${practicaId}`)
                }
              />
            ))
          ) : (
            <p className="student-empty-state">No hay prácticas que coincidan</p>
          )}
        </div>

        <aside className="student-practicas-sidebar">
          <div className="student-sidebar-card">
            <h3>Resumen del grupo</h3>
            <div className="student-summary-item">
              <span className="student-summary-icon pending">📋</span>
              <div>
                <p>Pendientes</p>
                <strong>{resumen.pendientes}</strong>
              </div>
            </div>
            <div className="student-summary-item">
              <span className="student-summary-icon submitted">✓</span>
              <div>
                <p>Entregados</p>
                <strong>{resumen.entregados}</strong>
              </div>
            </div>
            <div className="student-summary-item">
              <span className="student-summary-icon graded">⭐</span>
              <div>
                <p>Calificados</p>
                <strong>{resumen.calificados}</strong>
              </div>
            </div>
          </div>

          <div className="student-sidebar-card">
            <h3>Leyenda de estados</h3>
            <ul className="student-legend">
              <li>
                <span className="student-badge-pending">Pendiente</span>
                Aún no entregado
              </li>
              <li>
                <span className="student-badge-submitted">Entregado</span>
                Informe enviado
              </li>
              <li>
                <span className="student-badge-graded">Calificado</span>
                Con nota asignada
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
