import { useQuery } from '@tanstack/react-query';
import { getRiosIntermitentesFn } from './get-rios-intermitentes.fn';
import type { FeatureCollection, MultiLineString } from 'geojson';

export const useCapaRiosIntermitentes = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-rios-intermitentes'],
    queryFn: async () => {
      const riosIntermitentes = await getRiosIntermitentesFn();

      return {
        type: 'FeatureCollection',
        features: riosIntermitentes.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre },
        })),
      } as FeatureCollection<MultiLineString>;
    },
    enabled: options?.enabled ?? true,
  });
};
