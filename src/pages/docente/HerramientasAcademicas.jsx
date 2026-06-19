import React, { useEffect, useMemo, useState } from 'react';
import DocenteLayout from './components/DocenteLayout';
import {
  createRubrica,
  fetchAsistenciaPractica,
  fetchDocenteGrupos,
  fetchEstudiantesGrupo,
  fetchPracticasByGrupo,
  fetchRubricas,
  saveAsistenciaPractica,
} from './services/docenteService';
import '../../styles/academic-tools.css';

const emptyCriteria = [
  { nombre: 'Contenido y análisis', peso: 50, puntajeMaximo: 5 },
  { nombre: 'Presentación y conclusiones', peso: 50, puntajeMaximo: 5 },
];

export default function HerramientasAcademicas() {
  const [tab, setTab] = useState('rubricas');
  const [rubricas, setRubricas] = useState([]);
  const [rubricaForm, setRubricaForm] = useState({
    nombre: '',
    descripcion: '',
    criterios: emptyCriteria,
  });
  const [grupos, setGrupos] = useState([]);
  const [grupoId, setGrupoId] = useState('');
  const [practicas, setPracticas] = useState([]);
  const [practicaId, setPracticaId] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const totalPeso = useMemo(
    () => rubricaForm.criterios.reduce((sum, criterio) => sum + Number(criterio.peso || 0), 0),
    [rubricaForm.criterios]
  );

  useEffect(() => {
    Promise.all([fetchRubricas(), fetchDocenteGrupos()])
      .then(([rubricasData, gruposData]) => {
        setRubricas(rubricasData || []);
        setGrupos(gruposData || []);
      })
      .catch((err) => setError(err.message || 'No se pudieron cargar las herramientas académicas.'));
  }, []);

  useEffect(() => {
    if (!grupoId) {
      setPracticas([]);
      setEstudiantes([]);
      setPracticaId('');
      return;
    }
    Promise.all([fetchPracticasByGrupo(grupoId), fetchEstudiantesGrupo(grupoId)])
      .then(([practicasData, estudiantesData]) => {
        setPracticas(practicasData || []);
        setEstudiantes(estudiantesData || []);
        setPracticaId('');
        setAsistencia({});
      })
      .catch((err) => setError(err.message || 'No se pudo cargar el grupo.'));
  }, [grupoId]);

  useEffect(() => {
    if (!practicaId) {
      setAsistencia({});
      return;
    }
    fetchAsistenciaPractica(practicaId)
      .then((registros) => {
        const byStudent = Object.fromEntries((registros || []).map((item) => [
          item.estudianteId,
          { estado: item.estado, observacion: item.observacion || '' },
        ]));
        setAsistencia(byStudent);
      })
      .catch((err) => setError(err.message || 'No se pudo cargar la asistencia.'));
  }, [practicaId]);

  const updateCriterion = (index, field, value) => {
    setRubricaForm((current) => ({
      ...current,
      criterios: current.criterios.map((criterio, criterionIndex) => (
        criterionIndex === index ? { ...criterio, [field]: value } : criterio
      )),
    }));
  };

  const handleCreateRubrica = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (Math.abs(totalPeso - 100) > 0.01) {
      setError('La suma de los pesos debe ser 100%.');
      return;
    }
    try {
      setSaving(true);
      await createRubrica(rubricaForm);
      const data = await fetchRubricas();
      setRubricas(data || []);
      setRubricaForm({ nombre: '', descripcion: '', criterios: emptyCriteria });
      setMessage('Rúbrica creada correctamente.');
    } catch (err) {
      setError(err.message || 'No se pudo crear la rúbrica.');
    } finally {
      setSaving(false);
    }
  };

  const updateAttendance = (studentId, field, value) => {
    setAsistencia((current) => ({
      ...current,
      [studentId]: {
        estado: current[studentId]?.estado || 'presente',
        observacion: current[studentId]?.observacion || '',
        [field]: value,
      },
    }));
  };

  const handleSaveAttendance = async () => {
    setError('');
    setMessage('');
    if (!practicaId) {
      setError('Selecciona una práctica.');
      return;
    }
    const registros = estudiantes.map((student) => ({
      estudianteId: student.id,
      estado: asistencia[student.id]?.estado || 'presente',
      observacion: asistencia[student.id]?.observacion || '',
    }));
    if (registros.length === 0) {
      setError('El grupo no tiene estudiantes activos.');
      return;
    }
    try {
      setSaving(true);
      await saveAsistenciaPractica(practicaId, registros);
      setMessage(`Asistencia guardada para ${registros.length} estudiante(s).`);
    } catch (err) {
      setError(err.message || 'No se pudo guardar la asistencia.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DocenteLayout>
      <section className="academic-tools">
        <header className="academic-tools-header">
          <div>
            <h1>Herramientas académicas</h1>
            <p>Configura rúbricas y registra la asistencia de tus grupos.</p>
          </div>
          <div className="academic-tools-tabs" role="tablist">
            <button type="button" className={tab === 'rubricas' ? 'active' : ''} onClick={() => setTab('rubricas')}>
              Rúbricas
            </button>
            <button type="button" className={tab === 'asistencia' ? 'active' : ''} onClick={() => setTab('asistencia')}>
              Asistencia
            </button>
          </div>
        </header>

        {error && <p className="academic-tools-alert error">{error}</p>}
        {message && <p className="academic-tools-alert success">{message}</p>}

        {tab === 'rubricas' ? (
          <div className="academic-tools-layout">
            <form className="academic-tools-panel" onSubmit={handleCreateRubrica}>
              <h2>Nueva rúbrica</h2>
              <label>
                Nombre
                <input
                  value={rubricaForm.nombre}
                  onChange={(event) => setRubricaForm({ ...rubricaForm, nombre: event.target.value })}
                  required
                />
              </label>
              <label>
                Descripción
                <textarea
                  value={rubricaForm.descripcion}
                  onChange={(event) => setRubricaForm({ ...rubricaForm, descripcion: event.target.value })}
                  rows="3"
                />
              </label>
              <div className="academic-criteria-header">
                <h3>Criterios</h3>
                <span className={totalPeso === 100 ? 'valid' : 'invalid'}>{totalPeso}%</span>
              </div>
              {rubricaForm.criterios.map((criterio, index) => (
                <div className="academic-criterion-row" key={`${index}-${criterio.nombre}`}>
                  <input
                    aria-label={`Nombre del criterio ${index + 1}`}
                    value={criterio.nombre}
                    onChange={(event) => updateCriterion(index, 'nombre', event.target.value)}
                    required
                  />
                  <input
                    aria-label={`Peso del criterio ${index + 1}`}
                    type="number"
                    min="1"
                    max="100"
                    value={criterio.peso}
                    onChange={(event) => updateCriterion(index, 'peso', Number(event.target.value))}
                    required
                  />
                  <button
                    type="button"
                    aria-label={`Eliminar criterio ${index + 1}`}
                    onClick={() => setRubricaForm((current) => ({
                      ...current,
                      criterios: current.criterios.filter((_, itemIndex) => itemIndex !== index),
                    }))}
                    disabled={rubricaForm.criterios.length === 1}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="secondary"
                onClick={() => setRubricaForm((current) => ({
                  ...current,
                  criterios: [...current.criterios, { nombre: '', peso: 0, puntajeMaximo: 5 }],
                }))}
              >
                Agregar criterio
              </button>
              <button type="submit" disabled={saving || totalPeso !== 100}>
                {saving ? 'Guardando...' : 'Guardar rúbrica'}
              </button>
            </form>

            <div className="academic-tools-panel">
              <h2>Rúbricas creadas</h2>
              {rubricas.length === 0 ? (
                <p className="academic-empty">Aún no tienes rúbricas.</p>
              ) : rubricas.map((rubrica) => (
                <article className="academic-rubric-card" key={rubrica.rubrica_id}>
                  <h3>{rubrica.nombre}</h3>
                  <p>{rubrica.descripcion || 'Sin descripción'}</p>
                  <ul>
                    {(rubrica.criterios || []).map((criterio) => (
                      <li key={criterio.id}>{criterio.nombre}: {Number(criterio.peso)}%</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="academic-tools-panel attendance-panel">
            <div className="academic-attendance-selectors">
              <label>
                Grupo
                <select value={grupoId} onChange={(event) => setGrupoId(event.target.value)}>
                  <option value="">Selecciona un grupo</option>
                  {grupos.map((grupo) => <option key={grupo.id} value={grupo.id}>{grupo.nombre}</option>)}
                </select>
              </label>
              <label>
                Práctica
                <select value={practicaId} onChange={(event) => setPracticaId(event.target.value)} disabled={!grupoId}>
                  <option value="">Selecciona una práctica</option>
                  {practicas.map((practica) => <option key={practica.id} value={practica.id}>{practica.titulo}</option>)}
                </select>
              </label>
            </div>
            <div className="academic-attendance-list">
              {estudiantes.map((student) => (
                <div className="academic-attendance-row" key={student.id}>
                  <div>
                    <strong>{student.nombre}</strong>
                    <span>{student.correo}</span>
                  </div>
                  <select
                    aria-label={`Asistencia de ${student.nombre}`}
                    value={asistencia[student.id]?.estado || 'presente'}
                    onChange={(event) => updateAttendance(student.id, 'estado', event.target.value)}
                  >
                    <option value="presente">Presente</option>
                    <option value="ausente">Ausente</option>
                    <option value="tarde">Llegó tarde</option>
                    <option value="justificada">Falta justificada</option>
                  </select>
                  <input
                    aria-label={`Observación de ${student.nombre}`}
                    placeholder="Observación"
                    value={asistencia[student.id]?.observacion || ''}
                    onChange={(event) => updateAttendance(student.id, 'observacion', event.target.value)}
                  />
                </div>
              ))}
              {grupoId && estudiantes.length === 0 && <p className="academic-empty">Este grupo no tiene estudiantes activos.</p>}
            </div>
            <button type="button" onClick={handleSaveAttendance} disabled={saving || !practicaId}>
              {saving ? 'Guardando...' : 'Guardar asistencia'}
            </button>
          </div>
        )}
      </section>
    </DocenteLayout>
  );
}
