import { useQuery } from '@tanstack/react-query';
import { getProyectosMinerosFn } from './get-proyectos-mineros.fn';

export const useProyectosMineros = (
  data: {
    nombreLike?: string;
    etapasIds?: Array<number>;
    tiposIds?: Array<number>;
    visible?: boolean;
    limit?: number;
    offset?: number;
  } = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['proyectos-mineros', data],
    queryFn: () => getProyectosMinerosFn({ data }),
    enabled: options?.enabled ?? true,
    initialData: [],
  });
};
