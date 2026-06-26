import { useQuery } from '@tanstack/react-query';
import { getAeropuertosFn } from './get-aeropuertos.fn';
import type { FeatureCollection, Point } from 'geojson';

export const useCapaAeropuertos = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-aeropuertos'],
    queryFn: async () => {
      const aeropuertos = await getAeropuertosFn();

      return {
        type: 'FeatureCollection',
        features: aeropuertos.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre, tipo: d.tipo },
        })),
      } as FeatureCollection<Point>;
    },
    enabled: options?.enabled ?? true,
  });
};
