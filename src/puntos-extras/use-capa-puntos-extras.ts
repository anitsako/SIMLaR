import { useQuery } from '@tanstack/react-query';
import { getPuntosExtrasFn } from './get-puntos-extras.fn';
import type { FeatureCollection, Point } from 'geojson';

export const useCapaPuntosExtras = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-puntos-extras'],
    queryFn: async () => {
      const puntosExtras = await getPuntosExtrasFn();

      return {
        type: 'FeatureCollection',
        features: puntosExtras.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre, tipo: d.tipo },
        })),
      } as FeatureCollection<Point>;
    },
    enabled: options?.enabled ?? true,
  });
};
