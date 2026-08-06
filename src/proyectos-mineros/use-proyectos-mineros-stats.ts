import { useQuery } from '@tanstack/react-query';

import { getProyectosMinerosStatsFn } from './get-proyectos-mineros-stats.fn';

export interface ProyectosMinerosStatsQueryData {
  nombreLike?: string;
  tiposIds?: Array<number>;
  etapasIds?: Array<number>;
  minerales?: Array<string>;
  ubicaciones?: Array<string>;
  propietarios?: Array<string>;
  provinciasGeologicas?: Array<string>;
  convenioEmse?: boolean;
  visibleBase?: boolean;
  visible?: boolean;
  msnmDesde?: number;
  msnmHasta?: number;
}

export const useProyectosMinerosStats = (
  data: ProyectosMinerosStatsQueryData = {},
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['proyectos-mineros-stats', data],
    queryFn: () => getProyectosMinerosStatsFn({ data }),
    enabled: options?.enabled ?? true,
  });
};
