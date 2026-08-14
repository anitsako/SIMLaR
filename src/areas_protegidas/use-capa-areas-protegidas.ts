import { useQuery } from '@tanstack/react-query';
import { getAreasProtegidasFn } from './get-areas-protegidas.fn.ts';
import type { FeatureCollection, MultiPolygon } from 'geojson';

export const useCapaAreasProtegidas = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-areas-protegidas'],
    queryFn: async () => {
      const areas = await getAreasProtegidasFn();

      return {
        type: 'FeatureCollection',
        features: areas.map((a) => ({
          type: 'Feature',
          geometry: a.geom,
          properties: { id: a.id, nombre: a.nombre, superficie: a.superficie },
        })),
      } as FeatureCollection<MultiPolygon>;
    },
    enabled: options?.enabled ?? true,
  });
};
