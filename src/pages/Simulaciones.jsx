import React from 'react';

function Simulaciones() {
  return (
    <div className="App">
      <section className="hero-section">
        <h1>Simulaciones Interactivas</h1>
        <p>Experimenta con fenómenos físicos</p>
        <p>Aprende interactuando con nuestras simulaciones educativas</p>
      </section>

      <section className="card-container" style={{ margin: '40px' }}>
        <div className="card">
          <div className="card-icon">
          </div>
          <h3>Caída Libre</h3>
          <p>
            Explora el movimiento de objetos bajo la influencia de la gravedad. 
            Aprende cómo la altura, masa y resistencia del aire afectan la caída.
          </p>
          <a href="#caida-libre" className="btn-ver-mas">Abrir Simulación</a>
        </div>

        <div className="card">
          <div className="card-icon">
          </div>
          <h3>Equilibrio de Tensiones</h3>
          <p>
            Aprende cómo las fuerzas se equilibran en sistemas estáticos. 
            Modifica ángulos y masas para entender el equilibrio de fuerzas.
          </p>
          <a href="#equilibrio" className="btn-ver-mas">Abrir Simulación</a>
        </div>

        <div className="card">
          <div className="card-icon">
          </div>
          <h3>Plano Inclinado</h3>
          <p>
            Experimenta con fuerzas en planos inclinados y fricción. 
            Varía el ángulo y el coeficiente de fricción para ver cómo cambia el movimiento.
          </p>
          <a href="#plano-inclinado" className="btn-ver-mas">Abrir Simulación</a>
        </div>

        <div className="card">
          <div className="card-icon">
          </div>
          <h3>Colisiones</h3>
          <p>
            Estudia colisiones elásticas e inelásticas. 
            Observa cómo se conserva la cantidad de movimiento en diferentes tipos de colisión.
          </p>
          <a href="#colisiones" className="btn-ver-mas">Abrir Simulación</a>
        </div>

        <div className="card">
          <div className="card-icon">
          </div>
          <h3>Campo Magnético</h3>
          <p>
            Visualiza campos magnéticos y su interacción con cargas eléctricas. 
            Experimenta con diferentes configuraciones de imanes.
          </p>
          <a href="#campo-magnetico" className="btn-ver-mas">Abrir Simulación</a>
        </div>

        <div className="card">
          <div className="card-icon">
          </div>
          <h3>Movimiento Circular</h3>
          <p>
            Aprende sobre aceleración centrípeta y movimiento circular uniforme. 
            Modifica velocidad y radio para ver los efectos en la trayectoria.
          </p>
          <a href="#movimiento-circular" className="btn-ver-mas">Abrir Simulación</a>
        </div>
      </section>

      <section style={{ padding: '40px', backgroundColor: '#f5f5f5', margin: '40px 0' }}>
        <h2 style={{ textAlign: 'center', color: '#093f7c' }}>Cómo Usar las Simulaciones</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ol style={{ lineHeight: '1.8', fontSize: '16px' }}>
            <li><strong>Selecciona una simulación:</strong> Elige el fenómeno físico que deseas explorar.</li>
            <li><strong>Lee las instrucciones:</strong> Cada simulación incluye instrucciones y explicaciones teóricas.</li>
            <li><strong>Experimenta libremente:</strong> Modifica los parámetros y observa los resultados en tiempo real.</li>
            <li><strong>Analiza los datos:</strong> Utiliza los gráficos y números para validar tus hipótesis.</li>
            <li><strong>Aprende del error:</strong> Si algo no funciona como esperabas, intenta entender por qué.</li>
          </ol>
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

export default Simulaciones;