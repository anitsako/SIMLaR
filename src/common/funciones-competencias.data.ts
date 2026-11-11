import textosJson from './funciones-competencias.json';

/**
 * Estructura de "Funciones y competencias".
 * El árbol (qué unidad depende de cuál y qué funciones tiene) viene de
 * institucionalService.ts del otro proyecto. Los textos salen del JSON,
 * que es el bloque `institucional.funciones` de su archivo de traducciones.
 */

type TextosUnidad = {
  title: string;
  dependsOn?: string;
  items: Record<string, string>;
};

type TextosFunciones = {
  title: string;
  unidades: Record<string, TextosUnidad>;
};

const textos = textosJson as TextosFunciones;

export type UnidadFuncion = {
  id: string;
  numero: string;
  titulo: string;
  dependeDe?: string;
  funciones: Array<string>;
  hijos?: Array<UnidadFuncion>;
};

function unidad(
  id: string,
  numero: string,
  clave: string,
  itemIds: Array<string>,
  hijos?: Array<UnidadFuncion>,
): UnidadFuncion {
  const texto = textos.unidades[clave];

  return {
    id,
    numero,
    titulo: texto?.title ?? `[falta título: ${clave}]`,
    dependeDe: texto?.dependsOn,
    funciones: itemIds.map(
      (itemId) => texto?.items?.[itemId] ?? `[falta texto: ${clave}.${itemId}]`,
    ),
    hijos,
  };
}

export const FUNCIONES_TITULO = textos.title;

