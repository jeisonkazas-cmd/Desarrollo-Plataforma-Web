import React from 'react';

function Investigacion() {
  return (
    <div className="App">
      <section className="hero-section">
        <h1>Investigación y Semilleros</h1>
        <p>Grupo de Investigación Científica - UNIAJC</p>
      </section>

      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '45px 25px' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#093f7c', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>
            Grupos de Investigación
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            El Departamento de Ciencias Básicas fomenta la cultura investigativa a través de 
            diversos grupos de investigación en los que estudiantes y docentes trabajan de manera 
            colaborativa en proyectos de ciencia aplicada e innovación tecnológica.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#093f7c', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>
            Semilleros de Investigación
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            Los semilleros de investigación son espacios de formación para estudiantes interesados 
            en desarrollar habilidades científicas y tecnológicas. Ofrecemos oportunidades en:
          </p>
          <ul style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555' }}>
            <li>Física Experimental</li>
            <li>Tecnología Educativa</li>
            <li>Modelado Computacional</li>
            <li>Innovación en Laboratorios Virtuales</li>
          </ul>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#093f7c', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>
            Líneas de Investigación
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '20px', 
              borderRadius: '8px',
              borderLeft: '5px solid #FFD100'
            }}>
              <h4 style={{ color: '#093f7c' }}>Física Fundamental</h4>
              <p>Estudios en mecánica clásica, termodinámica y electromagnetismo.</p>
            </div>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '20px', 
              borderRadius: '8px',
              borderLeft: '5px solid #FFD100'
            }}>
              <h4 style={{ color: '#093f7c' }}>Simulaciones Digitales</h4>
              <p>Desarrollo de herramientas computacionales para educación en Física.</p>
            </div>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '20px', 
              borderRadius: '8px',
              borderLeft: '5px solid #FFD100'
            }}>
              <h4 style={{ color: '#093f7c' }}>Tecnología Aplicada</h4>
              <p>Innovación en equipos y métodos experimentales.</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#093f7c', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>
            Logros Recientes
          </h2>
          <ul style={{ fontSize: '1rem', lineHeight: '1.8', color: '#555' }}>
            <li>Desarrollo de plataforma de laboratorios virtuales integrados</li>
            <li>Publicación de investigaciones en revistas indexadas</li>
            <li>Participación en congresos nacionales e internacionales</li>
            <li>Implementación de semilleros en 5 líneas de investigación</li>
            <li>Convenios de colaboración con instituciones externas</li>
          </ul>
        </div>

        <div style={{ 
          backgroundColor: '#093f7c', 
          color: 'white',
          padding: '20px', 
          borderRadius: '8px'
        }}>
          <h3 style={{ marginTop: 0 }}>¿Interesado en unirte?</h3>
          <p>Contacta al Departamento de Ciencias Básicas para conocer las oportunidades 
          de participación en nuestros semilleros e investigación.</p>
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

export default Investigacion;
