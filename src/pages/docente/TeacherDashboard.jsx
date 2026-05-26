import React from 'react';
import { useNavigate } from 'react-router-dom';
import DocenteLayout from './components/DocenteLayout';
import { ArrowLeftIcon } from './components/icons';
import '../../styles/docente.css';
const summaryCards = [
  {
    id: 1,
    label: 'Total grupos asignados',
    value: 8,
    helper: 'Grupos académicos activos',
    icon: 'groups',
  },
  {
    id: 2,
    label: 'Total prácticas creadas',
    value: 24,
    helper: 'Prácticas publicadas en la plataforma',
    icon: 'practices',
  },
  {
    id: 3,
    label: 'Informes pendientes por calificar',
    value: 13,
    helper: 'Requieren revisión del docente',
    icon: 'pending',
  },
  {
    id: 4,
    label: 'Informes calificados',
    value: 147,
    helper: 'Evaluaciones finalizadas',
    icon: 'graded',
  },
];

function KpiIcon({ kind }) {
  const shared = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true',
  };

  if (kind === 'groups') {
    return (
      <svg {...shared}>
        <path d="M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M22 20v-1a4 4 0 0 0-3-3.88" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 4.12a3 3 0 0 1 0 5.76" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === 'practices') {
    return (
      <svg {...shared}>
        <path d="M9 3h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 3v5l-4.6 7.36A3 3 0 0 0 8 20h8a3 3 0 0 0 2.6-4.64L14 8V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 14h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === 'pending') {
    return (
      <svg {...shared}>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v4.2l2.8 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.5 12 2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const pendingReports = [
  {
    id: 1,
    student: 'Esteban Márquez',
    email: 'esteban@correo.edu',
    group: 'Física I - Grupo 03',
    practice: 'Medición de resistencia y leyes de Ohm',
    date: '2026-04-01',
    status: 'Pendiente',
  },
  {
    id: 2,
    student: 'Valentina Ortega',
    email: 'valentina@correo.edu',
    group: 'Física II - Grupo 01',
    practice: 'Óptica: reflexión y refracción',
    date: '2026-03-30',
    status: 'Pendiente',
  },
  {
    id: 3,
    student: 'Carlos Méndez',
    email: 'carlos@correo.edu',
    group: 'Física I - Grupo 02',
    practice: 'Dinámica y fricción en planos inclinados',
    date: '2026-04-02',
    status: 'Pendiente',
  },
  {
    id: 4,
    student: 'Ana Ruiz',
    email: 'ana@correo.edu',
    group: 'Física II - Grupo 04',
    practice: 'Circuitos RC y respuesta temporal',
    date: '2026-03-29',
    status: 'Pendiente',
  },
  {
    id: 5,
    student: 'Diego Fernández',
    email: 'diego@correo.edu',
    group: 'Física I - Grupo 05',
    practice: 'Conservación de energía en colisiones',
    date: '2026-04-03',
    status: 'Pendiente',
  },
];

const recentGrades = [
  {
    id: 1,
    student: 'Laura Sánchez',
    practice: 'Óptica: reflexión y refracción',
    grade: '8.5',
  },
  {
    id: 2,
    student: 'Miguel Torres',
    practice: 'Circuitos RC',
    grade: '7.0',
  },
  {
    id: 3,
    student: 'Sofía León',
    practice: 'Dinámica en planos inclinados',
    grade: '9.2',
  },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const handleReminder = () => {
    window.alert('Recordatorio enviado al grupo seleccionado (demo).');
  };

  return (
    <>
      <DocenteLayout
        footerText="© 2026 Plataforma Docente. Todos los derechos reservados."
        topBand={
          <div className="docente-nav-band">
            <div className="docente-nav-band-inner">
              <button
                type="button"
                className="docente-breadcrumb"
                onClick={() => navigate('/')}
                aria-label="Volver al inicio"
              >
                <ArrowLeftIcon size={14} />
                Inicio
                <span style={{ margin: '0 4px', opacity: 0.4 }}>&rsaquo;</span>
                <span className="docente-breadcrumb-current">Dashboard Docente</span>
              </button>
            </div>
          </div>
        }
      >
        <div className="docente-page-content docente-dashboard-v2">
          <section className="docente-panel-header" aria-label="Resumen del panel docente">
            <div>
              <h1 className="docente-panel-title">Panel del Docente</h1>
              <p className="docente-panel-subtitle">Seguimiento de informes y gestión académica</p>
            </div>
            <div className="docente-panel-top-actions">
              <button
                type="button"
                className="docente-primary-action"
                onClick={() => navigate('/docente/practicas/crear')}
              >
                Crear práctica
              </button>
              <button
                type="button"
                className="docente-secondary-action"
                onClick={() => navigate('/docente/grupos')}
              >
                Ver grupos
              </button>
            </div>
          </section>

          <section className="docente-kpi-grid" aria-label="Indicadores principales">
            {summaryCards.map((card) => (
              <article key={card.id} className="docente-kpi-card">
                <div className="docente-kpi-top">
                  <p className="docente-kpi-label">{card.label}</p>
                  <span className="docente-kpi-icon" aria-hidden="true">
                    <KpiIcon kind={card.icon} />
                  </span>
                </div>
                <p className="docente-kpi-value">{card.value}</p>
                <p className="docente-kpi-helper">{card.helper}</p>
              </article>
            ))}
          </section>

          <section className="docente-main-grid" aria-label="Zona de trabajo docente">
            <article className="docente-reports-panel">
              <header className="docente-reports-header">
                <h2 className="docente-reports-title">Informes pendientes por calificar</h2>
                <p className="docente-reports-updated">Última actualización: 2 horas</p>
              </header>

              <div className="docente-reports-table-wrap">
                <table className="docente-reports-table">
                  <thead>
                    <tr>
                      <th>Nombre del estudiante</th>
                      <th>Grupo</th>
                      <th>Práctica</th>
                      <th>Fecha de entrega</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingReports.map((report) => (
                      <tr key={report.id}>
                        <td>
                          <div className="docente-student-cell">
                            <div className="docente-student-avatar" aria-hidden="true">
                              {report.student.charAt(0)}
                            </div>
                            <div>
                              <p className="docente-student-name">{report.student}</p>
                              <p className="docente-student-email">{report.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>{report.group}</td>
                        <td>{report.practice}</td>
                        <td>{report.date}</td>
                        <td>
                          <span className="docente-status-tag">{report.status}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="docente-grade-btn"
                            onClick={() => navigate('/docente/grupos')}
                          >
                            Calificar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <aside className="docente-side-panel">
              <section className="docente-quick-actions-card">
                <h3>Acciones rápidas</h3>
                <button
                  type="button"
                  className="docente-quick-btn primary"
                  onClick={() => navigate('/docente/practicas/crear')}
                >
                  Crear práctica
                </button>
                <button
                  type="button"
                  className="docente-quick-btn"
                  onClick={() => navigate('/docente/grupos')}
                >
                  Ver grupos
                </button>
                <button
                  type="button"
                  className="docente-quick-btn"
                  onClick={handleReminder}
                >
                  Enviar recordatorio a un grupo
                </button>
              </section>

              <section className="docente-recent-card">
                <h3>Actividad reciente</h3>
                <ul>
                  {recentGrades.map((activity) => (
                    <li key={activity.id}>
                      <div>
                        <p className="docente-recent-student">{activity.student}</p>
                        <p className="docente-recent-practice">{activity.practice}</p>
                      </div>
                      <span className="docente-recent-grade">{activity.grade}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </section>
        </div>
      </DocenteLayout>
    </>
  );
}
