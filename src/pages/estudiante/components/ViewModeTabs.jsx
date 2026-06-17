import React from 'react';
import PropTypes from 'prop-types';

const VIEW_MODES = [
  { id: 'sim', label: 'Solo simulación' },
  { id: 'split', label: 'Simulación + Informe' },
  { id: 'report', label: 'Solo informe' },
  { id: 'submission', label: 'Entrega' },
];

function ViewModeTabs({ activeMode, onModeChange }) {
  return (
    <div className="view-mode-tabs">
      {VIEW_MODES.map((mode, index) => (
        <React.Fragment key={mode.id}>
          <button
            type="button"
            className={`mode-tab ${activeMode === mode.id ? 'active' : ''}`}
            onClick={() => onModeChange(mode.id)}
            aria-label={mode.label}
            aria-pressed={activeMode === mode.id}
          >
            <span className="tab-dot" />
            {mode.label}
          </button>

          {index < VIEW_MODES.length - 1 && <div className="tab-separator" />}
        </React.Fragment>
      ))}
    </div>
  );
}

ViewModeTabs.propTypes = {
  activeMode: PropTypes.oneOf(['sim', 'split', 'report', 'submission']).isRequired,
  onModeChange: PropTypes.func.isRequired,
};

export default ViewModeTabs;
