import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentBreadcrumb({ items }) {
  const navigate = useNavigate();

  return (
    <nav className="student-breadcrumb" aria-label="Navegación por migas de pan">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <span className="student-breadcrumb-sep"> &gt; </span>}
          {item.href ? (
            <button
              type="button"
              className="student-breadcrumb-link"
              onClick={() => navigate(item.href)}
            >
              {item.label}
            </button>
          ) : (
            <span className="student-breadcrumb-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
