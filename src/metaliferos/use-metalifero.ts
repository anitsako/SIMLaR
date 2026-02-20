import { useQuery } from '@tanstack/react-query';
import { getMetaliferoFn } from './get-metalifero.fn';

export const useMetalifero = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['metaliferos', id],
    queryFn: () => getMetaliferoFn({ data: { id } }),
    enabled: options?.enabled ?? true,
  });
};
