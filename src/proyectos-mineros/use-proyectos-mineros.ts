import { useQuery } from '@tanstack/react-query';
import { getProyectosMinerosFn } from './get-proyectos-mineros.fn';

export const useProyectosMineros = (
  data: { nombreLike?: string; visible?: boolean; page?: number; limit?: number } = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['proyectos-mineros', data],
    queryFn: () => getProyectosMinerosFn({ data }),
    enabled: options?.enabled ?? true,
    initialData: {
      result: [],
      nombreLike: undefined,
      page: 1,
      limit: 8,
      total: 0,
    },
  });
};