export const UNIDADES_FUNCIONES: Array<UnidadFuncion> = [
  unidad('funcion-secretaria', '1.', 'secretaria', [
    'asistirPoderEjecutivo',
    'definirObjetivos',
    'ejecutarPlanes',
    'proponerPolitica',
    'representarEstado',
    'participarCredito',
    'coordinarAsistencia',
    'fortalecerVinculacion',
  ]),
  unidad(
    'funcion-dg-mineria',
    '2.',
    'dgMineria',
    [
      'planificarDesarrollo',
      'promoverAprovechamiento',
      'coordinarPoliticaNacional',
      'proponerEjecutarControlar',
      'articularPoliticas',
      'promoverRiesgos',
      'coordinarCooperacion',
    ],
    [
      unidad(
        'funcion-d-escribania-minas',
        '2.1.',
        'escribaniaMinas',
        [
          'llevarRegistros',
          'llevarPadronCanon',
          'realizarNotificaciones',
          'asistirDireccionGeneral',
          'informarRegistros',
          'cumplirCodigo',
          'dejarConstancia',
          'extenderCertificados',
          'informarRequisitos',
          'certificarPlazos',
          'otrasTareas',
        ],
        [
          unidad('funcion-promotor-mesa-entradas', '2.1.1.', 'mesaEntradas', [
            'registrarPresentacion',
            'llevarUbicacion',
          ]),
        ],
      ),
      unidad(
        'funcion-d-catastro-minero',
        '2.2.',
        'catastroMinero',
        [
          'asignarMatriculas',
          'ordenarCatastro',
          'registrarDerechos',
          'informarDerechos',
          'participarMensuras',
          'aprobarMensuras',
        ],
        [
          unidad('funcion-promotor-topografia', '2.2.1.', 'topografia', [
            'controlarTareas',
            'mantenerRed',
            'asegurarUbicacion',
          ]),
          unidad('funcion-promotor-grafico-catastral', '2.2.2.', 'graficoCatastral', [
            'controlarRegistro',
            'aplicarCodigo',
            'contribuirSeguridad',
          ]),
        ],
      ),
      unidad(
        'funcion-d-geologia-minera',
        '2.3.',
        'geologiaMinera',
        [
          'asesorar',
          'evaluarCanteras',
          'evaluarMuestras',
          'organizarMuestras',
          'analizarProgramas',
          'evaluarLabores',
          'realizarAnalisis',
          'analizarDeclaraciones',
          'estudiosGeologicos',
          'estudiarAcceso',
          'registroConsultores',
        ],
        [
          unidad('funcion-promotor-trabajos-geologicos', '2.3.1.', 'trabajosGeologicos', [
            'seleccionarPuntos',
            'promoverUso',
          ]),
        ],
      ),
      unidad(
        'funcion-d-economia-minera',
        '2.4.',
        'economiaMinera',
        ['estudiarInversiones', 'analizarProyectos', 'determinarRegalias', 'venderGuias'],
        [
          unidad('funcion-promotor-registro-productores', '2.4.1.', 'registroProductores', [
            'relevarProductores',
            'mantenerRegistro',
            'coordinarSuim',
            'articularInformacion',
          ]),
        ],
      ),
      unidad(
        'funcion-d-policia-minera',
        '2.5.',
        'policiaMinera',
        [
          'controlarTrabajos',
          'protegerSeguridad',
          'inspeccionar',
          'constatarInfracciones',
          'controlarTransito',
          'verificarGuias',
        ],
        [
          unidad('funcion-promotor-fiscalizacion', '2.5.1.', 'fiscalizacion', [
            'evaluarSistemas',
            'fiscalizarRacionalidad',
            'comprobarNormas',
            'verificarBuenasPracticas',
          ]),
        ],
      ),
    ],
  ),
  unidad(
    'funcion-dg-recursos-no-renovables',
    '3.',
    'dgRecursos',
    ['ejecutarPolitica', 'velarNormas', 'relevarRecursos', 'mantenerBud', 'intervenirExplotacion'],
    [
      unidad('funcion-d-gestion-proyectos', '3.1.', 'gestionProyectos', [
        'asistirSecretaria',
        'intervenirInversores',
        'participarDesarrollo',
      ]),
    ],
  ),
  unidad(
    'funcion-dg-desarrollo-productivo',
    '4.',
    'dgDesarrollo',
    [
      'promoverActividad',
      'evaluarProyectos',
      'fomentarServicios',
      'impulsarLaboratorios',
      'crearMuseo',
      'mantenerRelaciones',
      'brindarAsistencia',
      'intervenirRegimenes',
      'coordinarProyectos',
    ],
    [
      unidad('funcion-coord-valle-bermejo', '4.1.', 'valleBermejo', [
        'contribuirPlanificacion',
        'considerarRecursos',
      ]),
      unidad('funcion-d-servicio-minero', '4.2.', 'servicioMinero', [
        'colaborarPoliticas',
        'promoverInversiones',
        'interactuarInversores',
        'proporcionarInformacion',
      ]),
    ],
  ),
  unidad(
    'funcion-dg-administracion',
    '5.',
    'dgAdministracion',
    [
      'administrarRecursos',
      'dirigirContabilidad',
      'dirigirProcesos',
      'supervisarCompras',
      'administrarPatrimonio',
      'coordinarPersonal',
      'definirIndicadores',
      'registrarRecursos',
      'ejecutarAcciones',
      'supervisarRendiciones',
    ],
    [
      unidad('funcion-coord-rendicion-cuentas', '5.1.', 'rendicionCuentas', [
        'asistirPresupuesto',
        'prepararAnteproyecto',
        'registrarEjecucion',
        'tramitarModificaciones',
        'registrarCuotas',
        'mantenerBienes',
        'intervenirMovimientos',
        'organizarArchivo',
      ]),
      unidad('funcion-coord-tesoreria', '5.2.', 'tesoreria', [
        'asistirFondos',
        'registrarMovimientos',
        'elaborarParte',
        'administrarValores',
        'efectuarPagos',
        'tramitesBancarios',
      ]),
      unidad('funcion-coord-personal', '5.3.', 'personal', [
        'planificarRecursos',
        'determinarNecesidades',
        'elevarPropuestas',
        'mantenerHistorial',
        'promoverCapacitacion',
        'evaluarRiesgos',
        'procurarBienestar',
        'asistirRecursosHumanos',
      ]),
    ],
  ),
  unidad('funcion-dg-asuntos-legales', '6.', 'asuntosLegales', [
    'contribuirNormas',
    'asesorarDependencias',
    'intervenirDocumentacion',
    'supervisarProyectos',
    'asesorarNormativa',
    'dictaminarRecursos',
    'intervenirConvenios',
    'intervenirContratos',
  ]),
  unidad('funcion-dg-despacho', '7.', 'despacho', [
    'elaborarProyectos',
    'disponerNotificacion',
    'intervenirAsesoramiento',
    'participarRecursos',
    'registrarDocumentacion',
    'ordenarTramitacion',
    'protocolizarActos',
    'analizarNormativa',
    'detectarVacios',
  ]),
];
