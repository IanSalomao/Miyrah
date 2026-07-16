// Mutation do passo 1 de recuperação de senha — wiki/api/auth.md (POST /v1/auth/forgot-password)
import { useMutation } from '@tanstack/react-query'
import { forgotPassword } from '@/services'
import type { ForgotPasswordPayload, MessageResponse } from '@/types'

export function useForgotPassword() {
  return useMutation<MessageResponse, Error, ForgotPasswordPayload>({
    mutationFn: forgotPassword,
  })
}
