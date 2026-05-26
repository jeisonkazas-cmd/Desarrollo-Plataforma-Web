import React from 'react';

function QuienesSomos() {
  return (
    <div className="App">
      <section className="hero-section">
        <h1>Quiénes Somos</h1>
        <p>Laboratorio de Física - UNIAJC</p>
      </section>

      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '45px 25px' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#093f7c', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>
            Departamento de Ciencias Básicas
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            El Departamento de Ciencias Básicas de la Institución Universitaria Antonio José Camacho 
            (UNIAJC) pone a disposición de la comunidad universitaria y del sector externo sus 
            laboratorios de Física, ofreciendo servicios de apoyo académico, asesoría técnica y 
            uso de equipos especializados para el desarrollo de prácticas experimentales e 
            investigación aplicada.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#093f7c', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>
            Misión
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            Proporcionar espacios y recursos de excelencia para el desarrollo de prácticas 
            experimentales de Física que fortalezcan la formación integral de nuestros estudiantes, 
            promoviendo el pensamiento crítico y la aplicación del método científico.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#093f7c', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>
            Visión
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            Ser reconocidos como un departamento innovador que integra la tecnología educativa 
            con la experimentación práctica, ofreciendo laboratorios presenciales, virtuales y 
            remotos que preparen a nuestros estudiantes para enfrentar los desafíos del siglo XXI.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#093f7c', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '15px' }}>
            Nuestro Equipo
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
            Contamos con docentes especializados en Física, técnicos en laboratorio y profesionales 
            en educación que trabajan colaborativamente para ofrecer la mejor experiencia educativa 
            a nuestros estudiantes.
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px',
          borderLeft: '5px solid #FFD100'
        }}>
          <h3 style={{ color: '#093f7c', marginTop: 0 }}>Ubicación</h3>
          <p>Edificio de Ciencias - Piso 2<br/>
          Institución Universitaria Antonio José Camacho<br/>
          Cali, Colombia</p>
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

export default QuienesSomos;
