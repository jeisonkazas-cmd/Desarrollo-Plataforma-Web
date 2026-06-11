import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ArrowLeftIcon, BookIcon, TrashIcon, PlusIcon } from '../components/AdminIcons';
import {
  createContenidoAdmin,
  deleteContenidoAdmin,
  fetchContenidoAdmin,
  fetchPracticasCatalogoAdmin,
} from '../services/adminSupabaseService';
import '../../../styles/admin.css';

export default function GestionContenido() {
  const navigate = useNavigate();
  const [contenidos, setContenidos] = useState([]);
  const [practicas, setPracticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'simulacion',
    url: '',
    practicaId: '',
  });

  async function loadContenido() {
    try {
      setLoading(true);
      setError('');
      const [contenidoData, practicasData] = await Promise.all([
        fetchContenidoAdmin(),
        fetchPracticasCatalogoAdmin(),
      ]);
      setContenidos(contenidoData);
      setPracticas(practicasData);
    } catch (err) {
      setError(err?.message || 'No se pudo cargar el contenido.');
      setContenidos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContenido();
  }, []);

  const filteredContenidos = useMemo(() => {
    return contenidos.filter((contenido) => {
      const matchSearch =
        search.length === 0 ||
        contenido.titulo.toLowerCase().includes(search.toLowerCase());
      const matchTipo = filterTipo === 'todos' || contenido.tipo === filterTipo;
      return matchSearch && matchTipo;
    });
  }, [contenidos, search, filterTipo]);

  const handleSaveContenido = async () => {
    if (!formData.titulo || !formData.url || !formData.practicaId) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setSaving(true);
      const nextContenido = await createContenidoAdmin({
        ...formData,
        practicaId: Number(formData.practicaId),
      });
      setContenidos(nextContenido);
      setShowUploadModal(false);
      setFormData({ titulo: '', tipo: 'simulacion', url: '', practicaId: '' });
    } catch (err) {
      alert(err?.message || 'No se pudo guardar el contenido');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContenido = async (contenido) => {
    if (!window.confirm('Estas seguro de que deseas eliminar este contenido?')) return;

    try {
      await deleteContenidoAdmin(contenido);
      await loadContenido();
    } catch (err) {
      alert(err?.message || 'No se pudo eliminar el contenido');
    }
  };

  const resumen = {
    total: contenidos.length,
    simulaciones: contenidos.filter((contenido) => contenido.tipo === 'simulacion').length,
    recursos: contenidos.filter((contenido) => contenido.tipo === 'recurso').length,
    descargarTotal: contenidos.reduce((sum, contenido) => sum + contenido.descargas, 0),
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
            <span className="admin-breadcrumb-current">Gestion de Contenido</span>
          </div>
        </div>
      }
    >
      <div className="admin-page-header">
        <div className="admin-header-content">
          <div className="admin-header-title">
            <BookIcon />
            <h1>Gestion de Contenido</h1>
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
          <div className="admin-stat-content">
            <p className="admin-stat-label">Total contenidos</p>
            <p className="admin-stat-value">{resumen.total}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Simulaciones</p>
            <p className="admin-stat-value">{resumen.simulaciones}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Recursos</p>
            <p className="admin-stat-value">{resumen.recursos}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Descargas totales</p>
            <p className="admin-stat-value">{resumen.descargarTotal}</p>
          </div>
        </div>
      </div>

      <div className="admin-filters-section">
        <div className="admin-search-box">
          <span>Buscar</span>
          <input
            type="text"
            placeholder="Buscar contenido"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={filterTipo}
          onChange={(event) => setFilterTipo(event.target.value)}
          className="admin-filter-select"
        >
          <option value="todos">Todos los tipos</option>
          <option value="simulacion">Simulaciones</option>
          <option value="recurso">Recursos</option>
        </select>
      </div>

      <div className="admin-table-container">
        {error && <div className="admin-table-empty">{error}</div>}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Tipo</th>
              <th>Fecha creacion</th>
              <th>Descargas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="admin-table-empty">
                  Cargando contenido...
                </td>
              </tr>
            ) : filteredContenidos.length > 0 ? (
              filteredContenidos.map((contenido) => (
                <tr key={contenido.id}>
                  <td className="admin-table-name">{contenido.titulo}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${contenido.tipo}`}>
                      {contenido.tipo}
                    </span>
                  </td>
                  <td>
                    {new Date(contenido.fechaCreacion).toLocaleDateString('es-ES')}
                  </td>
                  <td className="admin-table-number">{contenido.descargas}</td>
                  <td>
                    <span className="admin-badge admin-badge-activo">
                      {contenido.estado}
                    </span>
                  </td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-btn-icon admin-btn-delete"
                      onClick={() => handleDeleteContenido(contenido)}
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
                  No se encontro contenido
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showUploadModal && (
        <div className="admin-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Subir nuevo contenido</h2>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                x
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Practica asociada</label>
                <select
                  value={formData.practicaId}
                  onChange={(event) => setFormData({ ...formData, practicaId: event.target.value })}
                >
                  <option value="">Selecciona una practica</option>
                  {practicas.map((practica) => (
                    <option key={practica.id} value={practica.id}>
                      {practica.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label>Titulo</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(event) => setFormData({ ...formData, titulo: event.target.value })}
                  placeholder="Ej: Caida Libre"
                />
              </div>

              <div className="admin-form-group">
                <label>Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(event) => setFormData({ ...formData, tipo: event.target.value })}
                >
                  <option value="simulacion">Simulacion</option>
                  <option value="recurso">Recurso</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>URL o ruta</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(event) => setFormData({ ...formData, url: event.target.value })}
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
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Subir contenido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
