import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getIndicadoresDepartamentoFn } from './get-indicadores-departamento.fn';

export const useIndicadoresDepartamento = (
  departamentoId: number | null
) => {
  const getIndicadoresDepartamento = useServerFn(
    getIndicadoresDepartamentoFn
  );

  return useQuery({
    queryKey: [
      'indicadores-departamento',
      departamentoId,
    ],

    queryFn: () =>
      getIndicadoresDepartamento({
        data: {
          departamentoId: departamentoId!,
        },
      }),

    enabled: departamentoId !== null,
  });
};