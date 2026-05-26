import React from 'react';
import PropTypes from 'prop-types';

/**
 * Barra lateral con instrucciones e información de la práctica
 * Solo se muestra en modo 'sim'
 */
function InstruccionesSidebar({ practica, isVisible }) {
  if (!isVisible) {
    return null;
  }

  const estadoText = practica?.estado?.charAt(0).toUpperCase() + practica?.estado?.slice(1) || 'Pendiente';

  return (
    <aside className="lab-sidebar">
      {/* Sección de Instrucciones */}
      <section className="student-sidebar-card">
        <h3>Instrucciones</h3>
        <p>
          {practica?.instrucciones || 'Sigue las indicaciones de la práctica y registra tus resultados.'}
        </p>
        <div className="student-instruction-list">
          <ul>
            <li>Captura de pantalla de la simulación</li>
            <li>Tabla de datos obtenidos</li>
            <li>Gráfica(s) generada(s)</li>
            <li>Análisis y conclusiones</li>
          </ul>
        </div>
      </section>

      {/* Sección de Información */}
      <section className="student-sidebar-card">
        <h3>Información</h3>
        <div className="student-info-group">
          <label>Estado:</label>
          <span className={`student-badge student-badge-${practica?.estado || 'pendiente'}`}>
            {estadoText}
          </span>
        </div>
        <div className="student-info-group">
          <label>Fecha de entrega:</label>
          <p>
            {practica?.fechaEntrega
              ? new Date(practica.fechaEntrega).toLocaleDateString('es-ES')
              : '—'}
          </p>
        </div>
        {practica?.calificacion && (
          <div className="student-info-group">
            <label>Calificación:</label>
            <p>
              <strong>{practica.calificacion} / 5.0</strong>
            </p>
          </div>
        )}
      </section>

      {/* Nota importante */}
      <section className="student-sidebar-card">
        <h3>Nota importante</h3>
        <p>
          La simulación no guarda datos en la plataforma. Debes generar tu propio informe en PDF o Word y subirlo aquí.
        </p>
      </section>
    </aside>
  );
}

InstruccionesSidebar.propTypes = {
  practica: PropTypes.shape({
    estado: PropTypes.string,
    instrucciones: PropTypes.string,
    fechaEntrega: PropTypes.string,
    calificacion: PropTypes.number,
  }),
  isVisible: PropTypes.bool.isRequired,
};

InstruccionesSidebar.defaultProps = {
  practica: {},
};

export default InstruccionesSidebar;
