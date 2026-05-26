export function getMockTeacher() {
  return { id: 't-001', nombre: 'Julián' };
}

export function getMockCursos() {
  return [
    { id_curso: 101, codigo: 'FISICA 1 3303A' },
    { id_curso: 102, codigo: 'FISICA 1 3303B' },
  ];
}

export function getMockPracticasByCurso(idCurso) {
  const curso = String(idCurso);
  const practicas = [
    { id_practica: 1, id_curso: '101', titulo: 'Práctica 1: Introducción' },
    { id_practica: 2, id_curso: '101', titulo: 'Práctica 2: Mediciones' },
    { id_practica: 3, id_curso: '102', titulo: 'Práctica 1: Vectores' },
  ];
  return practicas.filter((p) => String(p.id_curso) === curso);
}

export function getMockPosts() {
  return [
    {
      id: 1,
      practica: 'Práctica 1: "XXXXXXX"',
      autor: 'Sleydier Díaz',
      tiempo: 'Hace 2 h',
      respuestas: 3,
      texto:
        '¿Alguien sabe cómo calcular la constante de tiempo? Tengo varias dudas y no he podido resolverlo.',
    },
    {
      id: 2,
      practica: 'Práctica 2: "XXXXXXX"',
      autor: 'Jeyson Arenas',
      tiempo: 'Hace un momento',
      respuestas: 0,
      texto: 'Subo mi gráfica, ¿pueden revisarla? No estoy completamente seguro de cómo debe quedar.',
    },
  ];
}

export function getMockInformesByPractica(idPractica) {
  const pid = String(idPractica);
  const informes = [
    { id_informe: 201, id_usuario: 501, id_practica: '1', nombre: 'Ana Gómez' },
    { id_informe: 202, id_usuario: 502, id_practica: '1', nombre: 'Juan Pérez' },
    { id_informe: 203, id_usuario: 503, id_practica: '2', nombre: 'María López' },
  ];
  return informes.filter((i) => String(i.id_practica) === pid);
}

export function getMockGrupos() {
  return [
    {
      id: '101',
      nombre: 'FISICA 1',
      codigo: '3303A',
      estudiantes: 45,
      practicasCreadas: 12,
      semestre: '2024-1',
      icono: 'functions',
      estado: 'activo',
    },
    {
      id: '102',
      nombre: 'CALCULO II',
      codigo: '4402B',
      estudiantes: 38,
      practicasCreadas: 8,
      semestre: '2024-1',
      icono: 'calculate',
      estado: 'activo',
    },
    {
      id: '103',
      nombre: 'QUIMICA GEN',
      codigo: '1201C',
      estudiantes: 42,
      practicasCreadas: 15,
      semestre: '2024-1',
      icono: 'science',
      estado: 'activo',
    },
    {
      id: '104',
      nombre: 'ALGEBRA',
      codigo: '2205D',
      estudiantes: 50,
      practicasCreadas: 5,
      semestre: '2024-1',
      icono: 'analytics',
      estado: 'activo',
    },
    {
      id: '105',
      nombre: 'BIOLOGIA I',
      codigo: '5508E',
      estudiantes: 35,
      practicasCreadas: 10,
      semestre: '2024-1',
      icono: 'biotech',
      estado: 'activo',
    },
    {
      id: '106',
      nombre: 'ESTADISTICA',
      codigo: '6609F',
      estudiantes: 40,
      practicasCreadas: 7,
      semestre: '2024-1',
      icono: 'bar_chart',
      estado: 'activo',
    },
  ];
}

