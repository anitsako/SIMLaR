import { useQuery } from '@tanstack/react-query';
import { getEdicionesCatastroFn } from './ediciones.fn';

export const EDICIONES_QUERY = ['catastro-ediciones'];
export function useEdicionesCatastro() {
  return useQuery({queryKey:EDICIONES_QUERY,queryFn:()=>getEdicionesCatastroFn(),refetchInterval:60000});
}
export function urlArchivoEdicion(id: string, fecha: string, ext: string) {
  return `/archivos/${id}/catastro-${fecha}.${ext}`;
}
