import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getImagenesCarrouselFn } from './get-imagenes-carrousel.fn';

export const useImagenesCarrousel = (options?: { enabled?: boolean }) => {
  const getImagenesCarrousel = useServerFn(getImagenesCarrouselFn);

  return useQuery({
    queryKey: ['imagenes-carrousel'],
    queryFn: getImagenesCarrousel,
    enabled: options?.enabled,
    initialData: [],
  });
};
