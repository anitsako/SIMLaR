import { useQuery } from '@tanstack/react-query';
import { getRiosFn } from './get-rios.fn';
import type { FeatureCollection, MultiLineString } from 'geojson';

export const useCapaRutasNacionales = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-rios'],
    queryFn: async () => {
      const rios = await getRiosFn();

      return {
        type: 'FeatureCollection',
        features: rios.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre, distancia: d.distancia },
        })),
      } as FeatureCollection<MultiLineString>;
    },
    enabled: options?.enabled ?? true,
  });
};
