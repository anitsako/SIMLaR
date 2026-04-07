import { queryOptions, useQuery } from '@tanstack/react-query';
import { getUsuarioFn } from './get-usuario.fn';

export const usuarioQuery = (id: number, options?: { enabled?: boolean }) =>
  queryOptions({
    queryKey: ['usuarios', id],
    queryFn: () => getUsuarioFn({ data: { id } }),
    enabled: options?.enabled ?? true,
  });

export const useUsuario = (id: number, options?: { enabled?: boolean }) => {
  return useQuery(usuarioQuery(id, options));
}; // Para usar a futuro por si queremos mostrar los datos del usuario en un modal o algo similar.
