import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimulacionesCarrusel from '../components/SimulacionesCarrusel';

function CardIcon({ name }) {
  const common = {
    width: 56,
    height: 56,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  };

  switch (name) {
    case 'quienes':
      return (
        <svg {...common}>
          <path
            d="M12 12c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M20 22c0-4.4183-3.5817-8-8-8s-8 3.5817-8 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'investigacion':
      return (
        <svg {...common}>
          <path
            d="M10 3h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M9 3v5.2a7 7 0 1 0 6 0V3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 9h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      );
    case 'noticias':
      return (
        <svg {...common}>
          <path
            d="M7 7h10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7 11h10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7 15h7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

function Home() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <SimulacionesCarrusel />

      <section className="info-adicional">
        <div className="info-texto">
          <h2>Institución Universitaria Antonio José Camacho</h2>
          <h4>Laboratorios de Física al alcance de toda la comunidad universitaria</h4>
          <p>
            Explora, experimenta y aprende desde cualquier lugar. Nuestra plataforma integra 
            laboratorios <strong>presenciales, virtuales y remotos</strong> para brindarte una 
            experiencia académica innovadora, flexible y de calidad.
          </p>
          <button onClick={() => navigate('/simulaciones')} className="btn-explorar">
            Explorar Laboratorios
          </button>
        </div>
        <div className="info-imagen">
          <img 
            src="/imagenes/logo_camacho.png" 
            alt="Logo UNIAJC" 
            style={{ maxWidth: '200px' }}
          />
        </div>
      </section>

      <section className="card-container">
        <div className="card">
          <div className="card-icon" aria-hidden="true">
            <CardIcon name="quienes" />
          </div>
          <h3>Quiénes Somos</h3>
          <p>
            El Departamento de Ciencias Básicas de la UNIAJC pone a disposición de la comunidad 
            universitaria sus laboratorios de Física, ofreciendo servicios de apoyo académico 
            y asesoría técnica para prácticas experimentales.
          </p>
          <button 
            onClick={() => navigate('/quienes-somos')}
            className="btn-ver-mas"
          >
            Ver más
          </button>
        </div>

        <div className="card">
          <div className="card-icon" aria-hidden="true">
            <CardIcon name="investigacion" />
          </div>
          <h3>Investigación y Semilleros</h3>
          <p>
            Fomentamos la cultura investigativa a través de semilleros donde estudiantes y 
            docentes trabajan colaborativamente en proyectos de ciencia aplicada e innovación 
            en física experimental.
          </p>
          <button 
            onClick={() => navigate('/investigacion')}
            className="btn-ver-mas"
          >
            Ver más
          </button>
        </div>

        <div className="card">
          <div className="card-icon" aria-hidden="true">
            <CardIcon name="noticias" />
          </div>
          <h3>Noticias y Eventos</h3>
          <p>
            Mantente al día con las últimas novedades del Departamento de Ciencias Básicas: jornadas de laboratorio abierto,
            talleres especializados, ferias de ciencia, eventos académicos y actividades para la comunidad.
          </p>
          <button type="button" className="btn-ver-mas" disabled>
            Ver más
          </button>
        </div>
      </section>

      <footer style={{ 
        backgroundColor: '#093f7c', 
        color: 'white', 
        padding: '20px',
        textAlign: 'center',
        marginTop: '30px'
      }}>
        <p>© 2026 Laboratorios de Física - UNIAJC. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
