import { queryOptions, useQuery } from '@tanstack/react-query';
import { getDepartamentoFn } from './get-departamento.fn';

export const departamentoQuery = (id: number, options?: { enabled?: boolean }) =>
  queryOptions({
    queryKey: ['departamentos', id],
    queryFn: () => getDepartamentoFn({ data: { id } }),
    enabled: options?.enabled ?? true,
  });

export const useDepartamento = (id: number, options?: { enabled?: boolean }) => {
  return useQuery(departamentoQuery(id, options));
};
