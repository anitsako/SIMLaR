import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getGaleriaFotosFn } from './get-galeria-fotos.fn';

export const useGaleriaFotos = (options?: { enabled?: boolean }) => {
  const getGaleriaFotos = useServerFn(getGaleriaFotosFn);

  return useQuery({
    queryKey: ['galeria-fotos'],
    queryFn: getGaleriaFotos,
    enabled: options?.enabled,
    initialData: [],
  });
};
