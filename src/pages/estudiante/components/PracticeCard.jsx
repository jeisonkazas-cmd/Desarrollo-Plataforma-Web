import React from 'react';

export default function PracticeCard({ practice, onVerDetalle }) {
  const getStateBadgeClass = (state) => {
    switch (state) {
      case 'pendiente':
        return 'student-badge-pending';
      case 'entregado':
        return 'student-badge-submitted';
      case 'calificado':
        return 'student-badge-graded';
      default:
        return '';
    }
  };

  return (
    <article className="student-practice-card">
      <div className="student-practice-card-head">
        <h3>{practice.titulo}</h3>
        <span className={`student-practice-badge ${getStateBadgeClass(practice.estado)}`}>
          {practice.estado}
        </span>
      </div>

      <p className="student-practice-description">{practice.descripcion || 'Sin descripción'}</p>

      <div className="student-practice-meta">
        <div>
          <span className="student-meta-label">Fecha de entrega:</span>
          <span className="student-meta-value">{practice.fecha || 'N/A'}</span>
        </div>
        {practice.puntaje !== undefined && (
          <div>
            <span className="student-meta-label">Puntaje:</span>
            <span className="student-meta-value">{practice.puntaje}</span>
          </div>
        )}
      </div>

      <button
        type="button"
        className="student-practice-btn"
        onClick={() => onVerDetalle(practice.id)}
      >
        Ver detalle
      </button>
    </article>
  );
}
