import React from 'react';
import PropTypes from 'prop-types';

/**
 * Encabezado de la página de simulación
 * Muestra el título, descripción y botones de acción
 */
function SimulacionHeader({
  titulo,
  descripcion,
  onGoBack,
  onOpenUploadModal,
  onGoToForum,
  canUpload,
  uploadDisabledReason,
}) {
  return (
    <header className="student-simulacion-header">
      <div>
        <h1>{titulo || 'Simulación'}</h1>
        <p>{descripcion || 'Práctica interactiva'}</p>
      </div>
      <div className="student-simulacion-actions">
        <button
          type="button"
          className="student-btn-back"
          onClick={onGoBack}
          aria-label="Volver a prácticas"
        >
          ← Volver a prácticas
        </button>
        <button
          type="button"
          className="student-btn-upload"
          onClick={onOpenUploadModal}
          disabled={!canUpload}
          title={!canUpload ? uploadDisabledReason : undefined}
          aria-label="Subir informe"
        >
          📤 Subir informe
        </button>
        <button
          type="button"
          className="student-btn-forum"
          onClick={onGoToForum}
          aria-label="Ir al Foro"
        >
          💬 Ir al Foro
        </button>
      </div>
    </header>
  );
}

SimulacionHeader.propTypes = {
  titulo: PropTypes.string,
  descripcion: PropTypes.string,
  onGoBack: PropTypes.func.isRequired,
  onOpenUploadModal: PropTypes.func.isRequired,
  onGoToForum: PropTypes.func.isRequired,
  canUpload: PropTypes.bool,
  uploadDisabledReason: PropTypes.string,
};

SimulacionHeader.defaultProps = {
  canUpload: true,
  uploadDisabledReason: '',
};

export default SimulacionHeader;
