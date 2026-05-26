const USUARIOS_MOCK = [
  {
    id: '1',
    nombre: 'Carlos Méndez',
    email: 'carlos.mendez@correo.edu',
    rol: 'estudiante',
    estado: 'activo',
    grupo: 'Física I - 3303A',
    fechaRegistro: '2024-01-15',
    ultimoAcceso: '2026-04-27',
  },
  {
    id: '2',
    nombre: 'María González',
    email: 'maria.gonzalez@correo.edu',
    rol: 'estudiante',
    estado: 'activo',
    grupo: 'Física I - 3303A',
    fechaRegistro: '2024-01-16',
    ultimoAcceso: '2026-04-25',
  },
  {
    id: '3',
    nombre: 'Juan Pérez',
    email: 'juan.perez@correo.edu',
    rol: 'docente',
    estado: 'activo',
    grupo: null,
    fechaRegistro: '2023-08-01',
    ultimoAcceso: '2026-04-28',
  },
  {
    id: '4',
    nombre: 'Ana García',
    email: 'ana.garcia@correo.edu',
    rol: 'docente',
    estado: 'activo',
    grupo: null,
    fechaRegistro: '2023-08-02',
    ultimoAcceso: '2026-04-26',
  },
  {
    id: '5',
    nombre: 'Luis Ramírez',
    email: 'luis.ramirez@correo.edu',
    rol: 'estudiante',
    estado: 'suspendido',
    grupo: 'Física II - 2204B',
    fechaRegistro: '2024-01-20',
    ultimoAcceso: '2026-03-10',
  },
];

const CONTENIDO_MOCK = [
  {
    id: '1',
    titulo: 'Laboratorio Caída Libre',
    tipo: 'simulacion',
    url: '/laboratorios/lab_fisica1_virtual/Practica_CaidaLibre.html',
    fechaCreacion: '2023-09-01',
    estado: 'activo',
    descargas: 245,
  },
  {
    id: '2',
    titulo: 'Laboratorio Ley de Ohm',
    tipo: 'simulacion',
    url: '/laboratorios/lab_fisica2_virtual/ley_ohm.html',
    fechaCreacion: '2023-09-05',
    estado: 'activo',
    descargas: 189,
  },
  {
    id: '3',
    titulo: 'Guía de Prácticas Física I',
    tipo: 'recurso',
    url: '/recursos/guia_fisica_i.pdf',
    fechaCreacion: '2023-08-15',
    estado: 'activo',
    descargas: 512,
  },
  {
    id: '4',
    titulo: 'Manual de Seguridad de Laboratorio',
    tipo: 'recurso',
    url: '/recursos/seguridad_lab.pdf',
    fechaCreacion: '2023-08-01',
    estado: 'activo',
    descargas: 678,
  },
];

const REPORTES_MOCK = {
  resumen: {
    totalUsuarios: 12842,
    estudiantesActivos: 9511,
    docentesActivos: 2730,
    administradores: 601,
  },
  accesoPorRol: [
    { rol: 'Estudiante', accesos: 85432, porcentaje: 65 },
    { rol: 'Docente', accesos: 38210, porcentaje: 29 },
    { rol: 'Administrador', accesos: 8290, porcentaje: 6 },
  ],
  actividadPorSemana: [
    { semana: 'Sem 1', accesos: 4200, usuarios: 1245 },
    { semana: 'Sem 2', accesos: 5100, usuarios: 1520 },
    { semana: 'Sem 3', accesos: 3800, usuarios: 980 },
    { semana: 'Sem 4', accesos: 6200, usuarios: 1890 },
    { semana: 'Sem 5', accesos: 5600, usuarios: 1650 },
    { semana: 'Sem 6', accesos: 7100, usuarios: 2100 },
    { semana: 'Sem 7', accesos: 4900, usuarios: 1420 },
  ],
  practicasPopulares: [
    { titulo: 'Caída Libre', realizadas: 456, completadas: 412, porcentaje: 90 },
    { titulo: 'Ley de Hooke', realizadas: 398, completadas: 378, porcentaje: 95 },
    { titulo: 'Leyes de Newton', realizadas: 445, completadas: 401, porcentaje: 90 },
    { titulo: 'Movimiento Parabólico', realizadas: 267, completadas: 198, porcentaje: 74 },
  ],
};

export function getMockUsuarios() {
  return USUARIOS_MOCK;
}

export function getMockContenido() {
  return CONTENIDO_MOCK;
}

export function getMockReportes() {
  return REPORTES_MOCK;
}

export function crearUsuario(usuario) {
  const nuevoUsuario = {
    id: String(Math.random()),
    ...usuario,
    fechaRegistro: new Date().toISOString().split('T')[0],
    ultimoAcceso: null,
  };
  USUARIOS_MOCK.push(nuevoUsuario);
  return nuevoUsuario;
}

export function actualizarUsuario(id, datos) {
  const usuario = USUARIOS_MOCK.find((u) => u.id === id);
  if (usuario) {
    Object.assign(usuario, datos);
  }
  return usuario;
}

export function eliminarUsuario(id) {
  const index = USUARIOS_MOCK.findIndex((u) => u.id === id);
  if (index !== -1) {
    return USUARIOS_MOCK.splice(index, 1)[0];
  }
  return null;
}

export function subirContenido(contenido) {
  const nuevoContenido = {
    id: String(Math.random()),
    ...contenido,
    fechaCreacion: new Date().toISOString().split('T')[0],
    estado: 'activo',
    descargas: 0,
  };
  CONTENIDO_MOCK.push(nuevoContenido);
  return nuevoContenido;
}

export function eliminarContenido(id) {
  const index = CONTENIDO_MOCK.findIndex((c) => c.id === id);
  if (index !== -1) {
    return CONTENIDO_MOCK.splice(index, 1)[0];
  }
  return null;
}
