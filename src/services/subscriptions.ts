// Assinatura — módulo `subscriptions` da API (ver specs/subscription.md).
// Ausente em src/types/api-types.d.ts até o próximo regenerate do OpenAPI.

import { apiClient } from '@/lib/api-client'
import type {
  CheckoutCreated,
  CreateCheckoutPayload,
  Paginated,
  Payment,
  PaymentsQuery,
  Subscription,
} from '@/types'

export function getSubscription(signal?: AbortSignal): Promise<Subscription> {
  return apiClient.get('/subscriptions/me', undefined, signal)
}

/** Cria a cobrança pendente e devolve a URL do checkout hospedado da AbacatePay. */
export function createCheckout(payload: CreateCheckoutPayload): Promise<CheckoutCreated> {
  return apiClient.post('/subscriptions/checkout', payload)
}

/** Cancela sem multa — o acesso segue até `currentPeriodEnd`. */
export function cancelSubscription(): Promise<Subscription> {
  return apiClient.post('/subscriptions/cancel')
}

export function listPayments(
  query: PaymentsQuery,
  signal?: AbortSignal,
): Promise<Paginated<Payment>> {
  return apiClient.get('/subscriptions/payments', { ...query }, signal)
}
