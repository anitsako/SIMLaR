import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getModeloTerrenoFn } from "./get-modelo-terreno.fn";

export function useModeloTerrenoFn(
  proyectoMineroId: number,
  options?: { enabled?: boolean },
) {
  const getModelo = useServerFn(getModeloTerrenoFn);

  return useQuery({
    queryKey: ['modelo-terreno', proyectoMineroId],
    queryFn: () => getModelo({ data: { proyectoMineroId } }),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
  })

}
