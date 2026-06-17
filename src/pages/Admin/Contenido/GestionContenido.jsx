import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ArrowLeftIcon, BookIcon, TrashIcon, PlusIcon } from '../components/AdminIcons';
import {
  createRecursoAdmin,
  deleteRecursoAdmin,
  fetchRecursosAdmin,
} from '../services/adminSupabaseService';
import '../../../styles/admin.css';

const emptyForm = {
  titulo: '',
  tipo: 'guia',
  laboratorio: 'Fisica 1',
  file: null,
};

export default function GestionContenido() {
  const navigate = useNavigate();
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
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
    return recursos.filter((recurso) => {
      const text = `${recurso.titulo} ${recurso.laboratorio} ${recurso.archivoNombre}`.toLowerCase();
      const matchSearch = !search || text.includes(search.toLowerCase());
      const matchTipo = filterTipo === 'todos' || recurso.tipo === filterTipo;
      return matchSearch && matchTipo;
    });
  }, [recursos, search, filterTipo]);

  const handleSaveRecurso = async () => {
    if (!formData.titulo.trim() || !formData.file) {
      alert('Completa el titulo y selecciona un archivo.');
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

  const handleDeleteRecurso = async (recurso) => {
    if (!window.confirm('Estas seguro de desactivar este recurso?')) return;

    try {
      await deleteRecursoAdmin(recurso.id);
      await loadRecursos();
    } catch (err) {
      alert(err?.message || 'No se pudo eliminar el recurso.');
    }
  };

  const resumen = {
    total: recursos.length,
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
            <span className="admin-breadcrumb-current">Catalogo de recursos</span>
          </div>
        </div>
      }
    >
      <div className="admin-page-header">
        <div className="admin-header-content">
          <div className="admin-header-title">
            <BookIcon />
            <h1>Catalogo de guias e informes</h1>
          </div>
          <p>Sube archivos PDF o HTML para que los docentes los asignen a sus practicas.</p>
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
            <p className="admin-stat-label">Guias</p>
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

        <select
          value={filterTipo}
          onChange={(event) => setFilterTipo(event.target.value)}
          className="admin-filter-select"
        >
          <option value="todos">Todos los tipos</option>
          <option value="guia">Guias</option>
          <option value="informe">Informes</option>
        </select>
      </div>

      <div className="admin-table-container">
        {error && <div className="admin-table-empty">{error}</div>}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titulo</th>
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
                      {recurso.tipo}
                    </span>
                  </td>
                  <td>{recurso.laboratorio || 'General'}</td>
                  <td>
                    <a href={recurso.url} target="_blank" rel="noreferrer">
                      {recurso.archivoNombre || 'Abrir archivo'}
                    </a>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-activo">
                      {recurso.estado}
                    </span>
                  </td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="admin-btn-icon admin-btn-delete"
                      onClick={() => handleDeleteRecurso(recurso)}
                      title="Desactivar"
                    >
                      <TrashIcon size={16} />
                    </button>
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
              <h2>Subir guia o informe</h2>
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
                <label>Titulo</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(event) => setFormData({ ...formData, titulo: event.target.value })}
                  placeholder="Ej: Guia cubeta de ondas"
                />
              </div>

              <div className="admin-form-group">
                <label>Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(event) => setFormData({ ...formData, tipo: event.target.value })}
                >
                  <option value="guia">Guia</option>
                  <option value="informe">Informe</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Laboratorio</label>
                <select
                  value={formData.laboratorio}
                  onChange={(event) => setFormData({ ...formData, laboratorio: event.target.value })}
                >
                  <option value="Fisica 1">Fisica 1</option>
                  <option value="Fisica 2">Fisica 2</option>
                  <option value="Fisica 3">Fisica 3</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Archivo PDF o HTML</label>
                <input
                  type="file"
                  accept=".pdf,.html,text/html,application/pdf"
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
