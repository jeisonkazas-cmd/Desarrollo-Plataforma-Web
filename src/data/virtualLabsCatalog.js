const basePath = '/laboratorios';

function option(lab, file, label) {
  return {
    id: `${lab}/${file}`,
    lab,
    label,
    url: `${basePath}/${lab}/${file}`,
  };
}

export const virtualLabSimulations = [
  option('lab_fisica1_virtual', 'Simulador_CaidaLibre.html', 'Fisica 1 - Caida libre'),
  option('lab_fisica1_virtual', 'Simulador_Medidas.html', 'Fisica 1 - Medidas'),
  option('lab_fisica1_virtual', 'Simulador_MUR-MUA.html', 'Fisica 1 - MUR y MUA'),
  option('lab_fisica1_virtual', 'Simulador_parabolico_3D.html', 'Fisica 1 - Movimiento parabolico'),
  option('lab_fisica1_virtual', 'Simulador_Leyes_de_Newton_Plano.html', 'Fisica 1 - Leyes de Newton'),
  option('lab_fisica1_virtual', 'Simulador_LeyDeHooke.html', 'Fisica 1 - Ley de Hooke'),
  option('lab_fisica2_virtual', 'Simulador_Cargas_electricas.html', 'Fisica 2 - Cargas electricas'),
  option('lab_fisica2_virtual', 'Simulador_Ley_Coulomb.html', 'Fisica 2 - Ley de Coulomb'),
  option('lab_fisica2_virtual', 'Simulador_Lineas_Campo_Electrico-Equipotenciales.html', 'Fisica 2 - Campo electrico y equipotenciales'),
  option('lab_fisica2_virtual', 'Simulador_Dependencia_campo_Magnetico.html', 'Fisica 2 - Dependencia del campo magnetico'),
  option('lab_fisica2_virtual', 'Simulador_Constante_Dielectrica.html', 'Fisica 2 - Constante dielectrica'),
  option('lab_fisica2_virtual', 'Simulador_Resistividad.html', 'Fisica 2 - Resistividad'),
  option('lab_fisica3_virtual', 'Simulador_Cubeta_Ondas.html', 'Fisica 3 - Cubeta de ondas'),
  option('lab_fisica3_virtual', 'Simulador_Efecto_Doppler.html', 'Fisica 3 - Efecto Doppler'),
  option('lab_fisica3_virtual', 'Simulador_Interferencia_Reflexion_y_Refraccion.html', 'Fisica 3 - Interferencia, reflexion y refraccion'),
  option('lab_fisica3_virtual', 'Simulador_Masa-Resorte.html', 'Fisica 3 - Masa-resorte'),
  option('lab_fisica3_virtual', 'Simulador_Ondas_Estacionarias.html', 'Fisica 3 - Ondas estacionarias'),
  option('lab_fisica3_virtual', 'Simulador_Pendulo.html', 'Fisica 3 - Pendulo'),
];

export const virtualLabReports = [
  option('lab_fisica1_virtual', 'Practica_CaidaLibre.html', 'Fisica 1 - Informe caida libre'),
  option('lab_fisica1_virtual', 'Practica_Simulador_Medidas.html', 'Fisica 1 - Informe medidas'),
  option('lab_fisica1_virtual', 'Practica_MUR-MUA.html', 'Fisica 1 - Informe MUR y MUA'),
  option('lab_fisica1_virtual', 'Practica_MovimientoParabolico.html', 'Fisica 1 - Informe movimiento parabolico'),
  option('lab_fisica1_virtual', 'Practica_Leyes_de_Newto_Plano.html', 'Fisica 1 - Informe leyes de Newton'),
  option('lab_fisica1_virtual', 'Practica_LeyDeHooke.html', 'Fisica 1 - Informe ley de Hooke'),
  option('lab_fisica2_virtual', 'Practica_Cargas_Electricas.html', 'Fisica 2 - Informe cargas electricas'),
  option('lab_fisica2_virtual', 'Practica_LeyCoulomb.html', 'Fisica 2 - Informe ley de Coulomb'),
  option('lab_fisica2_virtual', 'Practica_Lineas_Campo_Electrico-Equipotenciales.html', 'Fisica 2 - Informe campo electrico y equipotenciales'),
  option('lab_fisica2_virtual', 'Practica_Dependencia_Campo_Magnetico.html', 'Fisica 2 - Informe dependencia del campo magnetico'),
  option('lab_fisica2_virtual', 'Practica_Constante_dielectrica.html', 'Fisica 2 - Informe constante dielectrica'),
  option('lab_fisica2_virtual', 'Practica_Resistividad.html', 'Fisica 2 - Informe resistividad'),
  option('lab_fisica3_virtual', 'Practica_Cubeta_Ondas.html', 'Fisica 3 - Informe cubeta de ondas'),
  option('lab_fisica3_virtual', 'Practica_Efecto_Doppler.html', 'Fisica 3 - Informe efecto Doppler'),
  option('lab_fisica3_virtual', 'Practica_Interferencia_Reflexion_Refraccion.html', 'Fisica 3 - Informe interferencia, reflexion y refraccion'),
  option('lab_fisica3_virtual', 'Practica_Masa-Resorte.html', 'Fisica 3 - Informe masa-resorte'),
  option('lab_fisica3_virtual', 'Practica_Ondas_Estacionarias.html', 'Fisica 3 - Informe ondas estacionarias'),
  option('lab_fisica3_virtual', 'Practica_Pendulo.html', 'Fisica 3 - Informe pendulo'),
];

