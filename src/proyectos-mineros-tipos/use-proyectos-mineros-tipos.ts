import { useQuery } from '@tanstack/react-query';
import { getProyectosMinerosTiposFn } from './get-proyectos-mineros-tipos.fn';

export const useProyectosMinerosTipos = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['proyectos-mineros-tipos'],
    queryFn: getProyectosMinerosTiposFn,
    enabled: options?.enabled ?? true,
    initialData: [],
  });
};
