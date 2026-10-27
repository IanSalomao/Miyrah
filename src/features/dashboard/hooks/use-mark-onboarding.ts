// Marca o primeiro acesso como concluído — POST /v1/account/onboarding-seen.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markOnboardingSeen } from '@/services'
import { queryKeys } from '@/lib/query-keys'

export function useMarkOnboarding() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markOnboardingSeen,
    onSuccess: () => {
      // Atualiza o perfil em cache (onboardedAt deixa de ser null) para o popup
      // não reaparecer em outra visita.
      void queryClient.invalidateQueries({ queryKey: queryKeys.account })
    },
  })
}
