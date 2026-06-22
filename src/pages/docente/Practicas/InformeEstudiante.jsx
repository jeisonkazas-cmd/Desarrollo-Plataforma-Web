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
  const [form, setForm] = useState({ nota: '', feedback: '' });
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isNotaValid = () => {
    if (!form.nota.trim()) return false;
    const notaNum = Number.parseFloat(form.nota);
    return !Number.isNaN(notaNum) && notaNum >= NOTA_MIN && notaNum <= NOTA_MAX;
  };

  const isSaveDisabled = !isNotaValid();

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
      await saveInformeGrade(informeId, form.nota, form.feedback);
      navigate(`/docente/grupo/${grupoId}/practica/${practicaId}`);
    } catch (err) {
      setFormError(err.message || 'No se pudo guardar la calificación.');
    } finally {
      setIsSaving(false);
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
