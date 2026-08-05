import { useQuery } from '@tanstack/react-query';

import { getProyectosMinerosCountFn } from './get-proyectos-mineros-count.fn';

export interface ProyectosMinerosCountQueryData {
  nombreLike?: string;
  tiposIds?: Array<number>;
  etapasIds?: Array<number>;
  minerales?: Array<string>;
  ubicaciones?: Array<string>;
  propietarios?: Array<string>;
  provinciasGeologicas?: Array<string>;
  convenioEmse?: boolean;
  visible?: boolean;
  msnmDesde?: number;
  msnmHasta?: number;
}

export const useProyectosMinerosCount = (
  data: ProyectosMinerosCountQueryData = {},
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['proyectos-mineros-count', data],
    queryFn: () => getProyectosMinerosCountFn({ data }),
    enabled: options?.enabled ?? true,
    initialData: 0,
  });
};
