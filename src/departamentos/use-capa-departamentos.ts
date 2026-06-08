import { useQuery } from '@tanstack/react-query';
import { getDepartamentosFn } from './get-departamentos.fn';
import type { FeatureCollection, MultiPolygon } from 'geojson';

export const useCapaDepartamentos = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['capa-departamentos'],
    queryFn: async () => {
      const departamentos = await getDepartamentosFn();

      return {
        type: 'FeatureCollection',
        features: departamentos.map((d) => ({
          type: 'Feature',
          geometry: d.geom,
          properties: { id: d.id, nombre: d.nombre, tieneImagen: d.archivoImagenId !== null },
        })),
      } as FeatureCollection<MultiPolygon>;
    },
    enabled: options?.enabled ?? true,
  });
};
