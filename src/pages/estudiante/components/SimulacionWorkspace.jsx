import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import IframePanel from './IframePanel';
import DraggableDivider from './DraggableDivider';
import InstruccionesSidebar from './InstruccionesSidebar';
import EntregaPanel from './EntregaPanel';
import { useDividerDrag } from '../hooks';

function SimulacionWorkspace({
  viewMode,
  splitPercentage,
  onSplitChange,
  practica,
  onResetSplit,
}) {
  const workspaceRef = useRef(null);
  const handleDividerMouseDown = useDividerDrag(workspaceRef, onSplitChange, 25, 75);
  const isSubmissionMode = viewMode === 'submission';

  const isSimulatorHidden = viewMode === 'report' || isSubmissionMode;
  const isReportHidden = viewMode === 'sim' || isSubmissionMode;

  const getSimulatorWidth = () => {
    if (viewMode === 'sim') return '100%';
    if (viewMode === 'split') return `${splitPercentage}%`;
    return '0';
  };

  const getReportWidth = () => {
    if (viewMode === 'report') return '100%';
    if (viewMode === 'split') return `calc(${100 - splitPercentage}% - 6px)`;
    return '0';
  };

  return (
    <div className="lab-workspace" ref={workspaceRef}>
      {isSubmissionMode ? (
        <EntregaPanel practica={practica} />
      ) : (
        <>
          <div
            className="lab-pane pane-sim"
            style={{
              width: getSimulatorWidth(),
              display: isSimulatorHidden ? 'none' : 'block',
            }}
          >
            <IframePanel
              url={practica?.htmlUrl}
              title={practica?.titulo || 'Simulación'}
              isEmpty={false}
            />
          </div>

          <DraggableDivider
            isVisible={viewMode === 'split'}
            onMouseDown={handleDividerMouseDown}
            onDoubleClick={onResetSplit}
          />

          <div
            className="lab-pane pane-report"
            style={{
              width: getReportWidth(),
              display: isReportHidden ? 'none' : 'block',
            }}
          >
            <IframePanel
              url={practica?.informeUrl}
              title="Informe"
              isEmpty={false}
            />
          </div>

          <InstruccionesSidebar practica={practica} isVisible={viewMode === 'sim'} />
        </>
      )}
    </div>
  );
}

SimulacionWorkspace.propTypes = {
  viewMode: PropTypes.oneOf(['sim', 'split', 'report', 'submission']).isRequired,
  splitPercentage: PropTypes.number.isRequired,
  onSplitChange: PropTypes.func.isRequired,
  practica: PropTypes.shape({
    titulo: PropTypes.string,
    htmlUrl: PropTypes.string,
    informeUrl: PropTypes.string,
    informeEntregadoUrl: PropTypes.string,
    archivoNombre: PropTypes.string,
    calificacion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    retroalimentacion: PropTypes.string,
  }),
  onResetSplit: PropTypes.func.isRequired,
};

SimulacionWorkspace.defaultProps = {
  practica: {},
};

export default SimulacionWorkspace;
