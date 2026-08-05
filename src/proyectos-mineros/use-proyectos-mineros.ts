import { useQuery } from '@tanstack/react-query';

import { getProyectosMinerosFn } from './get-proyectos-mineros.fn';

export interface ProyectosMinerosQueryData {
  nombreLike?: string;
  etapasIds?: Array<number>;
  tiposIds?: Array<number>;
  minerales?: Array<string>;
  ubicaciones?: Array<string>;
  propietarios?: Array<string>;
  provinciasGeologicas?: Array<string>;
  convenioEmse?: boolean;
  visible?: boolean;
  msnmDesde?: number;
  msnmHasta?: number;
  limit?: number;
  offset?: number;
}

export const useProyectosMineros = (
  data: ProyectosMinerosQueryData = {},
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['proyectos-mineros', data],
    queryFn: () => getProyectosMinerosFn({ data }),
    enabled: options?.enabled ?? true,
    initialData: [],
  });
};
