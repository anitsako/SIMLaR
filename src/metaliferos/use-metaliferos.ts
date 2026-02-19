import { useQuery } from '@tanstack/react-query';
import { getMetaliferosFn } from './get-metaliferos.fn';

export const useMetaliferos = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['metaliferos'],
    queryFn: getMetaliferosFn,
    enabled: options?.enabled ?? true,
  });
};
