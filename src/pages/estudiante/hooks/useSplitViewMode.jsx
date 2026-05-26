import { useState, useCallback } from 'react';

/**
 * Custom hook para gestionar la lógica de vista dividida (split view)
 * @param {string} initialMode - Modo inicial ('sim' | 'split' | 'report')
 * @param {number} initialSplitPct - Porcentaje inicial del split
 * @returns {Object} {viewMode, splitPct, setViewMode, setSplitPct, resetSplit}
 */
export function useSplitViewMode(initialMode = 'sim', initialSplitPct = 55) {
  const [viewMode, setViewMode] = useState(initialMode);
  const [splitPct, setSplitPct] = useState(initialSplitPct);

  const resetSplit = useCallback(() => {
    setSplitPct(initialSplitPct);
  }, [initialSplitPct]);

  return {
    viewMode,
    splitPct,
    setViewMode,
    setSplitPct,
    resetSplit,
  };
}
