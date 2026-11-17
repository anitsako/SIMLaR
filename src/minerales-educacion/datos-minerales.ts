type chipColorType = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined;

type usoAplicacion = {
  name: string;
  detalle: string;
};

export type Mineral = {
  name: string;
  descripcion: string;
  formulaQuimica: string;
  sistemaCristalino: string | undefined;
  dureza: number | undefined;
  colorCaracteristico: string;
  usosAplicaciones?: Array<usoAplicacion>;
  origenGeologico: string;
  modelPath?: string;
  color?: string;
  chipColor?: chipColorType;
  primerColorHeader?: string;
  segundoColorHeader?: string;
};

export interface modelProps {
  modelPath: string;
}

export interface MineralProps {
  mineral: Mineral;
}

export const datosMinerales: Array<Mineral> = [
  {
    name: 'routes.educacion.informativa.minerales.oro.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.oro.descripcion',
    formulaQuimica: 'Au',
    sistemaCristalino: 'routes.educacion.informativa.minerales.oro.sistemaCristalino',
    dureza: 4,
    colorCaracteristico: 'routes.educacion.informativa.minerales.oro.colorCaracteristico',
    usosAplicaciones: [
      { name: 'routes.educacion.informativa.minerales.oro.usos.joyeriaOrfebreria.nombre', detalle: 'routes.educacion.informativa.minerales.oro.usos.joyeriaOrfebreria.detalle' },
      { name: 'routes.educacion.informativa.minerales.oro.usos.reservaValor.nombre', detalle: 'routes.educacion.informativa.minerales.oro.usos.reservaValor.detalle' },
      {
        name: 'routes.educacion.informativa.minerales.oro.usos.industriaElectronica.nombre',
        detalle:
          'routes.educacion.informativa.minerales.oro.usos.industriaElectronica.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.oro.usos.medicinaOdontologia.nombre',
        detalle: 'routes.educacion.informativa.minerales.oro.usos.medicinaOdontologia.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.oro.usos.industriaAeroespacial.nombre',
        detalle: 'routes.educacion.informativa.minerales.oro.usos.industriaAeroespacial.detalle',
      },
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/oro-v1.glb',
    color: 'yellow',
    chipColor: 'warning',
    primerColorHeader: 'from-yellow-400',
    segundoColorHeader: 'to-yellow-500',
  },
  {
    name: 'routes.educacion.informativa.minerales.plata.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.plata.descripcion',
    formulaQuimica: 'Ag',
    sistemaCristalino: 'routes.educacion.informativa.minerales.plata.sistemaCristalino',
    dureza: 2.5,
    colorCaracteristico: 'routes.educacion.informativa.minerales.plata.colorCaracteristico',
    usosAplicaciones: [
      {
        name: 'routes.educacion.informativa.minerales.plata.usos.joyeriaOrfebreria.nombre',
        detalle: 'routes.educacion.informativa.minerales.plata.usos.joyeriaOrfebreria.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.plata.usos.industriaElectronica.nombre',
        detalle:
          'routes.educacion.informativa.minerales.plata.usos.industriaElectronica.detalle',
      },
      { name: 'routes.educacion.informativa.minerales.plata.usos.aplicacionesIndustrialesQuimicas.nombre', detalle: 'routes.educacion.informativa.minerales.plata.usos.aplicacionesIndustrialesQuimicas.detalle' },
      {
        name: 'routes.educacion.informativa.minerales.plata.usos.medicinaSalud.nombre',
        detalle:
          'routes.educacion.informativa.minerales.plata.usos.medicinaSalud.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.plata.usos.purificacionAgua.nombre',
        detalle: 'routes.educacion.informativa.minerales.plata.usos.purificacionAgua.detalle',
      },
      { name: 'routes.educacion.informativa.minerales.plata.usos.fotografiaHistoricamente.nombre', detalle: 'routes.educacion.informativa.minerales.plata.usos.fotografiaHistoricamente.detalle' },
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/native_silver-v1.glb',
    color: 'gray',
    chipColor: 'secondary',
    primerColorHeader: 'from-gray-400',
    segundoColorHeader: 'to-gray-500',
  },
  {
    name: 'routes.educacion.informativa.minerales.cobre.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.cobre.descripcion',
    formulaQuimica: 'Cu',
    sistemaCristalino: 'routes.educacion.informativa.minerales.cobre.sistemaCristalino',
    dureza: 3,
    colorCaracteristico: 'routes.educacion.informativa.minerales.cobre.colorCaracteristico',
    usosAplicaciones: [
      {
        name: 'routes.educacion.informativa.minerales.cobre.usos.industriaElectrica.nombre',
        detalle:
          'routes.educacion.informativa.minerales.cobre.usos.industriaElectrica.detalle',
      },
      { name: 'routes.educacion.informativa.minerales.cobre.usos.aleacionesMetalicas.nombre', detalle: 'routes.educacion.informativa.minerales.cobre.usos.aleacionesMetalicas.detalle' },
      {
        name: 'routes.educacion.informativa.minerales.cobre.usos.construccion.nombre',
        detalle: 'routes.educacion.informativa.minerales.cobre.usos.construccion.detalle',
      },
      { name: 'routes.educacion.informativa.minerales.cobre.usos.tecnologiasEnergeticas.nombre', detalle: 'routes.educacion.informativa.minerales.cobre.usos.tecnologiasEnergeticas.detalle' },
      {
        name: 'routes.educacion.informativa.minerales.cobre.usos.transporte.nombre',
        detalle: 'routes.educacion.informativa.minerales.cobre.usos.transporte.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.cobre.usos.innovacionSalud.nombre',
        detalle: 'routes.educacion.informativa.minerales.cobre.usos.innovacionSalud.detalle',
      },
      { name: 'routes.educacion.informativa.minerales.cobre.usos.otrosUsos.nombre', detalle: 'routes.educacion.informativa.minerales.cobre.usos.otrosUsos.detalle' },
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/native_copper-v1.glb',
    color: 'red',
    chipColor: 'danger',
    primerColorHeader: 'from-red-400',
    segundoColorHeader: 'to-red-500',
  },
  {
    name: 'routes.educacion.informativa.minerales.litio.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.litio.descripcion',
    formulaQuimica: 'Li',
    sistemaCristalino: 'routes.educacion.informativa.minerales.litio.sistemaCristalino',
    dureza: 0.6,
    colorCaracteristico: 'routes.educacion.informativa.minerales.litio.colorCaracteristico',
    usosAplicaciones: [
      {
        name: 'routes.educacion.informativa.minerales.litio.usos.bateriasRecargables.nombre',
        detalle: 'routes.educacion.informativa.minerales.litio.usos.bateriasRecargables.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.litio.usos.industriaVidrioCeramica.nombre',
        detalle: 'routes.educacion.informativa.minerales.litio.usos.industriaVidrioCeramica.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.litio.usos.lubricantesGrasasIndustriales.nombre',
        detalle: 'routes.educacion.informativa.minerales.litio.usos.lubricantesGrasasIndustriales.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.litio.usos.industriaFarmaceutica.nombre',
        detalle:
          'routes.educacion.informativa.minerales.litio.usos.industriaFarmaceutica.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.litio.usos.aleacionesAeronauticas.nombre',
        detalle:
          'routes.educacion.informativa.minerales.litio.usos.aleacionesAeronauticas.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.litio.usos.otrosUsos.nombre',
        detalle: 'routes.educacion.informativa.minerales.litio.usos.otrosUsos.detalle',
      },
    ],
    origenGeologico: '',
    modelPath: '',
    color: 'blue',
    chipColor: 'default',
    primerColorHeader: 'from-blue-400',
    segundoColorHeader: 'to-blue-500',
  },
  {
    name: 'routes.educacion.informativa.minerales.cobalto.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.cobalto.descripcion',
    formulaQuimica: 'Co',
    sistemaCristalino: 'routes.educacion.informativa.minerales.cobalto.sistemaCristalino',
    dureza: 5.5,
    colorCaracteristico: 'routes.educacion.informativa.minerales.cobalto.colorCaracteristico',
    usosAplicaciones: [
      {
        name: 'routes.educacion.informativa.minerales.cobalto.usos.bateriasRecargables.nombre',
        detalle:
          'routes.educacion.informativa.minerales.cobalto.usos.bateriasRecargables.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.cobalto.usos.aleacionesMetalicas.nombre',
        detalle:
          'routes.educacion.informativa.minerales.cobalto.usos.aleacionesMetalicas.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.cobalto.usos.industriaQuimica.nombre',
        detalle: 'routes.educacion.informativa.minerales.cobalto.usos.industriaQuimica.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.cobalto.usos.imanesAltoRendimiento.nombre',
        detalle: 'routes.educacion.informativa.minerales.cobalto.usos.imanesAltoRendimiento.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.cobalto.usos.pigmentos.nombre',
        detalle: 'routes.educacion.informativa.minerales.cobalto.usos.pigmentos.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.cobalto.usos.medicina.nombre',
        detalle: 'routes.educacion.informativa.minerales.cobalto.usos.medicina.detalle',
      },
    ],
    origenGeologico: '',
    modelPath: '',
    color: 'blue',
    chipColor: 'secondary',
    primerColorHeader: 'from-blue-400',
    segundoColorHeader: 'to-blue-500',
  },
  {
    name: 'routes.educacion.informativa.minerales.uranio.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.uranio.descripcion',
    formulaQuimica: 'U',
    sistemaCristalino: 'routes.educacion.informativa.minerales.uranio.sistemaCristalino',
    dureza: 6,
    colorCaracteristico: 'routes.educacion.informativa.minerales.uranio.colorCaracteristico',
    usosAplicaciones: [
      {
        name: 'routes.educacion.informativa.minerales.uranio.usos.generacionEnergiaNuclear.nombre',
        detalle:
          'routes.educacion.informativa.minerales.uranio.usos.generacionEnergiaNuclear.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.uranio.usos.uranioEmpobrecidoU238.nombre',
        detalle:
          'routes.educacion.informativa.minerales.uranio.usos.uranioEmpobrecidoU238.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.uranio.usos.aplicacionesMedicasIndustriales.nombre',
        detalle: 'routes.educacion.informativa.minerales.uranio.usos.aplicacionesMedicasIndustriales.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.uranio.usos.ciencia.nombre',
        detalle: 'routes.educacion.informativa.minerales.uranio.usos.ciencia.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.uranio.usos.usosHistoricos.nombre',
        detalle: 'routes.educacion.informativa.minerales.uranio.usos.usosHistoricos.detalle',
      },
    ],
    origenGeologico: '',
    modelPath: '',
    color: 'gray',
    chipColor: 'default',
    primerColorHeader: 'from-gray-400',
    segundoColorHeader: 'to-gray-500',
  },
  {
    name: 'routes.educacion.informativa.minerales.cuarzo.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.cuarzo.descripcion',
    formulaQuimica: 'SiO₂',
    sistemaCristalino: 'routes.educacion.informativa.minerales.cuarzo.sistemaCristalino',
    dureza: 7,
    colorCaracteristico: 'routes.educacion.informativa.minerales.cuarzo.colorCaracteristico',
    usosAplicaciones: [
      {
        name: 'routes.educacion.informativa.minerales.cuarzo.usos.industriaVidriera.nombre',
        detalle:
          'routes.educacion.informativa.minerales.cuarzo.usos.industriaVidriera.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.cuarzo.usos.industriaElectrica.nombre',
        detalle:
          'routes.educacion.informativa.minerales.cuarzo.usos.industriaElectrica.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.cuarzo.usos.abrasivos.nombre',
        detalle:
          'routes.educacion.informativa.minerales.cuarzo.usos.abrasivos.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.cuarzo.usos.fundicionArena.nombre',
        detalle:
          'routes.educacion.informativa.minerales.cuarzo.usos.fundicionArena.detalle',
      },
    ],
    origenGeologico:
      'routes.educacion.informativa.minerales.cuarzo.origenGeologico',
    modelPath: '/modelos-3d/quartz.glb',
    color: 'orange',
    chipColor: 'warning',
    primerColorHeader: 'from-orange-400',
    segundoColorHeader: 'to-orange-500',
  },
  {
    name: 'routes.educacion.informativa.minerales.feldespato.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.feldespato.descripcion',
    formulaQuimica: 'Fds',
    sistemaCristalino: 'routes.educacion.informativa.minerales.feldespato.sistemaCristalino',
    dureza: 6,
    colorCaracteristico: 'routes.educacion.informativa.minerales.feldespato.colorCaracteristico',
    usosAplicaciones: [
      {
        name: 'routes.educacion.informativa.minerales.feldespato.usos.industriaCeramica.nombre',
        detalle: 'routes.educacion.informativa.minerales.feldespato.usos.industriaCeramica.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.feldespato.usos.industriaVidrio.nombre',
        detalle: 'routes.educacion.informativa.minerales.feldespato.usos.industriaVidrio.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.feldespato.usos.pinturasPlasticosCauchos.nombre',
        detalle:
          'routes.educacion.informativa.minerales.feldespato.usos.pinturasPlasticosCauchos.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.feldespato.usos.industriaPapel.nombre',
        detalle: 'routes.educacion.informativa.minerales.feldespato.usos.industriaPapel.detalle',
      },
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/feldespato.glb',
    color: 'green',
    chipColor: 'success',
    primerColorHeader: 'from-green-400',
    segundoColorHeader: 'to-green-500',
  },
  {
    name: 'routes.educacion.informativa.minerales.baritina.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.baritina.descripcion',
    formulaQuimica: 'BaSO₄',
    sistemaCristalino: 'routes.educacion.informativa.minerales.baritina.sistemaCristalino',
    dureza: 3,
    colorCaracteristico: 'routes.educacion.informativa.minerales.baritina.colorCaracteristico',
    usosAplicaciones: [
      {
        name: 'routes.educacion.informativa.minerales.baritina.usos.industriaPetrolera.nombre',
        detalle:
          'routes.educacion.informativa.minerales.baritina.usos.industriaPetrolera.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.baritina.usos.industriaQuimica.nombre',
        detalle:
          'routes.educacion.informativa.minerales.baritina.usos.industriaQuimica.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.baritina.usos.industriaConstruccion.nombre',
        detalle:
          'routes.educacion.informativa.minerales.baritina.usos.industriaConstruccion.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.baritina.usos.pinturasRecubrimientos.nombre',
        detalle:
          'routes.educacion.informativa.minerales.baritina.usos.pinturasRecubrimientos.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.baritina.usos.industriaCauchoPlasticos.nombre',
        detalle:
          'routes.educacion.informativa.minerales.baritina.usos.industriaCauchoPlasticos.detalle',
      },
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/baritina-v1.glb',
    color: 'gray',
    chipColor: 'default',
    primerColorHeader: 'from-gray-400',
    segundoColorHeader: 'to-gray-500',
  },
  {
    name: 'routes.educacion.informativa.minerales.arenaSilicea.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.arenaSilicea.descripcion',
    formulaQuimica: 'SiO₂',
    sistemaCristalino: 'routes.educacion.informativa.minerales.arenaSilicea.sistemaCristalino',
    dureza: 7,
    colorCaracteristico: 'routes.educacion.informativa.minerales.arenaSilicea.colorCaracteristico',
    origenGeologico: '',
    modelPath: '',
    color: 'white',
    chipColor: 'default',
    primerColorHeader: 'from-gray-400',
    segundoColorHeader: 'to-gray-500',
  },
  {
    name: 'routes.educacion.informativa.minerales.diatomea.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.diatomea.descripcion',
    formulaQuimica: 'SiO₂·nH₂O',
    sistemaCristalino: 'routes.educacion.informativa.minerales.diatomea.sistemaCristalino',
    dureza: 1 - 2,
    colorCaracteristico: 'routes.educacion.informativa.minerales.diatomea.colorCaracteristico',
    usosAplicaciones: [
      {
        name: 'routes.educacion.informativa.minerales.diatomea.usos.filtracion.nombre',
        detalle:
          'routes.educacion.informativa.minerales.diatomea.usos.filtracion.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.diatomea.usos.absorbente.nombre',
        detalle: 'routes.educacion.informativa.minerales.diatomea.usos.absorbente.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.diatomea.usos.abrasivoSuave.nombre',
        detalle: 'routes.educacion.informativa.minerales.diatomea.usos.abrasivoSuave.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.diatomea.usos.aislanteTermicoAcustico.nombre',
        detalle: 'routes.educacion.informativa.minerales.diatomea.usos.aislanteTermicoAcustico.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.diatomea.usos.agricultura.nombre',
        detalle: 'routes.educacion.informativa.minerales.diatomea.usos.agricultura.detalle',
      },
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/diatomite-v1.glb',
    color: 'white',
    chipColor: 'warning',
    primerColorHeader: 'from-yellow-400',
    segundoColorHeader: 'to-yellow-500',
  },
  {
    name: 'routes.educacion.informativa.minerales.granito.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.granito.descripcion',
    formulaQuimica: 'Grn',
    sistemaCristalino: 'routes.educacion.informativa.minerales.granito.sistemaCristalino',
    dureza: 6,
    colorCaracteristico: 'routes.educacion.informativa.minerales.granito.colorCaracteristico',
    usosAplicaciones: [
      { name: 'routes.educacion.informativa.minerales.granito.usos.construccion.nombre', detalle: 'routes.educacion.informativa.minerales.granito.usos.construccion.detalle' },
      { name: 'routes.educacion.informativa.minerales.granito.usos.obraPublica.nombre', detalle: 'routes.educacion.informativa.minerales.granito.usos.obraPublica.detalle' },
      { name: 'routes.educacion.informativa.minerales.granito.usos.piedraTriturada.nombre', detalle: 'routes.educacion.informativa.minerales.granito.usos.piedraTriturada.detalle' },
      { name: 'routes.educacion.informativa.minerales.granito.usos.decoracion.nombre', detalle: 'routes.educacion.informativa.minerales.granito.usos.decoracion.detalle' },
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/granite_stone.glb',
    color: 'gray',
    chipColor: 'default',
    primerColorHeader: 'from-gray-300',
    segundoColorHeader: 'to-gray-400',
  },
  {
    name: 'routes.educacion.informativa.minerales.zeolita.nombre',
    descripcion:
      'routes.educacion.informativa.minerales.zeolita.descripcion',
    formulaQuimica: 'Zeo',
    sistemaCristalino: 'routes.educacion.informativa.minerales.zeolita.sistemaCristalino',
    dureza: 3 - 5,
    colorCaracteristico: 'routes.educacion.informativa.minerales.zeolita.colorCaracteristico',
    usosAplicaciones: [
      {
        name: 'routes.educacion.informativa.minerales.zeolita.usos.tratamientoAgua.nombre',
        detalle: 'routes.educacion.informativa.minerales.zeolita.usos.tratamientoAgua.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.zeolita.usos.agricultura.nombre',
        detalle: 'routes.educacion.informativa.minerales.zeolita.usos.agricultura.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.zeolita.usos.ganaderia.nombre',
        detalle: 'routes.educacion.informativa.minerales.zeolita.usos.ganaderia.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.zeolita.usos.industriaQuimica.nombre',
        detalle: 'routes.educacion.informativa.minerales.zeolita.usos.industriaQuimica.detalle',
      },
      {
        name: 'routes.educacion.informativa.minerales.zeolita.usos.medioAmbiente.nombre',
        detalle: 'routes.educacion.informativa.minerales.zeolita.usos.medioAmbiente.detalle',
      },
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/zeolithe-v3.glb',
    color: 'gray',
    chipColor: 'default',
    primerColorHeader: 'from-gray-400',
    segundoColorHeader: 'to-gray-500',
  },
];
