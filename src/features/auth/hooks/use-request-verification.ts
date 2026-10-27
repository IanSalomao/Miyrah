// Mutation da Etapa 0 do cadastro — POST /v1/auth/signup/request-verification
import { useMutation } from '@tanstack/react-query'
import { requestEmailVerification } from '@/services'
import type {
  RequestEmailVerificationPayload,
  RequestEmailVerificationResponse,
} from '@/types'

export function useRequestVerification() {
  return useMutation<
    RequestEmailVerificationResponse,
    Error,
    RequestEmailVerificationPayload
  >({
    mutationFn: requestEmailVerification,
  })
}
