import { useState, useEffect } from 'react';
import { getPracticaDetalle } from '../services/estudianteService';

/**
 * Custom hook para cargar los datos de una práctica específica
 * @param {string} practicaId - ID de la práctica a cargar
 * @returns {Object} {practica, loading, error}
 */
export function usePracticaData(practicaId) {
  const [practica, setPractica] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!practicaId) {
      setLoading(false);
      return;
    }

    const loadPractica = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPracticaDetalle(practicaId);
        setPractica(data || {});
      } catch (err) {
        setError(err.message || 'Error cargando la práctica');
        setPractica(null);
      } finally {
        setLoading(false);
      }
    };

    loadPractica();
  }, [practicaId]);

  return { practica, loading, error };
}
