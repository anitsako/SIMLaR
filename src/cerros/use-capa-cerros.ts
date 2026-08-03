import { useQuery } from '@tanstack/react-query';
import { getCerrosFn } from './get-cerros.fn';
import type { FeatureCollection, Point } from 'geojson';

export const useCapaCerros = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-cerros'],
    queryFn: async () => {
      const cerros = await getCerrosFn();

      return {
        type: 'FeatureCollection',
        features: cerros.map((c) => ({
          type: 'Feature',
          geometry: c.geom,
          properties: { id: c.id, nombre: c.nombre, tipo: c.tipo },
        })),
      } as FeatureCollection<Point>;
    },
    enabled: options?.enabled ?? true,
  });
};
