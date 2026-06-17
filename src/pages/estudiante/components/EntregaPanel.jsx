import React from 'react';
import PropTypes from 'prop-types';

function EntregaPanel({ practica }) {
  const hasSubmission = Boolean(practica?.informeEntregadoUrl);
  const isGraded = practica?.calificacion !== null && practica?.calificacion !== undefined;

  return (
    <section className="student-delivery-panel">
      <div className="student-delivery-header">
        <div>
          <p className="student-delivery-kicker">Entrega del estudiante</p>
          <h2>Estado de tu informe</h2>
        </div>
        <span className={`student-delivery-status ${isGraded ? 'graded' : hasSubmission ? 'submitted' : 'pending'}`}>
          {isGraded ? 'Calificado' : hasSubmission ? 'Entregado' : 'Pendiente'}
        </span>
      </div>

      {hasSubmission ? (
        <div className="student-delivery-card">
          <div>
            <p className="student-delivery-label">Archivo entregado</p>
            <h3>{practica.archivoNombre || 'Informe enviado'}</h3>
          </div>
          <a
            className="student-delivery-link"
            href={practica.informeEntregadoUrl}
            target="_blank"
            rel="noreferrer"
          >
            Abrir entrega
          </a>
        </div>
      ) : (
        <div className="student-delivery-empty">
          <h3>Aún no has subido tu informe</h3>
          <p>Cuando lo subas, aquí aparecerá el archivo entregado y luego la nota del docente.</p>
        </div>
      )}

      <div className="student-feedback-grid">
        <article className="student-feedback-card">
          <p className="student-delivery-label">Nota</p>
          <strong>{isGraded ? `${practica.calificacion} / 5.0` : 'Sin calificar'}</strong>
        </article>
        <article className="student-feedback-card">
          <p className="student-delivery-label">Retroalimentación</p>
          <p>{practica?.retroalimentacion || 'El docente aún no ha dejado comentarios.'}</p>
        </article>
      </div>
    </section>
  );
}

EntregaPanel.propTypes = {
  practica: PropTypes.shape({
    informeEntregadoUrl: PropTypes.string,
    archivoNombre: PropTypes.string,
    calificacion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    retroalimentacion: PropTypes.string,
  }),
};

EntregaPanel.defaultProps = {
  practica: {},
};

export default EntregaPanel;
