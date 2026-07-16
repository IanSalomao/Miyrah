// Mutation de login — wiki/api/auth.md (POST /v1/auth/login)
import { useMutation } from '@tanstack/react-query'
import { login } from '@/services'
import type { LoginPayload, LoginResponse } from '@/types'

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
  })
}
