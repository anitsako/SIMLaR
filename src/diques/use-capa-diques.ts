import { useQuery } from '@tanstack/react-query';
import { getDiques } from './get-diques';
import type { FeatureCollection, MultiPolygon } from 'geojson';

export const useCapaDiques = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-diques'],
    queryFn: async () => {
      const diques = await getDiques();

      return {
        type: 'FeatureCollection',
        features: diques.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre, superficie: d.superficie },
        })),
      } as FeatureCollection<MultiPolygon>;
    },
    enabled: options?.enabled ?? true,
  });
};
