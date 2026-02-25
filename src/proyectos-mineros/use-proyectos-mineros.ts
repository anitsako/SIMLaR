import { useQuery } from '@tanstack/react-query';
import { getProyectosMinerosFn } from './get-proyectos-mineros.fn';

export const useProyectosMineros = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['proyectos-mineros'],
    queryFn: getProyectosMinerosFn,
    enabled: options?.enabled ?? true,
  });
};
