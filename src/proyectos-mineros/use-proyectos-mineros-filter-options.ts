import { useQuery } from '@tanstack/react-query';

import { getProyectosMinerosFilterOptionsFn } from './get-proyectos-mineros-filter-options.fn';

export const useProyectosMinerosFilterOptions = (
  data: {
    visible?: boolean;
  } = {},
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['proyectos-mineros-filter-options', data],
    queryFn: () => getProyectosMinerosFilterOptionsFn({ data }),
    enabled: options?.enabled ?? true,
    initialData: {
      minerales: [],
      ubicaciones: [],
      propietarios: [],
      provinciasGeologicas: [],
    },
  });
};
