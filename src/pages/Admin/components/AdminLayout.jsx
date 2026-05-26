import React from 'react';
import '../../../styles/admin.css';

export default function AdminLayout({
  topBand,
  children,
  footerText = '© 2026 Plataforma Universitaria - Panel de Administración. Todos los derechos reservados.',
}) {
  return (
    <div className="admin-container">
      {topBand}
      <main className="admin-main">{children}</main>

      <footer className="admin-footer">
        <div className="admin-footer-content">
          <p className="admin-footer-text">{footerText}</p>
        </div>
      </footer>
    </div>
  );
}
