import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipboardCheck, FileText, MessageSquareText } from 'lucide-react';
import DocenteLayout from '../components/DocenteLayout';
import { ArrowLeftIcon } from '../components/icons';
import '../../../styles/settings-panel.css';
import '../../../styles/docente.css';
import {
  fetchDocenteGrupo,
  fetchInformeDetalle,
  fetchPracticaDetalle,
  saveInformeGrade,
  setInformeReentrega,
} from '../services/docenteService';

const NOTA_MIN = 0.0;
const NOTA_MAX = 5.0;
const FOOTER_TEXT = '© 2026 Universidad - Sistema de Gestión de Prácticas Académicas. Todos los derechos reservados.';

export default function InformeEstudiante() {
  const navigate = useNavigate();
  const { grupoId, practicaId, informeId } = useParams();

  const [grupo, setGrupo] = useState({ nombre: 'Grupo', codigo: '' });
  const [practica, setPractica] = useState({ titulo: 'Práctica' });
  const [informe, setInforme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState({ nota: '', feedback: '', criterios: [] });
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingReentrega, setIsUpdatingReentrega] = useState(false);

  const isNotaValid = () => {
    if (!form.nota.trim()) return false;
    const notaNum = Number.parseFloat(form.nota);
    return !Number.isNaN(notaNum) && notaNum >= NOTA_MIN && notaNum <= NOTA_MAX;
  };

  const rubricaCompleta = form.criterios.length === 0 || form.criterios.every((criterio) => {
    const puntaje = Number(criterio.puntaje);
    return criterio.puntaje !== ''
      && Number.isFinite(puntaje)
      && puntaje >= 0
      && puntaje <= Number(criterio.puntajeMaximo);
  });
  const isSaveDisabled = !isNotaValid() || !rubricaCompleta;

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setLoadError('');
        const [grupoData, practicaData, informeData] = await Promise.all([
          fetchDocenteGrupo(grupoId),
          fetchPracticaDetalle(grupoId, practicaId),
          fetchInformeDetalle(informeId),
        ]);

        if (!alive) return;
        setGrupo(grupoData || { nombre: 'Grupo', codigo: `Grupo ${grupoId}` });
        setPractica(practicaData || { titulo: 'Práctica' });
        setInforme(informeData);
        setForm({
          nota: informeData?.nota ? String(informeData.nota) : '',
          feedback: informeData?.feedback || '',
          criterios: (informeData?.rubrica?.criterios || []).map((criterio) => ({
            ...criterio,
            puntaje: criterio.puntaje ?? '',
          })),
        });
      } catch (err) {
        if (alive) setLoadError(err.message || 'No se pudo cargar el informe.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [grupoId, practicaId, informeId]);

  const handleDownload = () => {
    if (informe?.archivoUrl) {
      window.open(informe.archivoUrl, '_blank');
    }
  };

  const handleCancel = () => {
    navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`);
  };

  const handleSave = async () => {
    if (!isNotaValid()) {
      setFormError(`La nota debe estar entre ${NOTA_MIN} y ${NOTA_MAX}`);
      return;
    }

    try {
      setIsSaving(true);
      await saveInformeGrade(informeId, form.nota, form.feedback, form.criterios);
      navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`);
    } catch (err) {
      setFormError(err.message || 'No se pudo guardar la calificación.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCriterioChange = (criterioId, value) => {
    setForm((prev) => {
      const criterios = prev.criterios.map((criterio) => (
        criterio.id === criterioId ? { ...criterio, puntaje: value } : criterio
      ));
      const completos = criterios.every((criterio) => (
        criterio.puntaje !== '' && !Number.isNaN(Number(criterio.puntaje))
      ));
      const nota = completos
        ? criterios.reduce((sum, criterio) => (
          sum + (Number(criterio.puntaje) / Number(criterio.puntajeMaximo)) * 5 * (Number(criterio.peso) / 100)
        ), 0).toFixed(2)
        : prev.nota;
      return { ...prev, criterios, nota };
    });
  };

  const handleReentrega = async () => {
    try {
      setIsUpdatingReentrega(true);
      const habilitada = !informe.reentregaHabilitada;
      await setInformeReentrega(informeId, habilitada);
      setInforme((prev) => ({ ...prev, reentregaHabilitada: habilitada }));
      setFormError('');
    } catch (err) {
      setFormError(err.message || 'No se pudo actualizar el permiso de reentrega.');
    } finally {
      setIsUpdatingReentrega(false);
    }
  };

  if (loading) {
    return (
      <DocenteLayout footerText={FOOTER_TEXT}>
        <div className="docente-practicas-grupo-empty">
          <p>Cargando informe...</p>
        </div>
      </DocenteLayout>
    );
  }

  if (loadError || !informe) {
    return (
      <DocenteLayout footerText={FOOTER_TEXT}>
        <div className="docente-practicas-grupo-empty">
          <p>{loadError || 'No se encontró el informe.'}</p>
        </div>
      </DocenteLayout>
    );
  }

  return (
    <DocenteLayout
      footerText={FOOTER_TEXT}
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
            <button
              type="button"
              className="docente-breadcrumb"
              onClick={() => navigate(`/docente/grupo/${grupoId}/practicas`)}
            >
              {grupo.nombre} - {grupo.codigo}
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <button
              type="button"
              className="docente-breadcrumb"
              onClick={() => navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`)}
            >
              {practica.titulo}
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <span className="docente-breadcrumb-current">{informe.estudianteNombre}</span>
          </div>
        </div>
      }
    >
      <div className="docente-informe-estudiante-container">
        <div className="docente-informe-estudiante-header">
          <div className="docente-informe-estudiante-header-left">
            <button
              type="button"
              className="docente-informe-estudiante-back-btn"
              onClick={handleCancel}
              aria-label="Volver"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <div>
              <h1 className="docente-informe-estudiante-title">{informe.estudianteNombre}</h1>
              <p className="docente-informe-estudiante-subtitle">Detalle de informe</p>
            </div>
          </div>
          <div className="docente-informe-estudiante-header-right">
            <span className="docente-informe-estudiante-facultad-badge">
              {informe.facultad}
            </span>
          </div>
        </div>

        <div className="docente-informe-estudiante-content">
          <section className="docente-informe-card-section">
            <div className="docente-informe-card-section-header">
              <div className="docente-informe-card-section-icon-wrapper">
                <FileText className="docente-informe-card-section-icon" size={30} aria-hidden="true" />
              </div>
              <div>
                <h2 className="docente-informe-card-section-title">Informe entregado</h2>
                <p className="docente-informe-card-section-subtitle">
                  Documento final de evaluación académica (.pdf)
                </p>
              </div>
            </div>

            <button
              type="button"
              className="docente-informe-download-btn"
              onClick={handleDownload}
              aria-label="Descargar archivo"
            >
              Descargar archivo
            </button>

            <div className="docente-informe-preview-area">
              {informe.archivoUrl ? (
                <iframe
                  src={informe.archivoUrl}
                  title="Vista previa del PDF"
                  className="docente-informe-preview-iframe"
                />
              ) : (
                <span className="docente-informe-preview-text">
                  Vista previa no disponible para este formato
                </span>
              )}
            </div>
          </section>

          {informe.rubrica && (
            <section className="docente-informe-card-section">
              <div className="docente-informe-card-section-header-divider">
                <div>
                  <h2 className="docente-informe-card-section-title">
                    Rúbrica: {informe.rubrica.nombre}
                  </h2>
                  <p className="docente-informe-card-section-subtitle">
                    Califica cada criterio; la nota final se calcula automáticamente.
                  </p>
                </div>
              </div>
              <div className="docente-informe-grading-grid">
                {form.criterios.map((criterio) => (
                  <div className="docente-informe-grading-input-wrapper" key={criterio.id}>
                    <label className="docente-informe-label" htmlFor={`criterio-${criterio.id}`}>
                      {criterio.nombre} ({criterio.peso}%)
                    </label>
                    <input
                      id={`criterio-${criterio.id}`}
                      type="number"
                      min="0"
                      max={criterio.puntajeMaximo}
                      step="0.1"
                      value={criterio.puntaje}
                      onChange={(event) => handleCriterioChange(criterio.id, event.target.value)}
                      className="docente-informe-number-input"
                    />
                    <span>Máximo: {criterio.puntajeMaximo}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="docente-informe-card-section">
            <div className="docente-informe-card-section-header-divider">
              <div className="docente-informe-card-section-icon-wrapper orange">
                <ClipboardCheck className="docente-informe-card-section-icon" size={30} aria-hidden="true" />
              </div>
              <div>
                <h2 className="docente-informe-card-section-title">Calificación</h2>
                <p className="docente-informe-card-section-subtitle">
                  Ingresa la nota numérica final
                </p>
              </div>
            </div>

            <div className="docente-informe-grading-grid">
              <div className="docente-informe-grading-input-wrapper">
                <label htmlFor="grade-input" className="docente-informe-label">
                  Nota final
                </label>
                <div className="docente-informe-input-wrapper">
                  <input
                    id="grade-input"
                    type="number"
                    min={NOTA_MIN}
                    max={NOTA_MAX}
                    step="0.1"
                    placeholder="0.0"
                    value={form.nota}
                    onChange={(event) => {
                      setForm((prev) => ({ ...prev, nota: event.target.value }));
                      setFormError('');
                    }}
                    className="docente-informe-number-input"
                    aria-label="Nota final"
                  />
                  <div className="docente-informe-input-suffix">/ 5.0</div>
                </div>
                {formError && <p className="docente-informe-error-text">{formError}</p>}
              </div>

              <div className="docente-informe-range-container">
                <div className="docente-informe-range-header">
                  <span className="docente-informe-range-label">Rango permitido</span>
                </div>
                <div className="docente-informe-range-display">
                  <span className="docente-informe-range-min">0.0 (Mínimo)</span>
                  <div className="docente-informe-range-bar">
                    <div className="docente-informe-range-bar-fill" />
                  </div>
                  <span className="docente-informe-range-max">5.0 (Máximo)</span>
                </div>
              </div>
            </div>
          </section>

          <section className="docente-informe-card-section">
            <div className="docente-informe-card-section-header-divider">
              <div className="docente-informe-card-section-icon-wrapper emerald">
                <MessageSquareText className="docente-informe-card-section-icon" size={30} aria-hidden="true" />
              </div>
              <div>
                <h2 className="docente-informe-card-section-title">Retroalimentación</h2>
                <p className="docente-informe-card-section-subtitle">
                  Comentarios para el desarrollo del estudiante
                </p>
              </div>
            </div>

            <div className="docente-informe-feedback-wrapper">
              <label htmlFor="feedback" className="docente-informe-label">
                Comentarios constructivos
              </label>
              <textarea
                id="feedback"
                value={form.feedback}
                onChange={(event) => setForm((prev) => ({ ...prev, feedback: event.target.value }))}
                placeholder="Escribe comentarios constructivos para el estudiante sobre su desempeño en este informe..."
                className="docente-informe-textarea"
                rows="6"
                aria-label="Comentarios de retroalimentación"
              />
              <div className="docente-informe-char-counter">
                {form.feedback.length} / 500 caracteres
              </div>
            </div>
          </section>
        </div>

        <footer className="docente-informe-action-footer">
          <button
            type="button"
            className="docente-informe-btn-cancel"
            onClick={handleReentrega}
            disabled={isUpdatingReentrega}
          >
            {isUpdatingReentrega
              ? 'Actualizando...'
              : informe.reentregaHabilitada
                ? 'Bloquear nueva entrega'
                : 'Habilitar nueva entrega'}
          </button>
          <button
            type="button"
            className="docente-informe-btn-cancel"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`docente-informe-btn-save ${isSaveDisabled ? 'disabled' : ''}`}
            onClick={handleSave}
            disabled={isSaveDisabled || isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar calificación'}
          </button>
        </footer>
      </div>
    </DocenteLayout>
  );
}
