type AccordionAttributes = {
  key: number;
  ariaLabel: string;
  title: string;
  description: string;
};

type CardAttributes = {
  title: string;
  description: string;
};

export type Mapa = {
  path: string;
  accordionDescription: Array<AccordionAttributes>;
  gridPosition: string;
  card: Array<CardAttributes>;
};

export const mapas: Array<Mapa> = [
  {
    path: '/public/hojas-geologicas/hoja-pais-h250.jpg',
    accordionDescription: [
      {
        key: 1,
        ariaLabel: 'Objetivo del mapa',
        title: 'Objetivo del mapa',
        description:
          'Mostrar la distribución de las cartas geológicas oficiales de Argentina y su cobertura territorial.',
      },
      {
        key: 2,
        ariaLabel: 'Escala cartográfica',
        title: 'Escala cartográfica',
        description:
          'El mapa utiliza una escala 1:250.000, permitiendo representar grandes áreas con buen nivel de detalle.',
      },
      {
        key: 3,
        ariaLabel: 'Información geológica',
        title: 'Información geológica',
        description:
          'Las cartas contienen datos sobre formaciones rocosas, estructuras geológicas y recursos minerales.',
      },
      {
        key: 4,
        ariaLabel: 'Importancia científica y minera',
        title: 'Importancia científica y minera',
        description:
          'Es una herramienta fundamental para investigaciones geológicas, exploración minera y estudios del suelo.',
      },
    ],
    gridPosition: 'col-start-1',
    card: [
      {
        title: 'Hoja geológica del país',
        description:
          'Mapa que representa la distribución de las cartas geológicas de Argentina, mostrando la organización territorial de los estudios geológicos realizados en el país.',
      },
    ],
  },
  {
    path: 'public/hojas-geologicas/Geológico-Regional-La Rioja.jpg',
    accordionDescription: [
      {
        key: 1,
        ariaLabel: 'Diversidad de relieves y rocas',
        title: 'Diversidad de relieves y rocas',
        description:
          'El mapa muestra sierras, valles y diferentes tipos de rocas mediante colores y símbolos geológicos.',
      },
      {
        key: 2,
        ariaLabel: 'Escalas geográficas',
        title: 'Escalas geográficas',
        description:
          'Está elaborado a escala 1:500.000, permitiendo observar la distribución regional de las unidades geológicas.',
      },
      {
        key: 3,
        ariaLabel: 'Estructuras tectónicas',
        title: 'Estructuras tectónicas',
        description:
          'El mapa identifica fallas, plegamientos y zonas de actividad geológica importantes en la provincia.',
      },
      {
        key: 4,
        ariaLabel: 'Valor educativo y técnico',
        title: 'Valor educativo y técnico',
        description:
          'Es utilizado en investigaciones, enseñanza universitaria y planificación de actividades relacionadas con geología y minería.',
      },
    ],
    gridPosition: 'col-start-5',
    card: [
      {
        title: 'Hoja geológica regional de La Rioja',
        description:
          'Mapa geológico que muestra las principales formaciones rocosas, estructuras tectónicas y características geológicas de la provincia de La Rioja.',
      },
    ],
  },
];

export interface MapasProps {
  mapa: Mapa;
}
