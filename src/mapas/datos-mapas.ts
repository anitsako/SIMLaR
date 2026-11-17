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
    path: '/hojas-geologicas/hoja-pais-h250.jpg',
    accordionDescription: [
      {
        key: 1,
        ariaLabel: 'routes.mapasGeologicos.mapas.hojaPais.items.objetivo.titulo',
        title: 'routes.mapasGeologicos.mapas.hojaPais.items.objetivo.titulo',
        description:
          'routes.mapasGeologicos.mapas.hojaPais.items.objetivo.descripcion',
      },
      {
        key: 2,
        ariaLabel: 'routes.mapasGeologicos.mapas.hojaPais.items.escala.titulo',
        title: 'routes.mapasGeologicos.mapas.hojaPais.items.escala.titulo',
        description:
          'routes.mapasGeologicos.mapas.hojaPais.items.escala.descripcion',
      },
      {
        key: 3,
        ariaLabel: 'routes.mapasGeologicos.mapas.hojaPais.items.informacion.titulo',
        title: 'routes.mapasGeologicos.mapas.hojaPais.items.informacion.titulo',
        description:
          'routes.mapasGeologicos.mapas.hojaPais.items.informacion.descripcion',
      },
      {
        key: 4,
        ariaLabel: 'routes.mapasGeologicos.mapas.hojaPais.items.importancia.titulo',
        title: 'routes.mapasGeologicos.mapas.hojaPais.items.importancia.titulo',
        description:
          'routes.mapasGeologicos.mapas.hojaPais.items.importancia.descripcion',
      },
    ],
    gridPosition: 'col-start-1',
    card: [
      {
        title: 'routes.mapasGeologicos.mapas.hojaPais.titulo',
        description:
          'routes.mapasGeologicos.mapas.hojaPais.descripcion',
      },
    ],
  },
  {
    path: '/hojas-geologicas/Geológico-Regional-La Rioja.jpg',
    accordionDescription: [
      {
        key: 1,
        ariaLabel: 'routes.mapasGeologicos.mapas.regional.items.diversidad.titulo',
        title: 'routes.mapasGeologicos.mapas.regional.items.diversidad.titulo',
        description:
          'routes.mapasGeologicos.mapas.regional.items.diversidad.descripcion',
      },
      {
        key: 2,
        ariaLabel: 'routes.mapasGeologicos.mapas.regional.items.escala.titulo',
        title: 'routes.mapasGeologicos.mapas.regional.items.escala.titulo',
        description:
          'routes.mapasGeologicos.mapas.regional.items.escala.descripcion',
      },
      {
        key: 3,
        ariaLabel: 'routes.mapasGeologicos.mapas.regional.items.estructuras.titulo',
        title: 'routes.mapasGeologicos.mapas.regional.items.estructuras.titulo',
        description:
          'routes.mapasGeologicos.mapas.regional.items.estructuras.descripcion',
      },
      {
        key: 4,
        ariaLabel: 'routes.mapasGeologicos.mapas.regional.items.valor.titulo',
        title: 'routes.mapasGeologicos.mapas.regional.items.valor.titulo',
        description:
          'routes.mapasGeologicos.mapas.regional.items.valor.descripcion',
      },
    ],
    gridPosition: 'col-start-5',
    card: [
      {
        title: 'routes.mapasGeologicos.mapas.regional.titulo',
        description:
          'routes.mapasGeologicos.mapas.regional.descripcion',
      },
    ],
  },
];

export interface MapasProps {
  mapa: Mapa;
}