export function getMockPracticasByGrupo(grupoId) {
  const practicas = [
    {
      id: '1',
      grupoId: '101',
      titulo: 'Ley de Ohm en circuitos de CC',
      estado: 'activa',
      fechaCreacion: '10 Oct, 2023',
      fechaLimite: '25 Oct, 2023',
      estudiantesAsignados: ['JP', 'MR'],
      informesRecibidos: 12,
    },
    {
      id: '2',
      grupoId: '101',
      titulo: 'Péndulo Simple y Gravedad',
      estado: 'activa',
      fechaCreacion: '15 Oct, 2023',
      fechaLimite: '30 Oct, 2023',
      estudiantesAsignados: [],
      informesRecibidos: 8,
    },
    {
      id: '3',
      grupoId: '101',
      titulo: 'Cinemática: MRU y MRUA',
      estado: 'cerrada',
      fechaCreacion: '01 Sep, 2023',
      fechaFin: '25 Sep, 2023',
      estudiantesAsignados: [],
      informesRecibidos: 25,
    },
    {
      id: '4',
      grupoId: '101',
      titulo: 'Estática de la Partícula',
      estado: 'cerrada',
      fechaCreacion: '15 Ago, 2023',
      fechaFin: '01 Sep, 2023',
      estudiantesAsignados: [],
      informesRecibidos: 22,
    },
  ];
  return practicas.filter((p) => p.grupoId === grupoId);
}

export function getMockInformes(practicaId) {
  const informes = [
    {
      id: '101',
      practicaId: '1',
      estudianteNombre: 'Juan Pérez',
      estudianteAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvxgOAcizV49oBoaVtKm98HH16bqT__M2uxEnioHN_c7jiTmTYhG1P9IMQQZV3LDYbZDXJ3ni8EVCIlUw4dvW_sNUPOj2v88k6tWXHHQm1r00I5PnkSvl9eC86CFPp8L_vFSwcLOPo_hSush5xkRFHo-66yi8sZ-fau-gU1t0M_QOw1mgEbqfiXfR_-HOdSqrJga5NRzmQP6Ng6RPr7dmAf84Ra7yVqh4IXZHETPkwyogpr4Gqm3yN2ytFbmV1YhWycC1SBEK5bBR5',
      fechaEntrega: '24 Oct, 2024',
      estado: 'entregado',
      nota: null,
    },
    {
      id: '102',
      practicaId: '1',
      estudianteNombre: 'María García',
      estudianteAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZj1RWlbT4oIr_1DOm9TQ3ZAbqsKSWBu-SQg38e-aPF5C5lRjVwgTXZ0OjvZZrC81jQCxVsiXMW3m4VCY88Ybf50XWIHVXQjV7sZJMDoV3fZOyM-nOgTMZkqSqXgrgldQju7ymWQ4hLhAe4Lw1C76nTO-CrF8z90KUW3Qkin-M8HYMCVih-VVjLmgyWIqPmuLANbG6W6J1AU7jVROxultlsNyjTgO0Nwlxsxi7L7svqcYE4-tZ8BTBSP9LMKgY9ibz4fHBrBQ7B1Ev',
      fechaEntrega: '23 Oct, 2024',
      estado: 'calificado',
      nota: 4.8,
    },
    {
      id: '103',
      practicaId: '1',
      estudianteNombre: 'Carlos Ruiz',
      estudianteAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPFlRbAHER4v8xeT8opnb4kmUAIrNf4L28paIP0srN5f6LelHzpo8ayjY7n21OFVtQMP-z__TbkyGZzgQtfGcHpFypm-IXbtCc5uRk7eGHZiefH8scUOAVJBuXiRtdZTieSt2XdA3w_12w6klI9qUly6O3Q93fnjCKnW8SXhsCo1kG2cRktg1MYbJaSGZLkDJ_867r5FOFr0i1WrBP3pQuGMB0gelOw15szunsStdRrPEG8e4pqWuj-aBEgtLUTYPj2X2JpwVl5BeX',
      fechaEntrega: '22 Oct, 2024',
      estado: 'pendiente',
      nota: null,
    },
    {
      id: '104',
      practicaId: '1',
      estudianteNombre: 'Ana López',
      estudianteAvatar: null,
      fechaEntrega: '25 Oct, 2024',
      estado: 'calificado',
      nota: 4.5,
    },
    {
      id: '105',
      practicaId: '1',
      estudianteNombre: 'Pedro Martínez',
      estudianteAvatar: null,
      fechaEntrega: '21 Oct, 2024',
      estado: 'entregado',
      nota: null,
    },
    {
      id: '106',
      practicaId: '1',
      estudianteNombre: 'Laura Sánchez',
      estudianteAvatar: null,
      fechaEntrega: '26 Oct, 2024',
      estado: 'calificado',
      nota: 4.2,
    },
    {
      id: '107',
      practicaId: '1',
      estudianteNombre: 'Roberto Díaz',
      estudianteAvatar: null,
      fechaEntrega: '20 Oct, 2024',
      estado: 'pendiente',
      nota: null,
    },
    {
      id: '108',
      practicaId: '1',
      estudianteNombre: 'Sofia Castillo',
      estudianteAvatar: null,
      fechaEntrega: '27 Oct, 2024',
      estado: 'calificado',
      nota: 4.9,
    },
    {
      id: '109',
      practicaId: '1',
      estudianteNombre: 'Miguel Esquivel',
      estudianteAvatar: null,
      fechaEntrega: '19 Oct, 2024',
      estado: 'entregado',
      nota: null,
    },
    {
      id: '110',
      practicaId: '1',
      estudianteNombre: 'Isabel Navarro',
      estudianteAvatar: null,
      fechaEntrega: '28 Oct, 2024',
      estado: 'pendiente',
      nota: null,
    },
    {
      id: '111',
      practicaId: '1',
      estudianteNombre: 'Francisco Ramos',
      estudianteAvatar: null,
      fechaEntrega: '18 Oct, 2024',
      estado: 'calificado',
      nota: 4.3,
    },
    {
      id: '112',
      practicaId: '1',
      estudianteNombre: 'Carmen Flores',
      estudianteAvatar: null,
      fechaEntrega: '29 Oct, 2024',
      estado: 'entregado',
      nota: null,
    },
    {
      id: '113',
      practicaId: '1',
      estudianteNombre: 'Javier Herrera',
      estudianteAvatar: null,
      fechaEntrega: '17 Oct, 2024',
      estado: 'pendiente',
      nota: null,
    },
    {
      id: '114',
      practicaId: '1',
      estudianteNombre: 'Mercedes Valencia',
      estudianteAvatar: null,
      fechaEntrega: '30 Oct, 2024',
      estado: 'calificado',
      nota: 4.7,
    },
    {
      id: '115',
      practicaId: '1',
      estudianteNombre: 'Andrés Vega',
      estudianteAvatar: null,
      fechaEntrega: '16 Oct, 2024',
      estado: 'entregado',
      nota: null,
    },
    {
      id: '116',
      practicaId: '1',
      estudianteNombre: 'Raquel Moreno',
      estudianteAvatar: null,
      fechaEntrega: '31 Oct, 2024',
      estado: 'pendiente',
      nota: null,
    },
    {
      id: '117',
      practicaId: '1',
      estudianteNombre: 'Víctor Fernández',
      estudianteAvatar: null,
      fechaEntrega: '15 Oct, 2024',
      estado: 'calificado',
      nota: 4.6,
    },
    {
      id: '118',
      practicaId: '1',
      estudianteNombre: 'Beatriz Salazar',
      estudianteAvatar: null,
      fechaEntrega: '01 Nov, 2024',
      estado: 'entregado',
      nota: null,
    },
  ];

  return informes.filter((i) => i.practicaId === practicaId);
}

