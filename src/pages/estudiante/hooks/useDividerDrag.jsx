import { useCallback, useRef } from 'react';

/**
 * Custom hook para manejar el arrastre del divisor en una vista split
 * @param {React.MutableRefObject} workspaceRef - Referencia al contenedor workspace
 * @param {Function} onSplitChange - Callback cuando cambia el porcentaje del split
 * @param {number} minPct - Porcentaje mínimo permitido (default 25)
 * @param {number} maxPct - Porcentaje máximo permitido (default 75)
 * @returns {Function} Handler para el mouseDown del divisor
 */
export function useDividerDrag(
  workspaceRef,
  onSplitChange,
  minPct = 25,
  maxPct = 75
) {
  const isDraggingRef = useRef(false);

  const handleDividerMouseDown = useCallback(() => {
    isDraggingRef.current = true;

    // Cambiar cursor a col-resize
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    // Bloquear eventos de los iframes para que no interfieran con el drag
    const iframes = document.querySelectorAll('.lab-iframe');
    iframes.forEach((iframe) => {
      iframe.style.pointerEvents = 'none';
    });

    const handleMouseMove = (event) => {
      if (!isDraggingRef.current || !workspaceRef.current) return;

      const workspaceRect = workspaceRef.current.getBoundingClientRect();
      const percentage = ((event.clientX - workspaceRect.left) / workspaceRect.width) * 100;
      
      // Aplicar límites de porcentaje
      const constrainedPercentage = Math.min(Math.max(percentage, minPct), maxPct);
      onSplitChange(constrainedPercentage);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      // Restaurar eventos en iframes
      const iframes = document.querySelectorAll('.lab-iframe');
      iframes.forEach((iframe) => {
        iframe.style.pointerEvents = '';
      });

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [workspaceRef, onSplitChange, minPct, maxPct]);

  return handleDividerMouseDown;
}
