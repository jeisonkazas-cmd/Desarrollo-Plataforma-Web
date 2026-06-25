import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocenteLayout from '../components/DocenteLayout';
import { ArrowLeftIcon } from '../components/icons';
import '../../../styles/settings-panel.css';
import '../../../styles/docente.css';
import { virtualLabReports, virtualLabSimulations } from '../../../data/virtualLabsCatalog';
import { createPracticaForGrupo, fetchDocenteGrupos, fetchDocenteRecursos } from '../services/docenteService';

function AssetSelect({ id, label, value, options, onChange }) {
  const selected = options.find((option) => option.url === value);

  return (
    <div className="docente-form-group">
      <label htmlFor={id} className="docente-form-label">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="docente-form-select"
      >
        <option value="">Seleccionar recurso</option>
        {options.map((option) => (
          <option key={option.id} value={option.url}>
            {option.label}
          </option>
        ))}
      </select>
      {selected && <p className="docente-form-asset-path">{selected.url}</p>}
    </div>
  );
}

export default function CrearPractica() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    difficulty: 'intro',
    simulationUrl: '',
    guideUrl: '',
    objective: '',
    description: '',
  });
  const [resourceSimulations, setResourceSimulations] = useState([]);
  const [resourceReports, setResourceReports] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [grupoId, setGrupoId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const selectedSimulation = useMemo(
    () => {
      const simulationOptions = [
        ...resourceSimulations.map((item) => ({
          id: `storage-sim-${item.id}`,
          lab: item.laboratorio || 'Storage',
          label: item.label,
          url: item.url,
        })),
        ...virtualLabSimulations,
      ];
      return simulationOptions.find((item) => item.url === formData.simulationUrl) || null;
    },
    [formData.simulationUrl, resourceSimulations]
  );
  const simulationOptions = useMemo(
    () => [
      ...resourceSimulations.map((item) => ({
        id: `storage-sim-${item.id}`,
        lab: item.laboratorio || 'Storage',
        label: item.label,
        url: item.url,
      })),
      ...virtualLabSimulations,
    ],
    [resourceSimulations]
  );
  const reportOptions = useMemo(
    () => [
      ...resourceReports.map((item) => ({
        id: `storage-${item.id}`,
        lab: item.laboratorio || 'Storage',
        label: item.label,
        url: item.url,
      })),
      ...virtualLabReports,
    ],
    [resourceReports]
  );
  const selectedReport = useMemo(
    () => reportOptions.find((item) => item.url === formData.guideUrl) || null,
    [formData.guideUrl, reportOptions]
  );

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const [data, recursos] = await Promise.all([
          fetchDocenteGrupos(),
          fetchDocenteRecursos().catch(() => []),
        ]);
        if (!alive) return;
        setGrupos(data);
        setGrupoId(data[0]?.id || '');
        setResourceSimulations(recursos.filter((recurso) => recurso.tipo === 'simulacion'));
        setResourceReports(recursos.filter((recurso) => ["guia", "informe"].includes(recurso.tipo)));
      } catch (err) {
        if (alive) setFormError(err.message || 'No se pudieron cargar los grupos.');
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!grupoId) {
      setFormError('Selecciona un grupo para asignar la practica.');
      return;
    }

    if (!formData.title.trim()) {
      setFormError('El titulo de la practica es obligatorio.');
      return;
    }

    if (!formData.simulationUrl) {
      setFormError('Selecciona la simulacion virtual de la practica.');
      return;
    }

    if (!formData.guideUrl) {
      setFormError('Selecciona el informe o guia de la practica.');
      return;
    }

    try {
      setIsSaving(true);
      await createPracticaForGrupo(grupoId, {
        titulo: formData.title.trim(),
        descripcion: formData.description.trim(),
        objetivos: formData.objective.trim(),
        instrucciones: `Simulacion virtual: ${selectedSimulation?.label || formData.simulationUrl}. Informe: ${selectedReport?.label || formData.guideUrl}.`,
        simuladorUrl: formData.simulationUrl,
        simulacionTitulo: selectedSimulation?.label || formData.title.trim(),
        simulacionDescripcion: selectedSimulation?.lab || '',
        guiaUrl: formData.guideUrl,
        guiaNombre: selectedReport?.label || null,
        fecha_entrega: null,
      });
      navigate(`/docente/grupo/${grupoId}/practicas`);
    } catch (err) {
      setFormError(err.message || 'No se pudo guardar la practica.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/docente/grupos');
  };

  return (
    <DocenteLayout
      footerText="2026 Plataforma Docente. Todos los derechos reservados."
      topBand={
        <div className="docente-nav-band">
          <div className="docente-nav-band-inner">
            <button
              type="button"
              className="docente-breadcrumb"
              onClick={() => navigate('/')}
              aria-label="Volver al inicio"
            >
              <ArrowLeftIcon size={14} />
              Inicio
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <button
              type="button"
              className="docente-breadcrumb"
              onClick={() => navigate('/docente')}
              aria-label="Dashboard Docente"
            >
              Dashboard Docente
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <span className="docente-breadcrumb-current">Crear practica</span>
          </div>
        </div>
      }
    >
      <div className="docente-create-practice-container">
        <div className="docente-create-practice-header">
          <div className="docente-create-practice-header-content">
            <button
              type="button"
              className="docente-create-practice-back-btn"
              onClick={handleCancel}
              aria-label="Volver"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <h1 className="docente-create-practice-title">Crear practica virtual</h1>
          </div>
          <div className="docente-create-practice-badge">
            <span>Virtual</span>
            <span>Laboratorios de Fisica</span>
          </div>
        </div>

        <div className="docente-create-practice-card">
          <form className="docente-create-practice-form" onSubmit={handleSubmit}>
            {formError && <p className="docente-form-error">{formError}</p>}

            <div className="docente-form-group">
              <label htmlFor="practice-group" className="docente-form-label">
                Grupo asignado
              </label>
              <select
                id="practice-group"
                value={grupoId}
                onChange={(event) => setGrupoId(event.target.value)}
                className="docente-form-select"
              >
                {grupos.length === 0 ? (
                  <option value="">Sin grupos asignados</option>
                ) : (
                  grupos.map((grupo) => (
                    <option key={grupo.id} value={grupo.id}>
                      {grupo.nombre}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="docente-form-group">
              <label htmlFor="practice-title" className="docente-form-label">
                Titulo de la practica
              </label>
              <input
                id="practice-title"
                name="title"
                type="text"
                placeholder="Ej. Cubeta de ondas"
                value={formData.title}
                onChange={handleInputChange}
                className="docente-form-input docente-form-input-lg"
              />
            </div>

            <div className="docente-form-row">
              <AssetSelect
                id="simulation-url"
                label="Simulacion interactiva"
                value={formData.simulationUrl}
                options={simulationOptions}
                onChange={(value) => setFormData((prev) => ({ ...prev, simulationUrl: value }))}
              />
              <AssetSelect
                id="guide-url"
                label="Informe o guia de la practica"
                value={formData.guideUrl}
                options={reportOptions}
                onChange={(value) => setFormData((prev) => ({ ...prev, guideUrl: value }))}
              />
            </div>

            <div className="docente-form-row">
              <div className="docente-form-group">
                <label htmlFor="duration" className="docente-form-label">
                  Duracion estimada (minutos)
                </label>
                <div className="docente-form-input-wrapper">
                  <span className="docente-form-input-icon">min</span>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    placeholder="Ej. 90"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="docente-form-input"
                  />
                </div>
              </div>

              <div className="docente-form-group">
                <label htmlFor="difficulty" className="docente-form-label">
                  Nivel de dificultad
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="docente-form-select"
                >
                  <option value="intro">Introductorio</option>
                  <option value="inter">Intermedio</option>
                  <option value="adv">Avanzado</option>
                </select>
              </div>
            </div>

            <div className="docente-form-group">
              <label htmlFor="objective" className="docente-form-label">
                Objetivo pedagogico
              </label>
              <textarea
                id="objective"
                name="objective"
                placeholder="Describe el objetivo principal de aprendizaje..."
                value={formData.objective}
                onChange={handleInputChange}
                className="docente-form-textarea"
                rows="3"
              />
            </div>

            <div className="docente-form-group">
              <label htmlFor="description" className="docente-form-label">
                Descripcion detallada
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Proporciona instrucciones o contexto teorico..."
                value={formData.description}
                onChange={handleInputChange}
                className="docente-form-textarea"
                rows="5"
              />
            </div>

            <div className="docente-form-actions">
              <button
                type="button"
                className="docente-form-btn docente-form-btn-secondary"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button type="submit" className="docente-form-btn docente-form-btn-primary" disabled={isSaving}>
                Guardar practica
              </button>
            </div>
          </form>
        </div>
      </div>
    </DocenteLayout>
  );
}
