const GRUPOS = [
  {
    id: '1',
    nombre: 'Física I - 3303A',
    semester: '2024-I',
    docente: 'Dr. Juan Pérez',
    horario: 'Lun/Mié 10:00-12:00',
    salon: 'L-301',
    activo: true,
  },
  {
    id: '2',
    nombre: 'Química General - 2204B',
    semester: '2024-I',
    docente: 'Dra. María López',
    horario: 'Mar/Jue 14:00-16:00',
    salon: 'L-205',
    activo: true,
  },
  {
    id: '3',
    nombre: 'Álgebra Lineal - 1502C',
    semester: '2024-I',
    docente: 'Dr. Carlos Ruiz',
    horario: 'Lun/Mié 08:00-10:00',
    salon: 'Aula 401',
    activo: true,
  },
  {
    id: '4',
    nombre: 'Programación I - 3401D',
    semester: '2023-II',
    docente: 'Ing. Ana García',
    horario: 'Mar/Jue 16:00-18:00',
    salon: 'Lab Comp 1',
    activo: false,
  },
];

const PRACTICAS = [
  // Física I - Virtual
  {
    id: '1',
    grupoId: '1',
    titulo: 'Caída Libre',
    descripcion: 'Estudio experimental de la caída libre de objetos bajo la influencia de la gravedad.',
    htmlUrl: '/laboratorios/lab_fisica1_virtual/Simulador_CaidaLibre.html',
    informeUrl: '/laboratorios/lab_fisica1_virtual/Practica_CaidaLibre.html',
    tipo: 'virtual',
    estado: 'pendiente',
    fechaEntrega: '2024-05-15',
    fechaCalificacion: null,
    calificacion: null,
    instrucciones: 'Realiza mínimo 5 mediciones. Captura pantallas y genera gráficos.',
  },
  {
    id: '2',
    grupoId: '1',
    titulo: 'Ley de Hooke',
    descripcion: 'Análisis de la elasticidad y la relación entre fuerza y deformación.',
    htmlUrl: '/laboratorios/lab_fisica1_virtual/Simulador_LeyDeHooke.html',
    informeUrl: '/laboratorios/lab_fisica1_virtual/Practica_LeyDeHooke.html',
    tipo: 'virtual',
    estado: 'entregado',
    fechaEntrega: '2024-05-08',
    fechaCalificacion: '2024-05-10',
    calificacion: 4.2,
    instrucciones: 'Mide constantes de resortes distintos. Compara resultados.',
  },
  {
    id: '3',
    grupoId: '1',
    titulo: 'Leyes de Newton - Plano Inclinado',
    descripcion: 'Verificación experimental de las tres leyes de Newton con movimiento en plano inclinado.',
    htmlUrl: '/laboratorios/lab_fisica1_virtual/Simulador_Leyes_de_Newton_Plano.html',
    informeUrl: '/laboratorios/lab_fisica1_virtual/Practica_Leyes_de_Newto_Plano.html',
    tipo: 'virtual',
    estado: 'calificado',
    fechaEntrega: '2024-05-01',
    fechaCalificacion: '2024-05-05',
    calificacion: 4.5,
    instrucciones: 'Varía ángulos y masas. Determina aceleración teórica vs experimental.',
  },
  {
    id: '4',
    grupoId: '1',
    titulo: 'Movimiento Parabólico',
    descripcion: 'Análisis del movimiento de proyectiles en dos dimensiones.',
    htmlUrl: '/laboratorios/lab_fisica1_virtual/Simulador_parabolico_3D.html',
    informeUrl: '/laboratorios/lab_fisica1_virtual/Practica_MovimientoParabolico.html',
    tipo: 'virtual',
    estado: 'pendiente',
    fechaEntrega: '2024-05-22',
    fechaCalificacion: null,
    calificacion: null,
    instrucciones: 'Prueba con distintos ángulos. Calcula alcance máximo y altura máxima.',
  },
  {
    id: '5',
    grupoId: '1',
    titulo: 'Cinemática (MUR-MUA)',
    descripcion: 'Movimiento rectilíneo uniforme y uniformemente acelerado.',
    htmlUrl: '/laboratorios/lab_fisica1_virtual/Simulador_MUR-MUA.html',
    informeUrl: '/laboratorios/lab_fisica1_virtual/Practica_MUR-MUA.html',
    tipo: 'virtual',
    estado: 'entregado',
    fechaEntrega: '2024-04-30',
    fechaCalificacion: '2024-05-02',
    calificacion: 3.8,
    instrucciones: 'Grafica posición vs tiempo. Identifica tipo de movimiento.',
  },
  // Física I - Presencial
  {
    id: '6',
    grupoId: '1',
    titulo: 'Mediciones e Incertidumbres (Presencial)',
    descripcion: 'Técnicas de medición y análisis de errores experimentales.',
    htmlUrl: '/laboratorios/lab_fisica1_presencial/Practica_Mediciones_Incertidumbres_P.html',
    informeUrl: '/laboratorios/lab_fisica1_presencial/Practica_Mediciones_Incertidumbres_P.html',
    tipo: 'presencial',
    estado: 'calificado',
    fechaEntrega: '2024-04-25',
    fechaCalificacion: '2024-04-28',
    calificacion: 4.0,
    instrucciones: 'Realiza 10 mediciones. Calcula promedio, desviación estándar e incertidumbre.',
  },
  {
    id: '7',
    grupoId: '1',
    titulo: 'Colisiones (Presencial)',
    descripcion: 'Estudio de colisiones elásticas e inelásticas.',
    htmlUrl: '/laboratorios/lab_fisica1_presencial/Practica_Colisiones_P.html',
    informeUrl: '/laboratorios/lab_fisica1_presencial/Practica_Colisiones_P.html',
    tipo: 'presencial',
    estado: 'pendiente',
    fechaEntrega: '2024-05-20',
    fechaCalificacion: null,
    calificacion: null,
    instrucciones: 'Usa carriles de aire. Compara momentum antes y después.',
  },
  // Química
  {
    id: '8',
    grupoId: '2',
    titulo: 'Reacciones Ácido-Base',
    descripcion: 'Neutralización y cálculo de equivalentes.',
    htmlUrl: null,
    informeUrl: null,
    tipo: 'presencial',
    estado: 'pendiente',
    fechaEntrega: '2024-05-18',
    fechaCalificacion: null,
    calificacion: null,
    instrucciones: 'Titulación de ácido con base conocida.',
  },
];

