import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchNotificaciones,
  clearNotificaciones,
  deleteNotificacion,
  markNotificacionLeida,
  markNotificacionesLeidas,
} from '../services/notificationService';

function formatNotificationDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function NotificationBell({ enabled }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = useMemo(
    () => items.filter((item) => !item.leida).length,
    [items]
  );

  const load = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      const data = await fetchNotificaciones();
      setItems(data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    load();
    if (!enabled) return undefined;
    const interval = window.setInterval(load, 45000);
    return () => window.clearInterval(interval);
  }, [enabled, load]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!panelRef.current) return;
      if (panelRef.current.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  if (!enabled) return null;

  const handleOpen = () => {
    setOpen((value) => !value);
    if (!open) load();
  };

  const handleItemClick = async (item) => {
    if (!item.leida) {
      await markNotificacionLeida(item.id);
      setItems((current) => current.map((entry) => (
        entry.id === item.id ? { ...entry, leida: true } : entry
      )));
    }
    setOpen(false);
    if (item.urlAccion) navigate(item.urlAccion);
  };

  const handleMarkAll = async () => {
    await markNotificacionesLeidas();
    setItems((current) => current.map((item) => ({ ...item, leida: true })));
  };

  const handleDelete = async (event, notificationId) => {
    event.stopPropagation();
    await deleteNotificacion(notificationId);
    setItems((current) => current.filter((item) => item.id !== notificationId));
  };

  const handleClear = async () => {
    await clearNotificaciones();
    setItems([]);
  };

  return (
    <div className="wl-notifications" ref={panelRef}>
      <button
        type="button"
        className="wl-notification-btn"
        aria-label="Notificaciones"
        aria-expanded={open}
        onClick={handleOpen}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {unreadCount > 0 && <span className="wl-notification-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="wl-notification-panel">
          <div className="wl-notification-panel-header">
            <strong>Notificaciones</strong>
            <div className="wl-notification-header-actions">
              {unreadCount > 0 && (
                <button type="button" onClick={handleMarkAll}>
                  Marcar leídas
                </button>
              )}
              {items.length > 0 && (
                <button type="button" onClick={handleClear}>
                  Quitar todas
                </button>
              )}
            </div>
          </div>

          <div className="wl-notification-list">
            {loading && items.length === 0 ? (
              <p className="wl-notification-empty">Cargando...</p>
            ) : items.length === 0 ? (
              <p className="wl-notification-empty">No tienes notificaciones.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={`wl-notification-item ${item.leida ? '' : 'is-unread'}`}
                >
                  <button
                    type="button"
                    className="wl-notification-content"
                    onClick={() => handleItemClick(item)}
                  >
                    <span className="wl-notification-title">{item.titulo}</span>
                    <span className="wl-notification-message">{item.mensaje}</span>
                    <span className="wl-notification-date">{formatNotificationDate(item.fechaCreacion)}</span>
                  </button>
                  <button
                    type="button"
                    className="wl-notification-remove"
                    aria-label={`Quitar notificación: ${item.titulo}`}
                    onClick={(event) => handleDelete(event, item.id)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
