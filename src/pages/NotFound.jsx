import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <p className="not-found-code">404</p>
      <h1>Página no encontrada</h1>
      <p>La dirección que intentaste abrir no existe o fue movida.</p>
      <Link to="/" className="btn-ver-mas">Volver al inicio</Link>
    </main>
  );
}
