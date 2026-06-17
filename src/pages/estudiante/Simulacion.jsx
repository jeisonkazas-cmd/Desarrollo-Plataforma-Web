import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import StudentBreadcrumb from './components/StudentBreadcrumb';
import SubirInformeModal from './modals/SubirInformeModal';
import SimulacionHeader from './components/SimulacionHeader';
import ViewModeTabs from './components/ViewModeTabs';
import SimulacionWorkspace from './components/SimulacionWorkspace';
import LoadingScreen from './components/LoadingScreen';
import {
  usePracticaData,
  useSplitViewMode,
  useBreadcrumbItems,
  useInformeUpload,
  useSimulacionNavigation,
} from './hooks';
import '../../styles/estudiante.css';

function Simulacion() {
  const { practicaId } = useParams();

  const { practica, loading } = usePracticaData(practicaId);

  const {
    viewMode,
    splitPct,
    setViewMode,
    setSplitPct,
    resetSplit,
  } = useSplitViewMode('split', 55);

  const { goBackToGroup, goToForum } = useSimulacionNavigation(practica, practicaId);

  const breadcrumbItems = useBreadcrumbItems(practica);

  const { uploadFile } = useInformeUpload(practicaId);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleOpenUploadModal = useCallback(() => {
    setViewMode('report');
    setTimeout(() => {
      setShowUploadModal(true);
    }, 300);
  }, [setViewMode]);

  const handleUploadInforme = useCallback(async (file) => {
    const result = await uploadFile(file);
    if (result === true) {
      setShowUploadModal(false);
      window.alert('Informe subido correctamente');
    } else {
      window.alert(typeof result === 'string' ? result : 'Error al subir el informe');
    }
  }, [uploadFile]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="student-simulacion-page">
      <StudentBreadcrumb items={breadcrumbItems} />

      <SimulacionHeader
        titulo={practica?.titulo}
        descripcion={practica?.descripcion}
        onGoBack={goBackToGroup}
        onOpenUploadModal={handleOpenUploadModal}
        onGoToForum={goToForum}
      />

      <ViewModeTabs
        activeMode={viewMode}
        onModeChange={setViewMode}
      />

      <SimulacionWorkspace
        viewMode={viewMode}
        splitPercentage={splitPct}
        onSplitChange={setSplitPct}
        practica={practica}
        onResetSplit={resetSplit}
      />

      {/* Modal de upload */}
      <SubirInformeModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadInforme}
      />
    </div>
  );
}

export default Simulacion;
