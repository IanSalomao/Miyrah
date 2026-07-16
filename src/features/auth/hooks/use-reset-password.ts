// Mutation do passo 3 de recuperação de senha — wiki/api/auth.md (POST /v1/auth/reset-password)
import { useMutation } from '@tanstack/react-query'
import { resetPassword } from '@/services'
import type { MessageResponse, ResetPasswordPayload } from '@/types'

export function useResetPassword() {
  return useMutation<MessageResponse, Error, ResetPasswordPayload>({
    mutationFn: resetPassword,
  })
}
