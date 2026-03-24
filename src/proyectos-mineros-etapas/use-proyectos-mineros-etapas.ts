import { useQuery } from '@tanstack/react-query';
import { getProyectosMinerosEtapasFn } from './get-proyectos-mineros-etapas.fn';

export const useProyectosMinerosEtapas = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['proyectos-mineros-etapas'],
    queryFn: getProyectosMinerosEtapasFn,
    enabled: options?.enabled ?? true,
    initialData: [],
  });
};
