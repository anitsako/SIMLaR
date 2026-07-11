import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getDepartamentosIndicadoresFn } from './get-departamentos-indicadores.fn';

export const useDepartamentosIndicadores = (options?: { enabled?: boolean }) => {
  const getDepartamentosIndicadores = useServerFn(getDepartamentosIndicadoresFn);

  return useQuery({
    queryKey: ['departamentos-indicadores'],
    queryFn: getDepartamentosIndicadores,
    enabled: options?.enabled,
    initialData: [],
  });
};