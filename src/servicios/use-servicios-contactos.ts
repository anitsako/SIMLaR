import { useQuery } from '@tanstack/react-query';
import { getServiciosContactosFn } from './get-servicios-contactos.fn';

export const useServiciosContactos = (
  incluirOcultos: boolean,
) => {
  return useQuery({
    queryKey: ['servicios-contactos', { incluirOcultos }],
    queryFn: () =>
      getServiciosContactosFn({
        data: { incluirOcultos },
      }),
  });
};