export function getMockInformeDetalle(informeId) {
  const detalles = {
    '101': {
      id: '101',
      estudianteNombre: 'Juan Pérez',
      fechaEntrega: '24 Oct, 2024',
      archivoNombre: 'Informe_Ley_Ohm_Juan_Perez.pdf',
      archivoUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table.pdf',
      estado: 'entregado',
      nota: null,
      feedback: null,
      facultad: 'Facultad de Ingeniería',
    },
    '102': {
      id: '102',
      estudianteNombre: 'María García',
      fechaEntrega: '23 Oct, 2024',
      archivoNombre: 'Informe_Ley_Ohm_Maria_Garcia.pdf',
      archivoUrl: null,
      estado: 'calificado',
      nota: 4.8,
      feedback: 'Excelente trabajo. La presentación es clara y los cálculos están correctos. Has demostrado una comprensión profunda de los conceptos.',
      facultad: 'Facultad de Ingeniería',
    },
    '103': {
      id: '103',
      estudianteNombre: 'Carlos Ruiz',
      fechaEntrega: '22 Oct, 2024',
      archivoNombre: 'Informe_Ley_Ohm_Carlos_Ruiz.pdf',
      archivoUrl: null,
      estado: 'pendiente',
      nota: null,
      feedback: null,
      facultad: 'Facultad de Ingeniería',
    },
  };

  return detalles[informeId] || {
    id: informeId,
    estudianteNombre: 'Estudiante',
    fechaEntrega: 'Fecha desconocida',
    archivoNombre: 'documento.pdf',
    archivoUrl: null,
    estado: 'entregado',
    nota: null,
    feedback: null,
    facultad: 'Facultad de Ingeniería',
  };
}

