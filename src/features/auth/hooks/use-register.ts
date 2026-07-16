// Mutation de cadastro — wiki/api/auth.md (POST /v1/auth/register)
import { useMutation } from '@tanstack/react-query'
import { register } from '@/services'
import type { RegisterPayload, RegisterResponse } from '@/types'

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: register,
  })
}
