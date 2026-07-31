import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ArrowLeftIcon, BookIcon, EyeIcon, PlusIcon, TrashIcon } from '../components/AdminIcons';
import {
  createRecursoAdmin,
  deleteRecursoAdmin,
  fetchRecursosAdmin,
  updateRecursoAdmin,
} from '../services/adminSupabaseService';
import '../../../styles/admin.css';

const emptyForm = {
  titulo: '',
  tipo: 'simulacion',
  laboratorio: 'Física 1',
  file: null,
};

const tipoLabels = {
  simulacion: 'Simulación',
  guia: 'Guía',
  informe: 'Informe',
};

export default function GestionContenido() {
  const navigate = useNavigate();
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  async function loadRecursos() {
    try {
      setLoading(true);
      setError('');
      setRecursos(await fetchRecursosAdmin());
    } catch (err) {
      setError(err?.message || 'No se pudieron cargar los recursos.');
      setRecursos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecursos();
  }, []);

  const filteredRecursos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return recursos.filter((recurso) => {
      const text = `${recurso.titulo} ${recurso.laboratorio} ${recurso.archivoNombre}`.toLowerCase();
      const matchSearch = !normalizedSearch || text.includes(normalizedSearch);
      const matchTipo = filterTipo === 'todos' || recurso.tipo === filterTipo;
      const matchEstado = filterEstado === 'todos' || recurso.estado === filterEstado;
      return matchSearch && matchTipo && matchEstado;
    });
  }, [recursos, search, filterTipo, filterEstado]);

  const handleSaveRecurso = async () => {
    if (!formData.titulo.trim() || !formData.file) {
      alert('Completa el título y selecciona un archivo.');
      return;
    }

    try {
      setSaving(true);
      setRecursos(await createRecursoAdmin(formData));
      setShowUploadModal(false);
      setFormData(emptyForm);
    } catch (err) {
      alert(err?.message || 'No se pudo subir el recurso.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRecurso = async (recurso) => {
    const nuevoEstado = recurso.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      setRecursos(await updateRecursoAdmin(recurso.id, { estado: nuevoEstado }));
    } catch (err) {
      alert(err?.message || 'No se pudo cambiar el estado del recurso.');
    }
  };

  const handleDeleteRecurso = async (recurso) => {
    if (!window.confirm(`¿Deseas desactivar "${recurso.titulo}"?`)) return;

    try {
      await deleteRecursoAdmin(recurso.id);
      await loadRecursos();
    } catch (err) {
      alert(err?.message || 'No se pudo desactivar el recurso.');
    }
  };

  const resumen = {
    total: recursos.length,
    simulaciones: recursos.filter((recurso) => recurso.tipo === 'simulacion').length,
    guias: recursos.filter((recurso) => recurso.tipo === 'guia').length,
    informes: recursos.filter((recurso) => recurso.tipo === 'informe').length,
    activos: recursos.filter((recurso) => recurso.estado === 'activo').length,
  };

  return (
    <AdminLayout
      topBand={
        <div className="admin-nav-band">
          <div className="admin-nav-band-inner">
            <button
              type="button"
              className="admin-breadcrumb"
              onClick={() => navigate('/dashboard/admin')}
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
            <span className="admin-breadcrumb-current">Catálogo de recursos</span>
          </div>
        </div>
      }
    >
      <div className="admin-page-header">
        <div className="admin-header-content">
          <div className="admin-header-title">
            <BookIcon />
            <h1>Catálogo de simulaciones, guías e informes</h1>
          </div>
          <p>Sube archivos HTML o PDF para que los docentes los asignen a sus prácticas.</p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          <PlusIcon size={18} />
          Subir recurso
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Total recursos</p>
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
            <p className="admin-stat-label">Guías</p>
            <p className="admin-stat-value">{resumen.guias}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Informes</p>
            <p className="admin-stat-value">{resumen.informes}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-content">
            <p className="admin-stat-label">Activos</p>
            <p className="admin-stat-value">{resumen.activos}</p>
          </div>
        </div>
      </div>

      <div className="admin-filters-section">
        <div className="admin-search-box">
          <span>Buscar</span>
          <input
            type="text"
            placeholder="Buscar recurso"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="admin-filter-group">
          <select
            value={filterTipo}
            onChange={(event) => setFilterTipo(event.target.value)}
            className="admin-filter-select"
          >
            <option value="todos">Todos los tipos</option>
            <option value="simulacion">Simulaciones</option>
            <option value="guia">Guías</option>
            <option value="informe">Informes</option>
          </select>

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
      </div>

      <div className="admin-table-container">
        {error && <div className="admin-table-empty">{error}</div>}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Laboratorio</th>
              <th>Archivo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="admin-table-empty">
                  Cargando recursos...
                </td>
              </tr>
            ) : filteredRecursos.length > 0 ? (
              filteredRecursos.map((recurso) => (
                <tr key={recurso.id}>
                  <td className="admin-table-name">{recurso.titulo}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${recurso.tipo}`}>
                      {tipoLabels[recurso.tipo] || recurso.tipo}
                    </span>
                  </td>
                  <td>{recurso.laboratorio || 'General'}</td>
                  <td>
                    <a href={recurso.url} target="_blank" rel="noreferrer">
                      {recurso.archivoNombre || 'Abrir archivo'}
                    </a>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge-${recurso.estado}`}>
                      {recurso.estado}
                    </span>
                  </td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-btn-icon admin-btn-toggle"
                      onClick={() => handleToggleRecurso(recurso)}
                      title={recurso.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    >
                      <EyeIcon size={16} />
                    </button>
                    {recurso.estado === 'activo' && (
                      <button
                        type="button"
                        className="admin-btn-icon admin-btn-delete"
                        onClick={() => handleDeleteRecurso(recurso)}
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
                <td colSpan="6" className="admin-table-empty">
                  No se encontraron recursos.
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
              <h2>Subir simulación, guía o informe</h2>
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
                <label>Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(event) => setFormData({ ...formData, titulo: event.target.value })}
                  placeholder="Ej: Cubeta de ondas"
                />
              </div>

              <div className="admin-form-group">
                <label>Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(event) => setFormData({ ...formData, tipo: event.target.value })}
                >
                  <option value="simulacion">Simulación</option>
                  <option value="guia">Guía</option>
                  <option value="informe">Informe</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Laboratorio</label>
                <select
                  value={formData.laboratorio}
                  onChange={(event) => setFormData({ ...formData, laboratorio: event.target.value })}
                >
                  <option value="Física 1">Física 1</option>
                  <option value="Física 2">Física 2</option>
                  <option value="Física 3">Física 3</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Archivo HTML o PDF</label>
                <input
                  type="file"
                  accept=".html,.htm,.pdf,text/html,application/pdf"
                  onChange={(event) => setFormData({ ...formData, file: event.target.files?.[0] || null })}
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
                onClick={handleSaveRecurso}
                disabled={saving}
              >
                {saving ? 'Subiendo...' : 'Subir recurso'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
