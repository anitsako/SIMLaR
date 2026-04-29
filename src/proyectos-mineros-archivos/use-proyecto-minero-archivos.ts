import { queryOptions, useQuery } from '@tanstack/react-query';
import { getProyectoMineroArchivosFn } from './get-proyecto-minero-archivos.fn';

export const proyectoMineroArchivosQuery = (proyectoMineroId: number, options?: { enabled?: boolean }) =>
  queryOptions({
    queryKey: ['proyectos-mineros-archivos', proyectoMineroId],
    queryFn: () => getProyectoMineroArchivosFn({ data: { proyectoMineroId } }),
    enabled: options?.enabled ?? true,
  });

export const useProyectoMineroArchivos = (proyectoMineroId: number, options?: { enabled?: boolean }) => {
  return useQuery(proyectoMineroArchivosQuery(proyectoMineroId, options));
};
