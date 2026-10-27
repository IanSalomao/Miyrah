// Mutation da Etapa 1 do cadastro — POST /v1/auth/signup/complete
import { useMutation } from '@tanstack/react-query'
import { completeSignup } from '@/services'
import type { CompleteSignupPayload, SignupResponse } from '@/types'

export function useCompleteSignup() {
  return useMutation<SignupResponse, Error, CompleteSignupPayload>({
    mutationFn: completeSignup,
  })
}
