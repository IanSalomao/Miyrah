// Validação do token de verificação — POST /v1/auth/signup/verify-token.
// Query (não mutation) para a tela de finalização mostrar o estado do link ao montar.
import { useQuery } from '@tanstack/react-query'
import { verifySignupToken } from '@/services'

export function useVerifySignupToken(token: string | null) {
  return useQuery({
    queryKey: ['signup', 'verify', token],
    queryFn: () => verifySignupToken({ token: token as string }),
    enabled: token !== null,
    retry: false,
    staleTime: Infinity,
  })
}
