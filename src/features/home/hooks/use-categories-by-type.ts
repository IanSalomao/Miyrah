// Usado pelo modal de edição de transação (bloco "Últimas transações" da Início)
// — o dropdown de Categoria é sempre filtrado pelo Tipo selecionado.

import { useQuery } from '@tanstack/react-query'
import { listCategories } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { TransactionType } from '@/types'

export function useCategoriesByType(type: TransactionType) {
  return useQuery({
    queryKey: queryKeys.categories.list({ type }),
    queryFn: ({ signal }) => listCategories({ type }, signal),
  })
}
