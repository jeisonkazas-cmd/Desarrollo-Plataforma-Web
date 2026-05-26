import React from 'react';

export default function StateFilterTabs({ activeFilter, onFilterChange }) {
  const filters = ['Todos', 'Pendientes', 'Entregados', 'Calificados'];

  return (
    <div className="student-filter-tabs" role="tablist">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          role="tab"
          aria-selected={activeFilter === filter}
          className={`student-filter-tab ${activeFilter === filter ? 'active' : ''}`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
