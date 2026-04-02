import { useQuery } from '@tanstack/react-query';
import { getProyectosMinerosCountFn } from './get-proyectos-mineros-count.fn';

export const useProyectosMinerosCount = (
  data: { nombreLike?: string; visible?: boolean } = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['proyectos-mineros-count', data],
    queryFn: () => getProyectosMinerosCountFn({ data }),
    enabled: options?.enabled ?? true,
    initialData: 0,
  });
};
