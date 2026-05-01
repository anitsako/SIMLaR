type chipColorType = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined;

export type Mineral = {
  name: string;
  descripcion: string;
  formulaQuimica: string;
  sistemaCristalino: string | undefined;
  dureza: number | undefined;
  colorCaracteristico: string;
  usosAplicaciones: Array<string>;
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
    name: 'Oro',
    descripcion:
      'Es un metal de transición blando que se encuentra normalmente en estado puro, en forma de pepitas y depósitos aluviales. Su concentración económica suele darse en sistemas hidrotermales (vetas y diseminaciones) y en depósitos secundarios tipo placer, producto de la erosión de fuentes primarias. Se caracteriza por su alto valor económico, tener baja alterabilidad, excelente conductividad, gran maleabilidad, ductilidad y resistencia a la corrosión, lo que lo convierte en un recurso de gran importancia.',
    formulaQuimica: 'Au',
    sistemaCristalino: 'Cúbico',
    dureza: 4,
    colorCaracteristico: 'Ambar, dorado',
    usosAplicaciones: [
      'Joyería y orfebrería',
      'Reserva de valor',
      'Industria electrónica',
      'Medicina y Odontología',
      'Industria Aeroespacial',
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/oro.glb',
    color: 'yellow',
    chipColor: 'warning',
    primerColorHeader: 'from-yellow-400',
    segundoColorHeader: 'to-yellow-500',
  },
  {
    name: 'Plata',
    descripcion:
      'Es un metal precioso blanco-grisáceo, que puede presentarse en estado nativo o formando parte de minerales como sulfuros (por ejemplo, galena argentífera). Suele encontrarse asociada a otros metales, especialmente al oro, en sistemas hidrotermales. Se caracteriza por presentar la mayor conductividad eléctrica y térmica entre los metales, además de buena maleabilidad y ductilidad, poseer propiedades antibacterianas y relativa resistencia a la corrosión. Estas propiedades la hacen ampliamente utilizada.',
    formulaQuimica: 'Ag',
    sistemaCristalino: 'Cúbico',
    dureza: 2.5,
    colorCaracteristico: 'Blanco-grisáceo',
    usosAplicaciones: [
      'Joyería y orfebrería',
      'Industria electrónica',
      'Aplicaciones industriales y químicas',
      'Medicina y Salud',
      'Purificación de Agua',
      'Purificación de Agua',
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/native_silver.glb',
    color: 'gray',
    chipColor: 'secondary',
    primerColorHeader: 'from-gray-400',
    segundoColorHeader: 'to-gray-500',
  },
  {
    name: 'Cobre',
    descripcion:
      'Es un metal de transición de color rojizo, que se presenta en la naturaleza en estado nativo, pero principalmente combinado con otros elementos formando parte de sulfuros (como calcopirita), óxidos y carbonatos. Sus yacimientos se encuentran principalmente en sistemas hidrotermales y depósitos tipo pórfido, donde puede presentarse en grandes volúmenes de baja ley. Se caracteriza por su alta conductividad eléctrica y térmica, ductilidad, maleabilidad y resistencia a la corrosión, lo que lo convierte en uno de los metales más utilizados a nivel mundial. Es 100% reciclable, fundamental en la industria eléctrica, construcción, transporte y, más recientemente, por sus propiedades antimicrobianas en la salud.',
    formulaQuimica: 'Cu',
    sistemaCristalino: 'Cúbico',
    dureza: 3,
    colorCaracteristico: 'Rojizo',
    usosAplicaciones: [
      'Industria eléctrica',
      'Construcción',
      'Tecnologías energéticas',
      'Transporte',
      'Innovación y Salud',
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/native_copper.glb',
    color: 'red',
    chipColor: 'danger',
    primerColorHeader: 'from-red-400',
    segundoColorHeader: 'to-red-500',
  },
  {
    name: 'Cuarzo',
    descripcion:
      'Es uno de los minerales más abundantes de la corteza terrestre, solo superado por los feldespatos. Su composición corresponde a dióxido de silicio (SiO₂), formado por una red tridimensional de tetraedros de silicio y oxígeno. En estado puro es incoloro y transparente, aunque puede presentar diversas coloraciones debido a impurezas. Se encuentra en rocas ígneas, metamórficas y sedimentarias.',
    formulaQuimica: 'SiO₂',
    sistemaCristalino: 'Trigonal',
    dureza: 7,
    colorCaracteristico: 'Naranja (por hierro)',
    usosAplicaciones: ['Industria vidriera', 'Industria eléctrica', 'Abrasivos', 'Fundición en arena'],
    origenGeologico:
      'Se forma en vetas hidrotermales y cavidades en rocas ígneas y metamórficas. Las inclusiones de hierro provienen de fluidos mineralizados durante el proceso de cristalización.',
    modelPath: '/modelos-3d/quartz.glb',
    color: 'orange',
    chipColor: 'warning',
    primerColorHeader: 'from-orange-400',
    segundoColorHeader: 'to-orange-500',
  },
  {
    name: 'Feldespato',
    descripcion:
      ' Son aluminosilicatos mezclados con cantidades variables de potasio, sodio y calcio. Junto con el cuarzo son los más abundante en la corteza, alrededor del 60%. Se encuentran en rocas ígneas, metamórficas y, en menor medida, sedimentarias. Para su aprovechamiento industrial requieren procesos de trituración, molienda y tamizado. Se caracterizan por su baja temperatura de fusión relativa, estabilidad química y capacidad fundente, lo que los hace esenciales en diversos procesos industriales.',
    formulaQuimica: 'Fds',
    sistemaCristalino: 'Triclinico',
    dureza: 6,
    colorCaracteristico: 'Blanco, amarillo',
    usosAplicaciones: [
      'Industria cerámica',
      'Industria del vidrio',
      'Pinturas, plásticos y cauchos',
      'Industria del papel',
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/feldespato.glb',
    color: 'green',
    chipColor: 'success',
    primerColorHeader: 'from-green-400',
    segundoColorHeader: 'to-green-500',
  },
  {
    name: 'Granito',
    descripcion:
      'Corresponde a una categoría comercial dentro de las rocas de aplicación, utilizada en la industria de la construcción y ornamental para agrupar materiales pétreos de alta dureza, resistencia y aptitud para el pulido. En este sentido, el término no se limita estrictamente al granito desde el punto de vista petrográfico, sino que incluye diversas rocas ígneas y metamórficas con propiedades físicas similares como mármoles, calizas, basaltos, pizarras y cuarcitas. Se caracteriza por su elevada resistencia mecánica, durabilidad frente a la intemperie y buena terminación superficial, lo que lo convierte en un material ampliamente utilizado.',
    formulaQuimica: 'Grn',
    sistemaCristalino: 'N/A',
    dureza: 6,
    colorCaracteristico: 'Varía según la composición mineralógica',
    usosAplicaciones: ['Construcción', 'Obra pública', 'Piedra triturada', 'Decoración'],
    origenGeologico: '',
    modelPath: '/modelos-3d/granite_stone.glb',
    color: 'gray',
    chipColor: 'default',
    primerColorHeader: 'from-gray-300',
    segundoColorHeader: 'to-gray-400',
  },
];