const FOROS = {
  '1': [ // Caída Libre
    {
      id: 'f1',
      autor: 'Dr. Juan Pérez',
      rol: 'profesor',
      contenido: 'En esta práctica deben cuidar que el objeto caiga desde la misma altura. ¿Alguien tiene dudas?',
      timestamp: '2024-05-10 14:30',
      visitas: 23,
      respuestas: 2,
    },
    {
      id: 'f2',
      autor: 'Carlos González',
      rol: 'estudiante',
      contenido: 'Profesor, ¿los resultados deben incluir incertidumbre? ¿O solo el promedio?',
      timestamp: '2024-05-10 16:45',
      visitas: 15,
      respuestas: 1,
    },
    {
      id: 'f3',
      autor: 'Dr. Juan Pérez',
      rol: 'profesor',
      contenido: '@Carlos: Deben incluir incertidumbre con intervalo de confianza del 95%.',
      timestamp: '2024-05-10 17:20',
      visitas: 12,
      respuestas: 0,
    },
  ],
  '2': [ // Ley de Hooke
    {
      id: 'f4',
      autor: 'Sofía Martínez',
      rol: 'estudiante',
      contenido: '¿Cómo determino la constante de resorte K con el simulador?',
      timestamp: '2024-05-08 10:15',
      visitas: 8,
      respuestas: 3,
    },
    {
      id: 'f5',
      autor: 'Dr. Juan Pérez',
      rol: 'profesor',
      contenido: '@Sofía: Usa F=kx y mide fuerza vs desplazamiento. La pendiente es K.',
      timestamp: '2024-05-08 11:30',
      visitas: 12,
      respuestas: 0,
    },
  ],
};

export async function getPracticasByGrupo(grupoId) {
  await new Promise(resolve => setTimeout(resolve, 300));

  return PRACTICAS.filter(p => p.grupoId === grupoId);
}

export async function getPracticaDetalle(practicaId) {
  await new Promise(resolve => setTimeout(resolve, 200));

  const practica = PRACTICAS.find(p => p.id === practicaId);
  return practica || null;
}

export async function getForoPractica(practicaId) {
  await new Promise(resolve => setTimeout(resolve, 250));

  return FOROS[practicaId] || [];
}

export async function subirInforme(practicaId, file) {
  await new Promise(resolve => setTimeout(resolve, 500));

  return { success: true, mensaje: 'Informe subido correctamente' };
}

export async function publicarPostForo(practicaId, contenido) {
  await new Promise(resolve => setTimeout(resolve, 400));

  const nuevoPost = {
    id: `f${Date.now()}`,
    autor: 'Tu Nombre',
    rol: 'estudiante',
    contenido: contenido,
    timestamp: new Date().toLocaleString('es-ES'),
    visitas: 0,
    respuestas: 0,
  };

  if (!FOROS[practicaId]) FOROS[practicaId] = [];
  FOROS[practicaId].push(nuevoPost);

  return { success: true, mensaje: 'Post publicado' };
}

export async function getGrupos() {
  await new Promise(resolve => setTimeout(resolve, 200));
  return GRUPOS;
}

export async function getGrupoDetalle(grupoId) {
  await new Promise(resolve => setTimeout(resolve, 150));
  return GRUPOS.find(g => g.id === grupoId) || null;
}
