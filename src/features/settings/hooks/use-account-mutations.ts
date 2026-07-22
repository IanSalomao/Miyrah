// Mutations da tela de Configurações — wiki/api/account.md.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changePassword, deleteAccount, updateAccount } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { ChangePasswordPayload, DeleteAccountPayload, UpdateAccountPayload } from '@/types'

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateAccountPayload) => updateAccount(payload),
    onSuccess: (account) => {
      // Atualiza direto o cache (compartilhado com o rodapé da side-bar) em vez de invalidar.
      queryClient.setQueryData(queryKeys.account, account)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (payload: DeleteAccountPayload) => deleteAccount(payload),
  })
}
