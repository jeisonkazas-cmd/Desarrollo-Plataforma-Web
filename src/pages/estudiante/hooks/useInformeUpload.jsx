import { useState, useCallback } from 'react';
import { subirInforme } from '../services/estudianteService';

/**
 * Custom hook para manejar la carga de informes
 * @param {string} practicaId - ID de la práctica
 * @returns {Object} {isUploading, error, uploadFile, clearError}
 */
export function useInformeUpload(practicaId) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file) => {
    if (!practicaId) {
      setError('ID de práctica no disponible');
      return false;
    }

    setIsUploading(true);
    setError(null);

    try {
      await subirInforme(practicaId, file);
      return true;
    } catch (err) {
      const message = err.message || 'Error al subir el informe';
      setError(message);
      return message;
    } finally {
      setIsUploading(false);
    }
  }, [practicaId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { isUploading, error, uploadFile, clearError };
}
