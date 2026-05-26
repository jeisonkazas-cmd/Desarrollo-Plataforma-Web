import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ArrowLeftIcon, BookIcon, TrashIcon, PlusIcon } from '../components/AdminIcons';
import { getMockContenido, subirContenido } from '../services/adminService';
import '../../../styles/admin.css';

export default function GestionContenido() {
  const navigate = useNavigate();
  const [contenidos, setContenidos] = useState(getMockContenido());
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'simulacion',
    url: '',
  });

  const filteredContenidos = useMemo(() => {
    return contenidos.filter((c) => {
      const matchSearch =
        search.length === 0 ||
        c.titulo.toLowerCase().includes(search.toLowerCase());
      const matchTipo = filterTipo === 'todos' || c.tipo === filterTipo;
      return matchSearch && matchTipo;
    });
  }, [contenidos, search, filterTipo]);

  const handleSaveContenido = () => {
    if (!formData.titulo || !formData.url) {
      alert('Por favor completa todos los campos');
      return;
    }

    setContenidos([...contenidos, subirContenido(formData)]);
    setShowUploadModal(false);
    setFormData({ titulo: '', tipo: 'simulacion', url: '' });
  };

  const handleDeleteContenido = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contenido?')) {
      setContenidos(contenidos.filter((c) => c.id !== id));
    }
  };

  const resumen = {
    total: contenidos.length,
    simulaciones: contenidos.filter((c) => c.tipo === 'simulacion').length,
    recursos: contenidos.filter((c) => c.tipo === 'recurso').length,
    descargarTotal: contenidos.reduce((sum, c) => sum + c.descargas, 0),
  };

  return (
    <AdminLayout
      topBand={
        <div className="admin-nav-band">
          <div className="admin-nav-band-inner">
            <button
              type="button"
              className="admin-breadcrumb"
              onClick={() => navigate('/')}
              aria-label="Volver al inicio"
            >
              <ArrowLeftIcon size={14} />
              Inicio
              <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            </button>
            <button
              type="button"
              className="admin-breadcrumb"
              onClick={() => navigate('/dashboard/admin')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit',
                color: 'inherit',
              }}
            >
              Dashboard Administrador
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <span className="admin-breadcrumb-current">Gestión de Contenido</span>
          </div>
        </div>
      }
    >
      <div className="admin-page-header">
        <div className="admin-header-content">
          <div className="admin-header-title">
            <BookIcon />
            <h1>Gestión de Contenido</h1>
          </div>
          <p>Administra laboratorios, simulaciones y recursos educativos</p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          <PlusIcon size={18} />
          Subir contenido
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📚</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Total contenidos</p>
            <p className="admin-stat-value">{resumen.total}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🔬</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Simulaciones</p>
            <p className="admin-stat-value">{resumen.simulaciones}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📄</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Recursos</p>
            <p className="admin-stat-value">{resumen.recursos}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📊</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Descargas totales</p>
            <p className="admin-stat-value">{resumen.descargarTotal}</p>
          </div>
        </div>
      </div>

      <div className="admin-filters-section">
        <div className="admin-search-box">
          <span>🔎</span>
          <input
            type="text"
            placeholder="Buscar contenido"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="admin-filter-select"
        >
          <option value="todos">Todos los tipos</option>
          <option value="simulacion">Simulaciones</option>
          <option value="recurso">Recursos</option>
        </select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Fecha creación</th>
              <th>Descargas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredContenidos.length > 0 ? (
              filteredContenidos.map((contenido) => (
                <tr key={contenido.id}>
                  <td className="admin-table-name">{contenido.titulo}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${contenido.tipo}`}>
                      {contenido.tipo === 'simulacion' ? '🔬' : '📄'} {contenido.tipo}
                    </span>
                  </td>
                  <td>
                    {new Date(contenido.fechaCreacion).toLocaleDateString('es-ES')}
                  </td>
                  <td className="admin-table-number">{contenido.descargas}</td>
                  <td>
                    <span className="admin-badge admin-badge-activo">
                      ✓ {contenido.estado}
                    </span>
                  </td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-btn-icon admin-btn-delete"
                      onClick={() => handleDeleteContenido(contenido.id)}
                      title="Eliminar"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="admin-table-empty">
                  No se encontró contenido
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showUploadModal && (
        <div className="admin-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Subir nuevo contenido</h2>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ej: Caída Libre"
                />
              </div>

              <div className="admin-form-group">
                <label>Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                >
                  <option value="simulacion">Simulación</option>
                  <option value="recurso">Recurso</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>URL o ruta</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="Ej: /laboratorios/caida_libre.html"
                />
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setShowUploadModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleSaveContenido}
              >
                Subir contenido
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
