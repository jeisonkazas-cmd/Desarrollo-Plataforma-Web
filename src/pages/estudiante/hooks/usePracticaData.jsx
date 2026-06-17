import { useCallback, useEffect, useState } from 'react';
import { getPracticaDetalle } from '../services/estudianteService';

export function usePracticaData(practicaId) {
  const [practica, setPractica] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPractica = useCallback(async () => {
    if (!practicaId) {
      setLoading(false);
      return;
    }

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
  }, [practicaId]);

  useEffect(() => {
    loadPractica();
  }, [loadPractica]);

  return { practica, loading, error, reload: loadPractica };
}
