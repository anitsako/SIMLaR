import { useQuery } from '@tanstack/react-query';
import { getProyectosMinerosFn } from './get-proyectos-mineros.fn';

export const useProyectosMineros = (data: { visible?: boolean } = {}, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['proyectos-mineros'],
    queryFn: () => getProyectosMinerosFn({ data }),
    enabled: options?.enabled ?? true,
  });
};
