// Conta da igreja autenticada — usado no rodapé da side-bar (nome/e-mail).
import { useQuery } from '@tanstack/react-query'
import { getAccount } from '@/services'
import { queryKeys } from '@/lib/query-keys'

export function useAccount() {
  return useQuery({
    queryKey: queryKeys.account,
    queryFn: ({ signal }) => getAccount(signal),
  })
}
