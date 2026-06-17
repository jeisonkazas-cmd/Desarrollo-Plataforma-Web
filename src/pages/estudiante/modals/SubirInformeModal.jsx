import React, { useState } from 'react';

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function SubirInformeModal({ open, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    setError('');
    if (selectedFile.size > MAX_SIZE) {
      setError('El archivo no puede superar 10 MB.');
      return;
    }
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Solo se permiten PDF o Word (.doc, .docx).');
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (event) => {
    validateAndSetFile(event.target.files?.[0]);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    validateAndSetFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Selecciona un archivo primero.');
      return;
    }

    try {
      setSubmitting(true);
      await onUpload(file);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="student-modal-overlay" onClick={onClose}>
      <div className="student-modal-content" onClick={(event) => event.stopPropagation()}>
        <div className="student-modal-header">
          <h2>Subir informe</h2>
          <button
            type="button"
            className="student-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            x
          </button>
        </div>

        <div className="student-modal-body">
          <div
            className="student-upload-zone"
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
          >
            <p className="student-upload-icon">Archivo</p>
            <p className="student-upload-text">Arrastra tu archivo aquí</p>
            <span className="student-upload-or">o</span>
            <label className="student-upload-label">
              Selecciona un archivo
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {error && <p className="student-upload-error">{error}</p>}

          {file && (
            <div className="student-file-preview">
              <p className="student-file-name">{file.name}</p>
              <p className="student-file-size">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                className="student-file-remove"
                onClick={() => {
                  setFile(null);
                  setError('');
                }}
              >
                Eliminar
              </button>
            </div>
          )}

          <p className="student-upload-note">
            Formatos permitidos: PDF, Word (.doc, .docx) | Tamaño máximo: 10 MB
          </p>
        </div>

        <div className="student-modal-footer">
          <button type="button" className="student-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="student-btn-submit"
            onClick={handleSubmit}
            disabled={!file || submitting}
          >
            {submitting ? 'Subiendo...' : 'Subir informe'}
          </button>
        </div>
      </div>
    </div>
  );
}
