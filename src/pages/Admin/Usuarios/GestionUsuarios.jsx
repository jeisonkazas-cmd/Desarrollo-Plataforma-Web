import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ArrowLeftIcon, UsersIcon, PencilIcon, TrashIcon, EyeIcon, PlusIcon } from '../components/AdminIcons';
import { deleteUsuarioAdmin, fetchUsuariosAdmin, updateUsuarioAdmin } from '../services/adminApiService';
import '../../../styles/admin.css';

export default function GestionUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterRol, setFilterRol] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'estudiante',
    estado: 'activo',
  });

  const loadUsuarios = async () => {
    try {
      setError('');
      setLoading(true);
      const rows = await fetchUsuariosAdmin();
      setUsuarios(rows);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      if (err?.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      if (err?.status === 403) {
        navigate('/pendiente', { replace: true });
        return;
      }
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((user) => {
      const matchSearch =
        search.length === 0 ||
        user.nombre.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchRol = filterRol === 'todos' || user.rol === filterRol;
      const matchEstado = filterEstado === 'todos' || user.estado === filterEstado;
      return matchSearch && matchRol && matchEstado;
    });
  }, [usuarios, search, filterRol, filterEstado]);

  const handleOpenModal = (user) => {
    if (!user) return;
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre ?? '',
      email: user.email ?? '',
      rol: user.rol ?? 'estudiante',
      estado: user.estado ?? 'pendiente',
    });
    setShowModal(true);
  };

  const handleSaveUser = async () => {
    if (!formData.nombre || !formData.email) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (!selectedUser) return;

    try {
      await updateUsuarioAdmin(selectedUser.id, formData);
      await loadUsuarios();
      setShowModal(false);
    } catch (err) {
      console.error('Error guardando usuario:', err);
      alert('No se pudo guardar el usuario.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await deleteUsuarioAdmin(id);
        await loadUsuarios();
      } catch (err) {
        console.error('Error eliminando usuario:', err);
        alert('No se pudo eliminar el usuario.');
      }
    }
  };

  const handleToggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'activo' ? 'suspendido' : 'activo';
    try {
      await updateUsuarioAdmin(id, { estado: nuevoEstado });
      await loadUsuarios();
    } catch (err) {
      console.error('Error actualizando estado:', err);
      alert('No se pudo cambiar el estado del usuario.');
    }
  };

  const resumen = {
    total: usuarios.length,
    estudiantes: usuarios.filter((u) => u.rol === 'estudiante').length,
    docentes: usuarios.filter((u) => u.rol === 'docente').length,
    admins: usuarios.filter((u) => u.rol === 'admin').length,
    activos: usuarios.filter((u) => u.estado === 'activo').length,
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
            <span className="admin-breadcrumb-current">Gestión de Usuarios</span>
          </div>
        </div>
      }
    >
      <div className="admin-page-header">
        <div className="admin-header-content">
          <div className="admin-header-title">
            <UsersIcon />
            <h1>Gestión de Usuarios</h1>
          </div>
          <p>Administra roles, permisos y estado de cuentas de usuarios</p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={loadUsuarios}
          disabled={loading}
        >
          <PlusIcon size={18} />
          Actualizar lista
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">👥</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Total usuarios</p>
            <p className="admin-stat-value">{resumen.total}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🎓</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Estudiantes</p>
            <p className="admin-stat-value">{resumen.estudiantes}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">👨‍🏫</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Docentes</p>
            <p className="admin-stat-value">{resumen.docentes}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">⚙️</div>
          <div className="admin-stat-content">
            <p className="admin-stat-label">Activos</p>
            <p className="admin-stat-value">{resumen.activos}</p>
          </div>
        </div>
      </div>

      <div className="admin-filters-section">
        <div className="admin-search-box">
          <span>🔎</span>
          <input
            type="text"
            placeholder="Buscar por nombre o email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-group">
          <select
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="admin-filter-select"
          >
            <option value="todos">Todos los roles</option>
            <option value="estudiante">Estudiantes</option>
            <option value="docente">Docentes</option>
            <option value="admin">Administradores</option>
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="admin-filter-select"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="suspendido">Suspendidos</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Último acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="admin-table-empty">
                  Cargando usuarios…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="admin-table-empty">
                  {error}
                </td>
              </tr>
            ) : filteredUsuarios.length > 0 ? (
              filteredUsuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="admin-table-name">{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${usuario.rol}`}>
                      {usuario.rol === 'estudiante' ? '🎓' : usuario.rol === 'docente' ? '👨‍🏫' : '⚙️'}{' '}
                      {usuario.rol}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge-${usuario.estado}`}>
                      {usuario.estado === 'activo' ? '✓' : '⚠️'} {usuario.estado}
                    </span>
                  </td>
                  <td className="admin-table-date">
                    {usuario.ultimoAcceso
                      ? new Date(usuario.ultimoAcceso).toLocaleDateString('es-ES')
                      : 'Nunca'}
                  </td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-btn-icon admin-btn-view"
                      onClick={() => handleOpenModal(usuario)}
                      title="Editar"
                    >
                      <PencilIcon size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-btn-icon admin-btn-toggle"
                      onClick={() => handleToggleEstado(usuario.id, usuario.estado)}
                      title={usuario.estado === 'activo' ? 'Suspender' : 'Activar'}
                    >
                      <EyeIcon size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-btn-icon admin-btn-delete"
                      onClick={() => handleDeleteUser(usuario.id)}
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
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Editar usuario</h2>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Rol</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <option value="activo">Activo</option>
                  <option value="suspendido">Suspendido</option>
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
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleSaveUser}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
