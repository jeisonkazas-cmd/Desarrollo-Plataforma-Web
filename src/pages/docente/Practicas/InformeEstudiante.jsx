import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DocenteLayout from '../components/DocenteLayout';
import { ArrowLeftIcon } from '../components/icons';
import '../../../styles/settings-panel.css';
import '../../../styles/docente.css';
import { getMockGrupos, getMockPracticasByGrupo, getMockInformeDetalle } from '../../../mock/docenteMock';

const NOTA_MIN = 0.0;
const NOTA_MAX = 5.0;

export default function InformeEstudiante() {
  const navigate = useNavigate();
  const { grupoId, practicaId, informeId } = useParams();

  const grupo = useMemo(() => {
    const grupos = getMockGrupos();
    return grupos.find((g) => g.id === grupoId) || { nombre: 'Grupo', codigo: '' };
  }, [grupoId]);

  const practica = useMemo(() => {
    const practicas = getMockPracticasByGrupo(grupoId);
    return practicas.find((p) => p.id === practicaId) || { titulo: 'Práctica' };
  }, [grupoId, practicaId]);

  const informe = useMemo(() => {
    return getMockInformeDetalle(informeId);
  }, [informeId]);

  const [form, setForm] = useState({
    nota: informe.nota ? String(informe.nota) : '',
    feedback: informe.feedback || '',
  });

  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isNotaValid = () => {
    if (!form.nota.trim()) return false;
    const notaNum = parseFloat(form.nota);
    return !isNaN(notaNum) && notaNum >= NOTA_MIN && notaNum <= NOTA_MAX;
  };

  const isSaveDisabled = !isNotaValid();

  const handleNotaChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, nota: value }));
    setFormError('');
  };

  const handleFeedbackChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, feedback: value }));
  };

  const handleDownload = () => {
    if (informe.archivoUrl) {
      window.open(informe.archivoUrl, '_blank');
    }
  };

  const handleCancel = () => {
    navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`);
  };

  const handleSave = () => {
    if (!isNotaValid()) {
      setFormError(
        `La nota debe estar entre ${NOTA_MIN} y ${NOTA_MAX}`
      );
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  return (
    <DocenteLayout
      footerText="© 2026 Universidad - Sistema de Gestión de Prácticas Académicas. Todos los derechos reservados."
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
              >
                Dashboard Docente
              </button>
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
              <button
                type="button"
                className="docente-breadcrumb"
                onClick={() => navigate('/docente/grupos')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit',
                }}
              >
                Grupos
              </button>
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
              <button
                type="button"
                className="docente-breadcrumb"
                onClick={() => navigate(`/docente/grupo/${grupoId}/practicas`)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit',
                }}
              >
                {grupo.nombre} - {grupo.codigo}
              </button>
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
              <button
                type="button"
                className="docente-breadcrumb"
                onClick={() => navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit',
                }}
              >
                {practica.titulo}
              </button>
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
              <span className="docente-breadcrumb-current">
                {informe.estudianteNombre}
              </span>
            </button>
          </div>
        </div>
      }
    >
      <div className="docente-informe-estudiante-container">
        {/* Header */}
        <div className="docente-informe-estudiante-header">
          <div className="docente-informe-estudiante-header-left">
            <button
              type="button"
              className="docente-informe-estudiante-back-btn"
              onClick={() => navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`)}
              aria-label="Volver"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <div>
              <h1 className="docente-informe-estudiante-title">
                {informe.estudianteNombre}
              </h1>
              <p className="docente-informe-estudiante-subtitle">
                Detalle de informe
              </p>
            </div>
          </div>
          <div className="docente-informe-estudiante-header-right">
            <span className="docente-informe-estudiante-facultad-badge">
              🎓 {informe.facultad}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="docente-informe-estudiante-content">
          {/* Card 1: Archivo del Informe */}
          <section className="docente-informe-card-section">
            <div className="docente-informe-card-section-header">
              <div className="docente-informe-card-section-icon-wrapper">
                <div className="docente-informe-card-section-icon">📄</div>
              </div>
              <div>
                <h2 className="docente-informe-card-section-title">
                  Informe entregado
                </h2>
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
              <span>📥</span>
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
                <>
                  <span className="docente-informe-preview-icon">👁️</span>
                  <span className="docente-informe-preview-text">
                    Vista previa no disponible para este formato
                  </span>
                </>
              )}
            </div>
          </section>

          {/* Card 2: Calificación */}
          <section className="docente-informe-card-section">
            <div className="docente-informe-card-section-header-divider">
              <div className="docente-informe-card-section-icon-wrapper orange">
                <div className="docente-informe-card-section-icon">⭐</div>
              </div>
              <div>
                <h2 className="docente-informe-card-section-title">
                  Calificación
                </h2>
                <p className="docente-informe-card-section-subtitle">
                  Ingrese la nota numérica final
                </p>
              </div>
            </div>

            <div className="docente-informe-grading-grid">
              <div className="docente-informe-grading-input-wrapper">
                <label
                  htmlFor="grade-input"
                  className="docente-informe-label"
                >
                  Nota Final
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
                    onChange={handleNotaChange}
                    className="docente-informe-number-input"
                    aria-label="Nota final"
                  />
                  <div className="docente-informe-input-suffix">/ 5.0</div>
                </div>
                {formError && (
                  <p className="docente-informe-error-text">{formError}</p>
                )}
              </div>

              <div className="docente-informe-range-container">
                <div className="docente-informe-range-header">
                  <span className="docente-informe-range-info-icon">ℹ️</span>
                  <span className="docente-informe-range-label">
                    RANGO PERMITIDO
                  </span>
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

          {/* Card 3: Retroalimentación */}
          <section className="docente-informe-card-section">
            <div className="docente-informe-card-section-header-divider">
              <div className="docente-informe-card-section-icon-wrapper emerald">
                <div className="docente-informe-card-section-icon">💬</div>
              </div>
              <div>
                <h2 className="docente-informe-card-section-title">
                  Retroalimentación
                </h2>
                <p className="docente-informe-card-section-subtitle">
                  Comentarios para el desarrollo del estudiante
                </p>
              </div>
            </div>

            <div className="docente-informe-feedback-wrapper">
              <label
                htmlFor="feedback"
                className="docente-informe-label"
              >
                Comentarios constructivos
              </label>
              <textarea
                id="feedback"
                value={form.feedback}
                onChange={handleFeedbackChange}
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

        {/* Action Buttons */}
        <footer className="docente-informe-action-footer">
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
            <span>💾</span>
            {isSaving ? 'Guardando...' : 'Guardar calificación'}
          </button>
        </footer>
      </div>
    </DocenteLayout>
  );
}
