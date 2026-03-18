import { queryOptions, useQuery } from '@tanstack/react-query';
import { getProyectoMineroFn } from './get-proyecto-minero.fn';

export const proyectoMineroQuery = (id: number, options?: { enabled?: boolean }) =>
  queryOptions({
    queryKey: ['proyectos-mineros', id],
    queryFn: () => getProyectoMineroFn({ data: { id } }),
    enabled: options?.enabled ?? true,
  });

export const useProyectoMinero = (id: number, options?: { enabled?: boolean }) => {
  return useQuery(proyectoMineroQuery(id, options));
};
