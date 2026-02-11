import { useQuery } from '@tanstack/react-query';
import { getDepartamentos } from './get-departamentos';
import type { FeatureCollection, MultiPolygon } from 'geojson';

export const useCapaDepartamentos = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-departamentos'],
    queryFn: async () => {
      const departamentos = await getDepartamentos();

      return {
        type: 'FeatureCollection',
        features: departamentos.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre },
        })),
      } as FeatureCollection<MultiPolygon>;
    },
    enabled: options?.enabled ?? true,
  });
};
