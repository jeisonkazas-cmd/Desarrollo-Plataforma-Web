import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DocenteLayout from '../components/DocenteLayout';
import { ArrowLeftIcon } from '../components/icons';
import '../../../styles/settings-panel.css';
import '../../../styles/docente.css';
import {
  addEstudiantesToGrupo,
  fetchDocenteGrupo,
  fetchEstudiantesDisponiblesGrupo,
  fetchPracticasByGrupo,
} from '../services/docenteService';

export default function PracticasGrupo() {
  const navigate = useNavigate();
  const { grupoId } = useParams();
  const [filterStatus, setFilterStatus] = useState('todas');
  const [grupo, setGrupo] = useState({ nombre: 'Grupo', codigo: '' });
  const [practicas, setPracticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingStudents, setSavingStudents] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [grupoData, practicasData] = await Promise.all([
        fetchDocenteGrupo(grupoId),
        fetchPracticasByGrupo(grupoId),
      ]);
      setGrupo(grupoData || { nombre: 'Grupo', codigo: `Grupo ${grupoId}` });
      setPracticas(practicasData);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las prácticas.');
    } finally {
      setLoading(false);
    }
  }, [grupoId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredPracticas = useMemo(() => {
    if (filterStatus === 'todas') return practicas;
    if (filterStatus === 'activas') return practicas.filter((p) => p.estado === 'activa');
    return practicas.filter((p) => p.estado === 'cerrada');
  }, [practicas, filterStatus]);

  const counts = useMemo(() => ({
    todas: practicas.length,
    activas: practicas.filter((p) => p.estado === 'activa').length,
    cerradas: practicas.filter((p) => p.estado === 'cerrada').length,
  }), [practicas]);

  const filteredStudents = useMemo(() => {
    const term = studentSearch.trim().toLowerCase();
    return availableStudents.filter((student) => {
      if (student.asignado) return false;
      if (!term) return true;
      return `${student.nombre} ${student.email}`.toLowerCase().includes(term);
    });
  }, [availableStudents, studentSearch]);

  const handleNewPractice = () => {
    navigate('/docente/practicas/crear');
  };

  const handleViewReports = (practicaId) => {
    navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`);
  };

  const openStudentModal = async () => {
    setError('');
    setNotice('');
    setShowStudentModal(true);
    setStudentSearch('');
    setSelectedStudentIds([]);

    try {
      setLoadingStudents(true);
      setAvailableStudents(await fetchEstudiantesDisponiblesGrupo(grupoId));
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los estudiantes.');
      setAvailableStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const toggleSelectedStudent = (studentId) => {
    setSelectedStudentIds((prev) => (
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    ));
  };

  const handleSaveStudents = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (selectedStudentIds.length === 0) {
      setError('Selecciona al menos un estudiante.');
      return;
    }

    try {
      setSavingStudents(true);
      const result = await addEstudiantesToGrupo(grupoId, selectedStudentIds);
      await loadData();
      setShowStudentModal(false);
      setSelectedStudentIds([]);
      setAvailableStudents([]);

      const parts = [];
      if (result.estudiantesAgregados > 0) {
        parts.push(`${result.estudiantesAgregados} estudiante(s) agregado(s)`);
      }
      if (result.estudiantesExistentes > 0) {
        parts.push(`${result.estudiantesExistentes} ya estaban en el grupo`);
      }
      if (result.estudiantesNoEncontrados?.length > 0) {
        parts.push(`no encontrados: ${result.estudiantesNoEncontrados.join(', ')}`);
      }
      setNotice(parts.length ? parts.join('. ') : 'Estudiantes actualizados.');
    } catch (err) {
      setError(err.message || 'No se pudieron asignar los estudiantes.');
    } finally {
      setSavingStudents(false);
    }
  };

  const getBadgeStyle = (estado) => (
    estado === 'activa' ? 'docente-practica-badge-active' : 'docente-practica-badge-closed'
  );

  return (
    <DocenteLayout
      footerText="© 2026 Universidad - Sistema de Gestión de Prácticas Académicas. Todos los derechos reservados."
      topBand={
        <div className="docente-nav-band">
          <div className="docente-nav-band-inner">
            <button type="button" className="docente-breadcrumb" onClick={() => navigate('/')}>
              <ArrowLeftIcon size={14} />
              Inicio
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <button type="button" className="docente-breadcrumb" onClick={() => navigate('/docente')}>
              Dashboard Docente
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <button type="button" className="docente-breadcrumb" onClick={() => navigate('/docente/grupos')}>
              Grupos
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <span className="docente-breadcrumb-current">{grupo.nombre} - {grupo.codigo}</span>
          </div>
        </div>
      }
    >
      <div className="docente-practicas-grupo-container">
        <div className="docente-practicas-grupo-header">
          <div className="docente-practicas-grupo-header-left">
            <button
              type="button"
              className="docente-practicas-grupo-back-btn"
              onClick={() => navigate('/docente/grupos')}
              aria-label="Volver a grupos"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <div>
              <h1 className="docente-practicas-grupo-title">{grupo.nombre} - {grupo.codigo}</h1>
              <p className="docente-practicas-grupo-subtitle">Lista de prácticas creadas</p>
            </div>
          </div>
          <div className="docente-practicas-grupo-header-right">
            <button
              type="button"
              className="docente-practicas-grupo-new-btn docente-practicas-grupo-secondary-btn"
              onClick={openStudentModal}
            >
              Asignar estudiantes
            </button>
            <button
              type="button"
              className="docente-practicas-grupo-new-btn"
              onClick={handleNewPractice}
              aria-label="Crear nueva práctica"
            >
              <span className="docente-practicas-grupo-new-btn-icon">+</span>
              Nueva práctica
            </button>
          </div>
        </div>

        {error && <p className="docente-form-error">{error}</p>}
        {notice && <p className="docente-form-success">{notice}</p>}

        <div className="docente-practicas-grupo-filters">
          <button
            type="button"
            className={`docente-practicas-grupo-filter ${filterStatus === 'todas' ? 'active' : ''}`}
            onClick={() => setFilterStatus('todas')}
          >
            Todas ({counts.todas})
          </button>
          <button
            type="button"
            className={`docente-practicas-grupo-filter ${filterStatus === 'activas' ? 'active' : ''}`}
            onClick={() => setFilterStatus('activas')}
          >
            Activas
          </button>
          <button
            type="button"
            className={`docente-practicas-grupo-filter ${filterStatus === 'cerradas' ? 'active' : ''}`}
            onClick={() => setFilterStatus('cerradas')}
          >
            Cerradas
          </button>
        </div>

        <div className="docente-practicas-grupo-grid">
          {loading ? (
            <div className="docente-practicas-grupo-empty">
              <p>Cargando prácticas...</p>
            </div>
          ) : filteredPracticas.length > 0 ? (
            filteredPracticas.map((practica) => (
              <div
                key={practica.id}
                className={`docente-practica-card ${practica.estado === 'cerrada' ? 'closed' : ''}`}
              >
                <div className="docente-practica-card-header">
                  <span className={`docente-practica-badge ${getBadgeStyle(practica.estado)}`}>
                    {practica.estado === 'activa' ? 'Activa' : 'Cerrada'}
                  </span>
                </div>

                <h3 className="docente-practica-card-title">{practica.titulo}</h3>

                <div className="docente-practica-card-dates">
                  <div className="docente-practica-card-date-item">
                    <span className="docente-practica-card-date-icon">Fecha</span>
                    <span>Creado: {practica.fechaCreacion || 'Sin fecha'}</span>
                  </div>
                  <div className="docente-practica-card-date-item">
                    <span className="docente-practica-card-date-icon">Límite</span>
                    <span>{practica.fechaLimite || practica.fechaFin || 'Sin fecha límite'}</span>
                  </div>
                </div>

                <div className="docente-practica-card-footer">
                  <div className="docente-practica-card-footer-left">
                    <span className="docente-practica-card-reports-badge">
                      {practica.informesRecibidos} informes recibidos
                    </span>
                  </div>
                  <button
                    type="button"
                    className="docente-practica-card-view-btn"
                    onClick={() => navigate(`/docente/grupo/${grupoId}/practica/${practica.id}/editar`)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="docente-practica-card-view-btn"
                    onClick={() => handleViewReports(practica.id)}
                  >
                    Ver informes
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="docente-practicas-grupo-empty">
              <p>No hay prácticas con este filtro.</p>
            </div>
          )}
        </div>
      </div>

      {showStudentModal && (
        <div className="docente-modal-overlay" onClick={() => setShowStudentModal(false)}>
          <form className="docente-modal" onSubmit={handleSaveStudents} onClick={(event) => event.stopPropagation()}>
            <div className="docente-modal-header">
              <h2>Asignar estudiantes al grupo</h2>
              <button type="button" className="docente-modal-close" onClick={() => setShowStudentModal(false)}>
                x
              </button>
            </div>
            <div className="docente-modal-body">
              <label htmlFor="student-search" className="docente-form-label">
                Buscar estudiantes activos
              </label>
              <input
                id="student-search"
                type="text"
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
                className="docente-form-input"
                placeholder="Nombre o correo del estudiante"
              />

              <div className="docente-student-picker">
                {loadingStudents ? (
                  <p className="docente-student-picker-empty">Cargando estudiantes...</p>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <label key={student.id} className="docente-student-picker-row">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(student.id)}
                        onChange={() => toggleSelectedStudent(student.id)}
                      />
                      <span>
                        <strong>{student.nombre}</strong>
                        <small>{student.email}</small>
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="docente-student-picker-empty">
                    No hay estudiantes activos disponibles para asignar.
                  </p>
                )}
              </div>

              <p className="docente-form-help">
                Seleccionados: {selectedStudentIds.length}
              </p>
            </div>
            <div className="docente-modal-footer">
              <button type="button" className="docente-form-btn docente-form-btn-secondary" onClick={() => setShowStudentModal(false)}>
                Cancelar
              </button>
              <button type="submit" className="docente-form-btn docente-form-btn-primary" disabled={savingStudents}>
                {savingStudents ? 'Asignando...' : 'Asignar estudiantes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </DocenteLayout>
  );
}
