import { useQuery } from '@tanstack/react-query';
import { getServidumbresFn } from './get-servidumbres.fn';
import type { FeatureCollection, MultiLineString } from 'geojson';

export const useCapaServidumbres = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-servidumbres'],
    queryFn: async () => {
      const servidumbres = await getServidumbresFn();

      return {
        type: 'FeatureCollection',
        features: servidumbres.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre },
        })),
      } as FeatureCollection<MultiLineString>;
    },
    enabled: options?.enabled ?? true,
  });
};