export function getMockHilosForo(practicaId) {
  const hilos = [
    {
      id: '1',
      practicaId: '1',
      autorNombre: 'Elena Martínez',
      autorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiQkHBbpTbwivbtLDW8M22jUwRbGMRZwNzukq1ajkctxxGjlRhp0vPgVmcowpKjfaqE0ANZSjHfa3_Q77FpuggvyWehwi0Q5f7DnocLCCmuEXwF5iOXIGtNVJNMg4tFQA1stBCuDuYP3t3DSYqlXaBPDyVWeuun5qnS1HhVgmkxIDcN2PEQrGZppgS6Uh2fvc2oTiFKusXtluuLiT9cQzdr8nItAxACBh9WxNF7Bbpl5UcXb56l23Erjg5A9ORtx8zMu_AisKMPxsF',
      autorRol: 'estudiante',
      titulo: 'Duda sobre la resistencia en serie y mediciones reales',
      preview: 'Hola a todos, tengo una duda sobre cómo afecta la tolerancia del componente en las mediciones finales de la práctica. Mis resultados varían un 5% respecto a la ley teórica...',
      respuestas: 12,
      vistas: 48,
      tiempoPublicacion: 'hace 2 horas',
    },
    {
      id: '2',
      practicaId: '1',
      autorNombre: 'Dr. Carlos V.',
      autorAvatar: null,
      autorRol: 'docente',
      titulo: 'Material de apoyo: Simulación Multisim',
      preview: 'He subido un video tutorial sobre cómo configurar el multímetro en la simulación para evitar errores comunes de cortocircuito durante la medición de corriente...',
      respuestas: 4,
      vistas: 102,
      tiempoPublicacion: 'hace 5 horas',
    },
    {
      id: '3',
      practicaId: '1',
      autorNombre: 'Ricardo Gómez',
      autorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDrdodftVuhHnV3XizIRy4PkunnWUjdmQeHUJTo5zV1jJwsIkCk1EwovupSUCmPJhPAue4SlnE2oxqaR5lSYiMEOPbeDuBArf1LaMrTJFDVTZWQUkf4QhFdRip84u12OOuO4B6spc9TjY28n_e54LwwPo0-imQVqUhRub73nYJryonWA76_UVB-40M88uqQ2XB6XTkXeRKqiSgseig9zJOFCE02AGfy3MRaMLtC2TugSGwreejR91qvT3QKXm2GUVUCozpLp42yhEv',
      autorRol: 'estudiante',
      titulo: '¿Cómo graficar los datos en Excel?',
      preview: '¿Alguien sabe si para la gráfica de Voltaje vs Corriente debemos forzar que la línea pase por el origen (0,0) o dejar que Excel haga la regresión lineal libre?',
      respuestas: 8,
      vistas: 32,
      tiempoPublicacion: 'ayer',
    },
    {
      id: '4',
      practicaId: '1',
      autorNombre: 'Sofía López',
      autorAvatar: null,
      autorRol: 'estudiante',
      titulo: 'Problema con el osciloscopio en la simulación',
      preview: 'No logro configurar correctamente la escala de tiempo en el osciloscopio. ¿Alguien me puede guiar paso a paso?',
      respuestas: 6,
      vistas: 28,
      tiempoPublicacion: 'hace 1 día',
    },
    {
      id: '5',
      practicaId: '1',
      autorNombre: 'Mg. Ana Rodríguez',
      autorAvatar: null,
      autorRol: 'docente',
      titulo: 'Recordatorio de entrega',
      preview: 'Les recuerdo que la fecha límite para entregar los informes es el próximo viernes. Por favor, revisen la rúbrica antes de enviar su trabajo.',
      respuestas: 3,
      vistas: 156,
      tiempoPublicacion: 'hace 3 días',
    },
  ];

  return hilos.filter((h) => h.practicaId === practicaId);
}
