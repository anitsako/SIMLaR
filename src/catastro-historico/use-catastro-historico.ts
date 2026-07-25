import { useQuery } from '@tanstack/react-query'
import { getCatastroHistoricoFn } from './get-catastro-historico.fn'

export function useCatastroHistorico() {
  return useQuery({
    queryKey: ['catastro-historico'],
    queryFn: () => getCatastroHistoricoFn(),
  })
}
