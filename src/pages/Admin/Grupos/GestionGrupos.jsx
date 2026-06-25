import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ArrowLeftIcon, EyeIcon, PencilIcon, PlusIcon, TrashIcon, UsersIcon } from '../components/AdminIcons';
import { deleteGrupoAdmin, fetchGruposAdmin, updateGrupoAdmin } from '../services/adminSupabaseService';
import '../../../styles/admin.css';

const initialForm = {
  nombre: '',
  descripcion: '',
  estado: 'activo',
};

export default function GestionGrupos() {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const loadGrupos = async () => {
    try {
      setError('');
      setLoading(true);
      setGrupos(await fetchGruposAdmin());
    } catch (err) {
      console.error('Error cargando grupos:', err);
      if (err?.status === 403) {
        navigate('/pendiente', { replace: true });
        return;
      }
      setError(err?.message || 'No se pudieron cargar los grupos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrupos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const filteredGrupos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return grupos.filter((grupo) => {
      const text = `${grupo.nombre} ${grupo.descripcion}`.toLowerCase();
      const matchSearch = !normalizedSearch || text.includes(normalizedSearch);
      const matchEstado = filterEstado === 'todos' || grupo.estado === filterEstado;
      return matchSearch && matchEstado;
    });
  }, [grupos, search, filterEstado]);

  const resumen = {
    total: grupos.length,
    activos: grupos.filter((grupo) => grupo.estado === 'activo').length,
    inactivos: grupos.filter((grupo) => grupo.estado === 'inactivo').length,
    estudiantes: grupos.reduce((total, grupo) => total + Number(grupo.estudiantes || 0), 0),
  };

  const handleOpenModal = (grupo) => {
    setSelectedGroup(grupo);
    setFormData({
      nombre: grupo.nombre ?? '',
      descripcion: grupo.descripcion ?? '',
      estado: grupo.estado ?? 'activo',
    });
    setShowModal(true);
  };

  const handleSaveGroup = async () => {
    if (!selectedGroup) return;

    if (!formData.nombre.trim()) {
      alert('El nombre del grupo es obligatorio.');
      return;
    }

    try {
      await updateGrupoAdmin(selectedGroup.id, formData);
      await loadGrupos();
      setShowModal(false);
      setSelectedGroup(null);
    } catch (err) {
      console.error('Error guardando grupo:', err);
      alert(err?.message || 'No se pudo guardar el grupo.');
    }
  };

  const handleToggleEstado = async (grupo) => {
    const nuevoEstado = grupo.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      await updateGrupoAdmin(grupo.id, { estado: nuevoEstado });
      await loadGrupos();
    } catch (err) {
      console.error('Error actualizando grupo:', err);
      alert(err?.message || 'No se pudo cambiar el estado del grupo.');
    }
  };

  const handleDeactivateGroup = async (grupo) => {
    if (!window.confirm(`¿Deseas desactivar el grupo "${grupo.nombre}"?`)) return;

    try {
      await deleteGrupoAdmin(grupo.id);
      await loadGrupos();
    } catch (err) {
      console.error('Error desactivando grupo:', err);
      alert(err?.message || 'No se pudo desactivar el grupo.');
    }
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
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <button
              type="button"
              className="admin-breadcrumb"
              onClick={() => navigate('/dashboard/admin')}
            >
              Dashboard Administrador
            </button>
            <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
            <span className="admin-breadcrumb-current">Gestión de Grupos</span>
          </div>
        </div>
      }
    >
      <div className="admin-page-header">
        <div className="admin-header-content">
          <div className="admin-header-title">
            <UsersIcon />
            <h1>Gestión de Grupos</h1>
          </div>
          <p>Administra el estado y la información general de los grupos académicos.</p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={loadGrupos}
          disabled={loading}
        >
          <PlusIcon size={18} />
          Actualizar lista
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Total grupos</p>
            <p className="admin-stat-value">{resumen.total}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Activos</p>
            <p className="admin-stat-value">{resumen.activos}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Inactivos</p>
            <p className="admin-stat-value">{resumen.inactivos}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Estudiantes vinculados</p>
            <p className="admin-stat-value">{resumen.estudiantes}</p>
          </div>
        </div>
      </div>

      <div className="admin-filters-section">
        <div className="admin-search-box">
          <span>Buscar</span>
          <input
            type="text"
            placeholder="Buscar por nombre o descripción"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={filterEstado}
          onChange={(event) => setFilterEstado(event.target.value)}
          className="admin-filter-select"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estudiantes</th>
              <th>Docentes</th>
              <th>Prácticas</th>
              <th>Estado</th>
              <th>Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="admin-table-empty">
                  Cargando grupos...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="admin-table-empty">
                  {error}
                </td>
              </tr>
            ) : filteredGrupos.length > 0 ? (
              filteredGrupos.map((grupo) => (
                <tr key={grupo.id}>
                  <td className="admin-table-name">{grupo.nombre}</td>
                  <td>{grupo.descripcion || 'Sin descripción'}</td>
                  <td>{grupo.estudiantes}</td>
                  <td>{grupo.docentes}</td>
                  <td>{grupo.practicas}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${grupo.estado}`}>
                      {grupo.estado}
                    </span>
                  </td>
                  <td className="admin-table-date">{grupo.fechaCreacion || 'Sin fecha'}</td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-btn-icon admin-btn-view"
                      onClick={() => handleOpenModal(grupo)}
                      title="Editar"
                    >
                      <PencilIcon size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-btn-icon admin-btn-toggle"
                      onClick={() => handleToggleEstado(grupo)}
                      title={grupo.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    >
                      <EyeIcon size={16} />
                    </button>
                    {grupo.estado === 'activo' && (
                      <button
                        type="button"
                        className="admin-btn-icon admin-btn-delete"
                        onClick={() => handleDeactivateGroup(grupo)}
                        title="Desactivar"
                      >
                        <TrashIcon size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="admin-table-empty">
                  No se encontraron grupos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Editar grupo</h2>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
              >
                x
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(event) => setFormData({ ...formData, nombre: event.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Descripción</label>
                <textarea
                  rows="4"
                  value={formData.descripcion}
                  onChange={(event) => setFormData({ ...formData, descripcion: event.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Estado</label>
                <select
                  value={formData.estado}
                  onChange={(event) => setFormData({ ...formData, estado: event.target.value })}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button type="button" className="admin-btn-primary" onClick={handleSaveGroup}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
