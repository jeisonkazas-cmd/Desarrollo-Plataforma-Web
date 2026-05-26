import { useMemo } from 'react';

/**
 * Custom hook para construir los items del breadcrumb basado en los datos de la práctica
 * @param {Object} practica - Datos de la práctica
 * @returns {Array} Array de items para el breadcrumb
 */
export function useBreadcrumbItems(practica) {
  return useMemo(() => {
    const grupoBaseUrl = practica?.grupoId ? `/estudiante/grupos/${practica.grupoId}/practicas` : '/dashboard/estudiante';

    return [
      {
        label: 'Inicio',
        href: '/dashboard/estudiante',
      },
      {
        label: 'Grupo',
        href: grupoBaseUrl,
      },
      {
        label: 'Prácticas del grupo',
        href: grupoBaseUrl,
      },
      {
        label: practica?.titulo || 'Simulación',
      },
    ];
  }, [practica?.grupoId, practica?.titulo]);
}
