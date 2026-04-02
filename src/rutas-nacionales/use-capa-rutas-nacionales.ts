import { useQuery } from '@tanstack/react-query';
import { getRutasNacionales } from './get-rutas-nacionales';
import type { FeatureCollection, MultiLineString } from 'geojson';

export const useCapaRutasNacionales = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-rutas-nacionales'],
    queryFn: async () => {
      const rutasNacionales = await getRutasNacionales();

      return {
        type: 'FeatureCollection',
        features: rutasNacionales.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre, jurisdiccion: d.jurisdiccion, clase: d.clase },
        })),
      } as FeatureCollection<MultiLineString>;
    },
    enabled: options?.enabled ?? true,
  });
};
