import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getDepartamentosImagenesFn } from './get-departamentos-imagenes.fn';

export const useDepartamentosImagenes = (options?: { enabled?: boolean }) => {
  const getDepartamentosImagenes = useServerFn(getDepartamentosImagenesFn);

  return useQuery({
    queryKey: ['departamentos-imagenes'],
    queryFn: getDepartamentosImagenes,
    enabled: options?.enabled,
    initialData: [],
  });
};
