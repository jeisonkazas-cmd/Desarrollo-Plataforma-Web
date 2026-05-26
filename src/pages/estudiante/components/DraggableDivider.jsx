import React from 'react';
import PropTypes from 'prop-types';

/**
 * Divisor arrastrable entre dos paneles
 * Se muestra solo en modo split
 */
function DraggableDivider({
  isVisible,
  onMouseDown,
  onDoubleClick,
}) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="lab-divider"
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      title="Arrastra para ajustar · Doble clic para centrar"
      role="separator"
      aria-label="Divisor de paneles"
    />
  );
}

DraggableDivider.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};

export default DraggableDivider;
