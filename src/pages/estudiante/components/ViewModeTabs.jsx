import React from 'react';
import PropTypes from 'prop-types';

const VIEW_MODES = [
  { id: 'sim', icon: '[SIM]', label: 'Solo simulación' },
  { id: 'split', icon: '[]', label: 'Simulación + Informe' },
  { id: 'report', icon: '[REP]', label: 'Solo informe' },
];

/**
 * Tabs para seleccionar el modo de visualización (solo simulación, split, solo informe)
 */
function ViewModeTabs({ activeMode, onModeChange }) {
  return (
    <div className="view-mode-tabs">
      {VIEW_MODES.map((mode, index) => (
        <React.Fragment key={mode.id}>
          <button
            className={`mode-tab ${activeMode === mode.id ? 'active' : ''}`}
            onClick={() => onModeChange(mode.id)}
            aria-label={mode.label}
            aria-pressed={activeMode === mode.id}
          >
            <span className="tab-dot" />
            {mode.icon} {mode.label}
          </button>

          {index < VIEW_MODES.length - 1 && <div className="tab-separator" />}
        </React.Fragment>
      ))}
    </div>
  );
}

ViewModeTabs.propTypes = {
  activeMode: PropTypes.oneOf(['sim', 'split', 'report']).isRequired,
  onModeChange: PropTypes.func.isRequired,
};

export default ViewModeTabs;
