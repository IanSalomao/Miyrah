// Atualiza o perfil na Etapa 2 do cadastro — PATCH /v1/account.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAccount } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { UpdateAccountPayload } from '@/types'

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateAccountPayload) => updateAccount(payload),
    onSuccess: (account) => {
      // Mantém o cache da conta (rodapé da side-bar / popup) em dia.
      queryClient.setQueryData(queryKeys.account, account)
    },
  })
}
