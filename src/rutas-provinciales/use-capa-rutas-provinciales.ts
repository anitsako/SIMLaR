import { useQuery } from '@tanstack/react-query';
import { getRutasProvinciales } from './get-rutas-provinciales';
import type { FeatureCollection, MultiLineString } from 'geojson';

export const useCapaRutasProvinciales = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-rutas-provinciales'],
    queryFn: async () => {
      const rutasProvinciales = await getRutasProvinciales();

      return {
        type: 'FeatureCollection',
        features: rutasProvinciales.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre, jurisdiccion: d.jurisdiccion, clase: d.clase },
        })),
      } as FeatureCollection<MultiLineString>;
    },
    enabled: options?.enabled ?? true,
  });
};
