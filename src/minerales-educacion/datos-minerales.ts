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
    name: 'Oro',
    descripcion:
      'Es un metal de transición blando que se encuentra normalmente en estado puro, en forma de pepitas y depósitos aluviales. Su concentración económica suele darse en sistemas hidrotermales (vetas y diseminaciones) y en depósitos secundarios tipo placer, producto de la erosión de fuentes primarias. Se caracteriza por su alto valor económico, tener baja alterabilidad, excelente conductividad, gran maleabilidad, ductilidad y resistencia a la corrosión, lo que lo convierte en un recurso de gran importancia.',
    formulaQuimica: 'Au',
    sistemaCristalino: 'Cúbico',
    dureza: 4,
    colorCaracteristico: 'Ambar, dorado',
    usosAplicaciones: [
      { name: 'Joyería y orfebrería', detalle: 'principal destino del oro.' },
      { name: 'Reserva de valor', detalle: 'utilizado como activo financiero y respaldo económico.' },
      {
        name: 'Industria electrónica',
        detalle:
          'presente en circuitos y componentes debido a su estabilidad y conductividad. Se utiliza en conectores, interruptores y cables de alta fiabilidad en teléfonos móviles, ordenadores y satélites por su resistencia a la corrosión.',
      },
      {
        name: 'Medicina y Odontología',
        detalle: 'empleado en empastes, coronas dentales y fármacos contra la artritis reumatoide.',
      },
      {
        name: 'Industria Aeroespacial',
        detalle: 'sus láminas se usan para reflejar la radiación infrarroja en trajes espaciales y satélites.',
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
    name: 'Plata',
    descripcion:
      'Es un metal precioso blanco-grisáceo, que puede presentarse en estado nativo o formando parte de minerales como sulfuros (por ejemplo, galena argentífera). Suele encontrarse asociada a otros metales, especialmente al oro, en sistemas hidrotermales. Se caracteriza por presentar la mayor conductividad eléctrica y térmica entre los metales, además de buena maleabilidad y ductilidad, poseer propiedades antibacterianas y relativa resistencia a la corrosión. Estas propiedades la hacen ampliamente utilizada.',
    formulaQuimica: 'Ag',
    sistemaCristalino: 'Cúbico',
    dureza: 2.5,
    colorCaracteristico: 'Blanco-grisáceo',
    usosAplicaciones: [
      {
        name: 'Joyería y orfebrería',
        detalle: 'se usa en aleaciones para aumentar su dureza y fabricar joyas, cubiertos y objetos decorativos.',
      },
      {
        name: 'Industria electrónica',
        detalle:
          'es principal uso industrial. En contactos, circuitos y componentes eléctricos como componentes de alta gama, interruptores, placas solares, baterías, y en conectores de dispositivos electrónicos debido a su baja resistencia. ',
      },
      { name: 'Aplicaciones industriales y químicas', detalle: 'en aleaciones, catalizadores y procesos químicos. ' },
      {
        name: 'Medicina y Salud',
        detalle:
          'se utiliza en vendajes antimicrobianos, cremas para quemaduras, instrumentos médicos y amalgamas dentales.',
      },
      {
        name: 'Purificación de Agua',
        detalle: 'aplicado para desinfectar agua potable y en piscinas debido a sus propiedades antibacterianas.',
      },
      { name: 'Fotografía (históricamente)', detalle: 'en materiales fotosensibles.' },
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/native_silver-v1.glb',
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
      {
        name: 'Industria eléctrica',
        detalle:
          'principal componente en cables, conductores y componentes electrónicos (transformadores, generadores, redes de internet). ',
      },
      { name: 'Aleaciones metálicas', detalle: 'fabricación de aleaciones como bronce y latón.' },
      {
        name: 'Construcción',
        detalle: 'tuberías de agua potable y gas, sistemas de climatización, techos y materiales estructurales.',
      },
      { name: 'Tecnologías energéticas', detalle: 'energías renovables y electromovilidad.' },
      {
        name: 'Transporte',
        detalle: ' indispensable en motores de automóviles (especialmente eléctricos), trenes, barcos y aviones.',
      },
      {
        name: 'Innovación y Salud',
        detalle: 'superficies antimicrobianas en hospitales, telas con nanopartículas de cobre y equipos médicos.',
      },
      { name: 'Otros usos', detalle: 'monedas, tuberías, utensilios de cocina, instrumentos musicales y joyería.' },
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/native_copper-v1.glb',
    color: 'red',
    chipColor: 'danger',
    primerColorHeader: 'from-red-400',
    segundoColorHeader: 'to-red-500',
  },
  {
    name: 'Litio',
    descripcion:
      'Es un metal alcalino que se encuentra en la naturaleza principalmente formando minerales (como espodumeno y lepidolita), siendo sus fuentes principales las salmueras subterráneas de cuencas evaporíticas (salares), rocas pegmatitas, y en menor medida, aguas geotermales y arcillas. Se caracteriza por su bajo peso, alta reactividad y gran capacidad de almacenamiento energético, lo que lo convierte en un recurso estratégico.',
    formulaQuimica: 'Li',
    sistemaCristalino: 'Cúbico',
    dureza: 0.6,
    colorCaracteristico: 'Blanco plateado',
    usosAplicaciones: [
      {
        name: 'Baterias recargables',
        detalle: 'principal uso en dispositivos electrónicos y vehículos eléctricos.',
      },
      {
        name: 'Industria del vidrio y cerámica',
        detalle: 'mejora resistencia térmica y reducir el punto de fusión en vidrios especiales y cerámicas.',
      },
      {
        name: 'Lubricantes y grasas industriales',
        detalle: 'Utilizado en la fabricación de lubricantes y grasas para industrias.',
      },
      {
        name: 'Industria farmacéutica',
        detalle:
          'en tratamientos médicos específicos. Ejemplo: carbonato de litio se utiliza como estabilizador del estado de ánimo en el tratamiento del trastorno bipolar.',
      },
      {
        name: 'Aleaciones aeronáuticas',
        detalle:
          'se alea con aluminio, cobre o magnesio para crear materiales ligeros y resistentes para aviones y trenes.',
      },
      {
        name: 'Otros usos',
        detalle: 'en depuradores de aire en submarinos, aire acondicionado industrial y como fundente en soldadura.',
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
    name: 'Cobalto',
    descripcion:
      'Es un metal de transición duro, ferromagnético y de color blanco azulado que se encuentra asociado a minerales de níquel y cobre, generalmente como subproducto de su explotación. No suele encontrarse en concentraciones independientes significativas. Se caracteriza por su alta resistencia a la corrosión y desgaste, estabilidad térmica y propiedades magnéticas, lo que lo hace relevante en diversas aplicaciones tecnológicas.',
    formulaQuimica: 'Co',
    sistemaCristalino: 'Hexagonal',
    dureza: 5.5,
    colorCaracteristico: 'Blanco azulado',
    usosAplicaciones: [
      {
        name: 'Baterías recargables',
        detalle:
          'especialmente en baterías de ion-litio. Es un componente crítico en el cátodo de baterías para vehículos eléctricos y dispositivos electrónicos (teléfonos, laptops).',
      },
      {
        name: 'Aleaciones metálicas',
        detalle:
          'para mejorar resistencia y durabilidad. Se utiliza para fabricar piezas de motores de aviones, turbinas de gas y herramientas de corte que requieren alta resistencia al calor y al desgaste.',
      },
      {
        name: 'Industria química',
        detalle: 'como catalizador en procesos industriales.',
      },
      {
        name: 'Imanes de alto rendimiento',
        detalle: 'se emplea en la creación de imanes permanentes potentes.',
      },
      {
        name: 'Pigmentos',
        detalle: 'en la fabricación de cerámicas, esmaltes y vidrios para obtener el característico “azul cobalto”.',
      },
      {
        name: 'Medicina',
        detalle: 'el Cobalto-60 se usa en radioterapia para tratar el cáncer y esterilizar equipos médicos.',
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
    name: 'Uranio',
    descripcion:
      'Es un metal radiactivo que se encuentra en la naturaleza formando parte de minerales como la uraninita. Es un recurso estratégico debido a su uso como fuente de energía. Se caracteriza por su densidad alta, capacidad de generar energía mediante procesos de fisión nuclear, lo que lo convierte en un elemento clave para la producción energética.',
    formulaQuimica: 'U',
    sistemaCristalino: 'Cúbico',
    dureza: 6,
    colorCaracteristico: 'Gris plateado',
    usosAplicaciones: [
      {
        name: 'Generación de energía nuclear',
        detalle:
          'combustible en centrales nucleares para generar electricidad. El uranio natural se enriquece (aumentando el U-235 al 3-5%) para esta función.',
      },
      {
        name: 'Uranio empobrecido (U-238)',
        detalle:
          'se utiliza en el blindaje de vehículos militares, contrapesos en aviones y rotores de helicópteros debido a su extrema densidad.',
      },
      {
        name: 'Aplicaciones médicas e industriales',
        detalle: 'utilizado en diagnósticos, tratamientos contra el cáncer (radioterapia).',
      },
      {
        name: 'Ciencia',
        detalle: 'para la datación de minerales y rocas.',
      },
      {
        name: 'Usos históricos',
        detalle: 'utilizado en el pasado para colorear vidrios y cerámicas.',
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
    name: 'Cuarzo',
    descripcion:
      'Es uno de los minerales más abundantes de la corteza terrestre, solo superado por los feldespatos. Su composición corresponde a dióxido de silicio (SiO₂), formado por una red tridimensional de tetraedros de silicio y oxígeno. En estado puro es incoloro y transparente, aunque puede presentar diversas coloraciones debido a impurezas. Se encuentra en rocas ígneas, metamórficas y sedimentarias.',
    formulaQuimica: 'SiO₂',
    sistemaCristalino: 'Trigonal',
    dureza: 7,
    colorCaracteristico: 'Naranja (por hierro)',
    usosAplicaciones: [
      {
        name: 'Industria vidriera',
        detalle:
          'en fabricación de distintos tipos de vidrio, como para ventanas, para envases, de placa plana, vidrio especial y fibra de vidrio.',
      },
      {
        name: 'Industria eléctrica',
        detalle:
          'en fabricación de osciladores, relojes, circuitos y dispositivos de comunicación por su capacidad de resonar frecuencias constantes lo hace fundamental.',
      },
      {
        name: 'Abrasivos',
        detalle:
          'material abrasivo en arenas silíceas, empleadas en procesos de pulido, lijado y corte de distintos materiales debido a su dureza (7 en escala de Mohs) y amplia disponibilidad.',
      },
      {
        name: 'Fundición en arena',
        detalle:
          'se utiliza en la fabricación de moldes para piezas metálicas, aprovechando su alta resistencia térmica y estabilidad a elevadas temperaturas.',
      },
    ],
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
      {
        name: 'Industria cerámica',
        detalle: 'actúa como fundente, favoreciendo la fusión y mejorando la resistencia del producto final.',
      },
      {
        name: 'Industria del vidrio',
        detalle: 'contribuye a reducir la temperatura de fusión y mejora las propiedades del vidrio. ',
      },
      {
        name: 'Pinturas, plásticos y cauchos',
        detalle:
          'utilizado como carga y extensor, aportando estabilidad, buena dispersión y resistencia a la abrasión.',
      },
      {
        name: 'Industria del papel',
        detalle: 'empleado como carga mineral para mejorar propiedades físicas y ópticas.',
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
    name: 'Baritina',
    descripcion:
      'Es un mineral compuesto principalmente por sulfato de bario (BaSO₄), principal mena del bario, caracterizado por su inusual alto peso específico (densidad elevada) y su relativa inercia química. Generalmente se presenta en tonos blancos, grisáceos o amarillentos, aunque puede adquirir distintas coloraciones debido a impurezas. Es un mineral no metálico, inerte, estable y no tóxico. El objetivo fundamental de su uso industrial radica en aprovechar su elevada densidad, estabilidad química y capacidad como material de carga, lo que mejora las propiedades físicas de diversos productos. Se encuentra comúnmente en vetas hidrotermales, asociado a minerales como galena, sulfuros y carbonatos, así como también en depósitos sedimentarios.',
    formulaQuimica: 'BaSO₄',
    sistemaCristalino: 'Ortorrombico',
    dureza: 3,
    colorCaracteristico: 'Blanco, grisáceo o amarillento',
    usosAplicaciones: [
      {
        name: 'Industria petrolera',
        detalle:
          'es su aplicación más importante, donde se utiliza como agente densificante en los lodos de perforación. Su alta densidad permite controlar la presión en los pozos, evitando derrumbes y explosiones durante la perforación. ',
      },
      {
        name: 'Industria química',
        detalle:
          'se emplea en la obtención de compuestos de bario utilizados en la fabricación de pinturas, plásticos, vidrios y productos químicos diversos. ',
      },
      {
        name: 'Industria de la construcción',
        detalle:
          'se utiliza como agregado en hormigones pesados para blindaje contra radiaciones (hospitales, centrales nucleares), debido a su alta densidad.',
      },
      {
        name: 'Pinturas y recubrimientos',
        detalle:
          'actúa como carga mineral, mejorando propiedades como la resistencia, durabilidad y acabado superficial.',
      },
      {
        name: 'Industria del caucho y plásticos',
        detalle:
          'se emplea como relleno, aportando mayor densidad, estabilidad y resistencia mecánica a los productos finales.',
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
    name: 'Arena Silícea',
    descripcion:
      'Es un material sedimentario y un árido industrial, compuesto mayoritariamente por granos de cuarzo (SiO₂), generalmente con contenidos superiores al 95%. Se origina a partir de la meteorización, transporte y acumulación de rocas ricas en cuarzo, dando lugar a depósitos en ambientes fluviales, eólicos y costeros. Se caracteriza por su alta pureza, dureza y resistencia química, lo que la convierte en un recurso de gran importancia industrial. Sus aplicaciones son esencialmente las mismas que las del cuarzo, destacándose su uso en la fabricación de vidrio, la industria de la construcción, procesos abrasivos, fundición en arena y sistemas de filtración. El objetivo de su uso industrial es aprovechar su elevado contenido de sílice, su resistencia mecánica y su comportamiento estable frente a altas temperaturas. Los principales depósitos de arena silícea se encuentran en ambientes sedimentarios, como ríos, dunas y antiguos sistemas costeros, donde los procesos de selección natural concentran granos de cuarzo de alta pureza.',
    formulaQuimica: 'SiO₂',
    sistemaCristalino: 'Trigonal',
    dureza: 7,
    colorCaracteristico: 'Blanco',
    origenGeologico: '',
    modelPath: '',
    color: 'white',
    chipColor: 'default',
    primerColorHeader: 'from-gray-400',
    segundoColorHeader: 'to-gray-500',
  },
  {
    name: 'Diatomea',
    descripcion:
      'Es un material sedimentario y un mineral industrial, formado por la acumulación de frústulas (caparazones) de algas microscópicas llamadas diatomeas, compuestas principalmente por sílice amorfa (SiO₂·nH₂O). Se origina en ambientes lacustres y marinos, donde la acumulación y compactación de estos restos biogénicos da lugar a depósitos de gran pureza y elevada porosidad. Se caracteriza por su baja densidad, alta porosidad, gran capacidad de absorción y propiedades abrasivas suaves, lo que la convierte en un recurso de amplia aplicación industrial.',
    formulaQuimica: 'SiO₂·nH₂O',
    sistemaCristalino: 'Amorfo',
    dureza: 1 - 2,
    colorCaracteristico: 'Blanco, grisáceo o amarillento',
    usosAplicaciones: [
      {
        name: 'Filtración',
        detalle:
          'es uno de sus usos más importantes, empleándose como medio filtrante en la industria alimenticia (bebidas, aceites), farmacéutica y química.',
      },
      {
        name: 'Absorbente',
        detalle: 'utilizada para la contención de derrames de líquidos debido a su alta capacidad de absorción.',
      },
      {
        name: 'Abrasivo suave',
        detalle: 'presente en productos como pastas dentales, pulidores y limpiadores.',
      },
      {
        name: 'Aislante térmico y acústico',
        detalle: 'debido a su baja conductividad térmica.',
      },
      {
        name: 'Agricultura',
        detalle: 'utilizada como insecticida natural y acondicionador de suelos.',
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
    name: 'Granito',
    descripcion:
      'Corresponde a una categoría comercial dentro de las rocas de aplicación, utilizada en la industria de la construcción y ornamental para agrupar materiales pétreos de alta dureza, resistencia y aptitud para el pulido. En este sentido, el término no se limita estrictamente al granito desde el punto de vista petrográfico, sino que incluye diversas rocas ígneas y metamórficas con propiedades físicas similares como mármoles, calizas, basaltos, pizarras y cuarcitas. Se caracteriza por su elevada resistencia mecánica, durabilidad frente a la intemperie y buena terminación superficial, lo que lo convierte en un material ampliamente utilizado.',
    formulaQuimica: 'Grn',
    sistemaCristalino: 'N/A',
    dureza: 6,
    colorCaracteristico: 'Varía según la composición mineralógica',
    usosAplicaciones: [
      { name: 'Construcción', detalle: 'revestimientos, pisos, mesadas, escaleras y fachadas.' },
      { name: 'Obra pública', detalle: 'adoquines, cordones cuneta y elementos estructurales.' },
      { name: 'Piedra triturada', detalle: 'áridos para hormigones y bases de caminos.' },
      { name: 'Decoración', detalle: 'elementos ornamentales debido a su variedad de colores y texturas.' },
    ],
    origenGeologico: '',
    modelPath: '/modelos-3d/granite_stone.glb',
    color: 'gray',
    chipColor: 'default',
    primerColorHeader: 'from-gray-300',
    segundoColorHeader: 'to-gray-400',
  },
  {
    name: 'Zeolita',
    descripcion:
      'Corresponden a un grupo de minerales aluminosilicatos hidratados y un mineral industrial no metalífero, caracterizados por poseer una estructura cristalina porosa con cavidades y canales internos. Esta estructura les permite intercambiar cationes y adsorber moléculas, lo que constituye la base de sus aplicaciones. Se forman principalmente en rocas volcánicas (especialmente en tobas) mediante procesos de alteración hidrotermal o diagenética. Se destacan por su alta capacidad de intercambio catiónico, elevada porosidad, capacidad de adsorción y estabilidad química, propiedades que las convierten en un recurso de gran interés industrial.',
    formulaQuimica: 'Zeo',
    sistemaCristalino: 'Varía según el tipo de zeolita',
    dureza: 3 - 5,
    colorCaracteristico: 'Varía según el tipo de zeolita',
    usosAplicaciones: [
      {
        name: 'Tratamiento de agua',
        detalle: 'eliminación de metales pesados, amonio y otros contaminantes.',
      },
      {
        name: 'Agricultura',
        detalle: 'mejorador de suelos, reteniendo nutrientes y humedad.',
      },
      {
        name: 'Ganadería',
        detalle: 'aditivo en alimentos para animales, ayudando a la absorción de toxinas.',
      },
      {
        name: 'Industria química',
        detalle: 'como tamiz molecular y catalizador en distintos procesos.',
      },
      {
        name: 'Medio ambiente',
        detalle: 'control de olores y remediación de suelos contaminados.',
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
