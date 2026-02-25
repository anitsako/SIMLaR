import { useQuery } from '@tanstack/react-query';
import { getProyectoMineroFn } from './get-proyecto-minero.fn';

export const useProyectoMinero = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['proyectos-mineros', id],
    queryFn: () => getProyectoMineroFn({ data: { id } }),
    enabled: options?.enabled ?? true,
  });
};
