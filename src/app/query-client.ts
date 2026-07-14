import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'

// Client único da aplicação. Sem retry em erros 4xx da API (são determinísticos).
export const queryClient = new QueryClient({
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
