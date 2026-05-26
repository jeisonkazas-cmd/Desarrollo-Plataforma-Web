import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom hook que encapsula la lógica de navegación del componente Simulación
 * @param {Object} practica - Datos de la práctica
 * @param {string} practicaId - ID de la práctica
 * @returns {Object} {goBackToGroup, goToForum}
 */
export function useSimulacionNavigation(practica, practicaId) {
  const navigate = useNavigate();

  const goBackToGroup = useCallback(() => {
    const baseUrl = practica?.grupoId
      ? `/estudiante/grupos/${practica.grupoId}/practicas`
      : '/dashboard/estudiante';
    navigate(baseUrl);
  }, [navigate, practica?.grupoId]);

  const goToForum = useCallback(() => {
    if (practica?.grupoId) {
      navigate(`/estudiante/practicas/${practicaId}/foro/${practica.grupoId}`);
    }
  }, [navigate, practica?.grupoId, practicaId]);

  return { goBackToGroup, goToForum };
}
