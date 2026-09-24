import React from 'react';

export default function StateFilterTabs({ activeFilter, onFilterChange }) {
  const filters = [
    { value: 'todos', label: 'Todos' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'entregado', label: 'Entregados' },
    { value: 'calificado', label: 'Calificados' },
  ];

  return (
    <div className="student-filter-tabs" role="tablist">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          role="tab"
          aria-selected={activeFilter === filter.value}
          className={`student-filter-tab ${activeFilter === filter.value ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
