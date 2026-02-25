import { useQuery } from '@tanstack/react-query';
import { getUsuariosFn } from './get-usuarios.fn';

export const useUsuarios = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsuariosFn,
    enabled: options?.enabled ?? true,
    initialData: [],
  });
};
