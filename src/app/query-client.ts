import { MutationCache, QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'

// Client único da aplicação. Sem retry em erros 4xx da API (são determinísticos).
export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      // 402: a conta caiu em somente leitura — recarrega a assinatura para o aviso
      // global aparecer na hora (o formulário já exibe a mensagem da API).
      if (error instanceof ApiError && error.code === 'SUBSCRIPTION_INACTIVE') {
        void queryClient.invalidateQueries({ queryKey: queryKeys.subscription.all })
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})
