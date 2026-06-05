import { useQuery } from '@tanstack/react-query';
import { getRefugiosFn } from './get-refugios.fn';
import type { FeatureCollection, Point } from 'geojson';

export const useCapaRefugios = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-refugios'],
    queryFn: async () => {
      const refugios = await getRefugiosFn();

      return {
        type: 'FeatureCollection',
        features: refugios.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre, tipo: d.tipo },
        })),
      } as FeatureCollection<Point>;
    },
    enabled: options?.enabled ?? true,
  });
};
