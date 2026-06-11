import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocenteLayout from '../components/DocenteLayout';
import { ArrowLeftIcon } from '../components/icons';
import '../../../styles/settings-panel.css';
import '../../../styles/docente.css';
import { createPracticaForGrupo, fetchDocenteGrupos, uploadPracticaGuide } from '../services/docenteService';

function SimulationSelector({ selected, onSelect }) {
  return (
    <div className="docente-form-simulation">
      {selected ? (
        <div className="docente-form-simulation-selected">
          <div className="docente-form-simulation-selected-icon">🔬</div>
          <div className="docente-form-simulation-selected-content">
            <p className="docente-form-simulation-selected-name">{selected.name}</p>
            <p className="docente-form-simulation-selected-desc">{selected.description}</p>
          </div>
          <button
            type="button"
            className="docente-form-simulation-selected-btn"
            onClick={() => onSelect(null)}
            aria-label="Limpiar selección"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="docente-form-simulation-empty">
          <div className="docente-form-simulation-empty-icon">🔬</div>
          <div className="docente-form-simulation-empty-content">
            <h3 className="docente-form-simulation-empty-title">Sin simulación seleccionada</h3>
            <p className="docente-form-simulation-empty-subtitle">
              Selecciona una simulación virtual para que los estudiantes interactúen.
            </p>
          </div>
          <button
            type="button"
            className="docente-form-simulation-btn"
            onClick={() =>
              onSelect({
                id: 1,
                name: 'Ley de Ohm - Circuitos CC',
                description: 'Simulador interactivo de circuitos eléctricos',
              })
            }
          >
            🔍 Escoger simulación
          </button>
        </div>
      )}
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
    pdf: null,
  });
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [grupoId, setGrupoId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const data = await fetchDocenteGrupos();
        if (!alive) return;
        setGrupos(data);
        setGrupoId(data[0]?.id || '');
      } catch (err) {
        if (alive) setFormError(err.message || 'No se pudieron cargar los grupos.');
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
      setPdfFile(file);
      setFormData((prev) => ({
        ...prev,
        pdf: file.name,
      }));
    } else {
      alert('Por favor selecciona un PDF válido (máx. 10MB)');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('docente-form-dropzone-active');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('docente-form-dropzone-active');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('docente-form-dropzone-active');
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
      setPdfFile(file);
      setFormData((prev) => ({
        ...prev,
        pdf: file.name,
      }));
    } else {
      alert('Por favor selecciona un PDF válido (máx. 10MB)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!grupoId) {
      setFormError('Selecciona un grupo para asignar la práctica.');
      return;
    }

    if (!formData.title.trim()) {
      setFormError('El título de la práctica es obligatorio.');
      return;
    }

    try {
      setIsSaving(true);
      const uploadedGuide = pdfFile ? await uploadPracticaGuide(pdfFile) : null;
      await createPracticaForGrupo(grupoId, {
        titulo: formData.title.trim(),
        descripcion: formData.description.trim(),
        objetivos: formData.objective.trim(),
        instrucciones: selectedSimulation
          ? `Simulación: ${selectedSimulation.name}. ${selectedSimulation.description}`
          : '',
        simuladorUrl: formData.simulationUrl.trim(),
        simulacionTitulo: selectedSimulation?.name || formData.title.trim(),
        simulacionDescripcion: selectedSimulation?.description || '',
        guiaUrl: uploadedGuide?.url || formData.guideUrl.trim() || null,
        guiaNombre: uploadedGuide?.nombre || pdfFile?.name || null,
        fecha_entrega: formData.duration ? null : null,
      });
      navigate(`/docente/grupo/${grupoId}/practicas`);
    } catch (err) {
      setFormError(err.message || 'No se pudo guardar la práctica.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/docente/grupos');
  };

  return (
    <DocenteLayout
      footerText="© 2026 Plataforma Docente. Todos los derechos reservados."
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
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>

              <button
                type="button"
                className="docente-breadcrumb"
                onClick={() => navigate('/docente')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit',
                }}
                aria-label="Dashboard Docente"
              >
                Dashboard Docente
              </button>
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
              <span className="docente-breadcrumb-current">Crear práctica</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="docente-create-practice-container">
        {/* Form Header */}
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
            <h1 className="docente-create-practice-title">Crear práctica</h1>
          </div>
          <div className="docente-create-practice-badge">
            <span>🏫</span>
            <span>Laboratorio de Física Avanzada</span>
          </div>
        </div>

        {/* Form Card */}
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
                onChange={(e) => setGrupoId(e.target.value)}
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

            {/* Title Input */}
            <div className="docente-form-group">
              <label htmlFor="practice-title" className="docente-form-label">
                Título de la práctica
              </label>
              <input
                id="practice-title"
                name="title"
                type="text"
                placeholder="Ej. Ley de Ohm en circuitos de CC"
                value={formData.title}
                onChange={handleInputChange}
                className="docente-form-input docente-form-input-lg"
              />
            </div>

            {/* Simulation Selection */}
            <div className="docente-form-group">
              <label className="docente-form-label">Simulación interactiva</label>
              <SimulationSelector selected={selectedSimulation} onSelect={setSelectedSimulation} />
            </div>


            <div className="docente-form-group">
              <label htmlFor="simulation-url" className="docente-form-label">
                URL del simulador
              </label>
              <input
                id="simulation-url"
                name="simulationUrl"
                type="text"
                placeholder="/laboratorios/lab_fisica1_virtual/Simulador_CaidaLibre.html"
                value={formData.simulationUrl}
                onChange={handleInputChange}
                className="docente-form-input"
              />
            </div>

            <div className="docente-form-group">
              <label htmlFor="guide-url" className="docente-form-label">
                URL de la gu?a o plantilla de informe
              </label>
              <input
                id="guide-url"
                name="guideUrl"
                type="text"
                placeholder="/laboratorios/lab_fisica1_virtual/Practica_CaidaLibre.html"
                value={formData.guideUrl}
                onChange={handleInputChange}
                className="docente-form-input"
              />
            </div>

            {/* Duration & Difficulty Row */}
            <div className="docente-form-row">
              <div className="docente-form-group">
                <label htmlFor="duration" className="docente-form-label">
                  Duración estimada (minutos)
                </label>
                <div className="docente-form-input-wrapper">
                  <span className="docente-form-input-icon">⏱️</span>
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

            {/* Text Areas */}
            <div className="docente-form-group">
              <label htmlFor="objective" className="docente-form-label">
                Objetivo pedagógico
              </label>
              <textarea
                id="objective"
                name="objective"
                placeholder="Describe el objetivo principal de aprendizaje..."
                value={formData.objective}
                onChange={handleInputChange}
                className="docente-form-textarea"
                rows="3"
              ></textarea>
            </div>

            <div className="docente-form-group">
              <label htmlFor="description" className="docente-form-label">
                Descripción detallada
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Proporcione instrucciones paso a paso o contexto teórico..."
                value={formData.description}
                onChange={handleInputChange}
                className="docente-form-textarea"
                rows="5"
              ></textarea>
            </div>

            {/* PDF Upload */}
            <div className="docente-form-group">
              <label className="docente-form-label">Guía de laboratorio (PDF)</label>
              <div
                className="docente-form-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  className="docente-form-dropzone-input"
                  aria-label="Subir PDF"
                />
                <div className="docente-form-dropzone-content">
                  <span className="docente-form-dropzone-icon">☁️</span>
                  <div className="docente-form-dropzone-text">
                    <p className="docente-form-dropzone-main">
                      {pdfFile ? `Archivo: ${pdfFile.name}` : 'Haz clic para subir o arrastra y suelta'}
                    </p>
                    {!pdfFile && <p className="docente-form-dropzone-secondary">PDF hasta 10MB</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="docente-form-actions">
              <button
                type="button"
                className="docente-form-btn docente-form-btn-secondary"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button type="submit" className="docente-form-btn docente-form-btn-primary" disabled={isSaving}>
                <span>💾</span>
                Guardar práctica
              </button>
            </div>
          </form>
        </div>
      </div>
    </DocenteLayout>
  );
}
