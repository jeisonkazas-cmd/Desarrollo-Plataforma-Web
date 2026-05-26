import React from 'react';
import PropTypes from 'prop-types';

/**
 * Panel que contiene un iframe (simulador o informe)
 */
function IframePanel({ url, title, isEmpty }) {
  const panelStyle = {
    display: isEmpty ? 'none' : 'block',
  };

  return (
    <div className="lab-pane" style={panelStyle}>
      {url ? (
        <iframe
          src={url}
          title={title}
          className="lab-iframe"
          allow="fullscreen"
        />
      ) : (
        <div className="student-placeholder">
          <p>{title} no disponible aún</p>
        </div>
      )}
    </div>
  );
}

IframePanel.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  isEmpty: PropTypes.bool.isRequired,
};

IframePanel.defaultProps = {
  url: null,
};

export default IframePanel;
