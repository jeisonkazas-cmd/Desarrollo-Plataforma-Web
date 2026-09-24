import React from 'react';

const featuredSimulations = [
  {
    title: 'Caída Libre',
    description: 'Explora el movimiento de objetos bajo la influencia de la gravedad.',
    url: '/laboratorios/lab_fisica1_virtual/Simulador_CaidaLibre.html',
  },
  {
    title: 'Movimiento rectilíneo',
    description: 'Compara el movimiento uniforme y el uniformemente acelerado.',
    url: '/laboratorios/lab_fisica1_virtual/Simulador_MUR-MUA.html',
  },
  {
    title: 'Leyes de Newton',
    description: 'Experimenta con fuerzas, masa, aceleración y movimiento sobre un plano.',
    url: '/laboratorios/lab_fisica1_virtual/Simulador_Leyes_de_Newton_Plano.html',
  },
  {
    title: 'Campo Magnético',
    description: 'Visualiza la dependencia del campo magnético y sus variables principales.',
    url: '/laboratorios/lab_fisica2_virtual/Simulador_Dependencia_campo_Magnetico.html',
  },
  {
    title: 'Ley de Coulomb',
    description: 'Analiza la fuerza eléctrica entre cargas y cómo cambia con la distancia.',
    url: '/laboratorios/lab_fisica2_virtual/Simulador_Ley_Coulomb.html',
  },
  {
    title: 'Ondas estacionarias',
    description: 'Observa nodos, antinodos y patrones de interferencia en ondas estacionarias.',
    url: '/laboratorios/lab_fisica3_virtual/Simulador_Ondas_Estacionarias.html',
  },
];

function Simulaciones() {
  return (
    <div className="App">
      <section className="hero-section">
        <h1>Simulaciones Interactivas</h1>
        <p>Experimenta con fenómenos físicos</p>
        <p>Aprende interactuando con nuestras simulaciones educativas</p>
      </section>

      <section className="card-container" style={{ margin: '40px' }}>
        {featuredSimulations.map((simulation) => (
          <div className="card" key={simulation.url}>
            <div className="card-icon" aria-hidden="true" />
            <h3>{simulation.title}</h3>
            <p>{simulation.description}</p>
            <a href={simulation.url} className="btn-ver-mas">Abrir Simulación</a>
          </div>
        ))}
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
