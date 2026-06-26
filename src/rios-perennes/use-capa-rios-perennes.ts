import { useQuery } from '@tanstack/react-query';
import { getRiosPerennesFn } from './get-rios-perennes.fn';
import type { FeatureCollection, MultiLineString } from 'geojson';

export const useCapaRiosPerennes = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-rios-perennes'],
    queryFn: async () => {
      const riosPerennes = await getRiosPerennesFn();

      return {
        type: 'FeatureCollection',
        features: riosPerennes.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre },
        })),
      } as FeatureCollection<MultiLineString>;
    },
    enabled: options?.enabled ?? true,
  });
};
