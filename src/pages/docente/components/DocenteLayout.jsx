import React from 'react';
import '../../../styles/docente.css';

export default function DocenteLayout({
  topBand,
  children,
  footerText = '© 2026 Plataforma Docente. Todos los derechos reservados.',
}) {
  return (
    <div className="docente-container">
      {topBand}
      <main className="docente-main">{children}</main>

      <footer className="docente-footer">
        <div className="docente-footer-content">
          <p className="docente-footer-text">{footerText}</p>
        </div>
      </footer>
    </div>
  );
}
