// Confirmação de cancelamento — POST /v1/subscriptions/cancel. specs/subscription.md.
// Sem frase de confirmação: cancelar não apaga nada e o acesso segue até o fim do período.
import { useState } from 'react'
import { ConfirmModal } from '@/components/modal-form/confirm-modal'
import { ApiError } from '@/lib/api-client'
import { formatDate } from '@/lib/format'
import type { Subscription } from '@/types'
import { useCancelSubscription } from '../hooks/use-subscription-mutations'

interface CancelSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription
}

export function CancelSubscriptionModal({
  open,
  onOpenChange,
  subscription,
}: CancelSubscriptionModalProps) {
  const cancelSubscription = useCancelSubscription()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setErrorMessage(null)
    onOpenChange(nextOpen)
  }

  function handleConfirm() {
    setErrorMessage(null)
    cancelSubscription.mutate(undefined, {
      onSuccess: () => handleOpenChange(false),
      onError: (error) => {
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : 'Ocorreu um erro inesperado. Tente novamente.',
        )
      },
    })
  }

  const periodEnd = subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : null

  return (
    <ConfirmModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Cancelar assinatura"
      description={
        periodEnd ? (
          <>
            O acesso completo continua até{' '}
            <span className="font-medium text-foreground">{periodEnd}</span> e nada mais será
            cobrado. Depois disso, a conta fica em somente leitura — nenhum dado é apagado.
          </>
        ) : (
          'Nada mais será cobrado e a conta fica em somente leitura — nenhum dado é apagado.'
        )
      }
      confirmLabel="Cancelar assinatura"
      cancelLabel="Voltar"
      onConfirm={handleConfirm}
      loading={cancelSubscription.isPending}
    >
      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
    </ConfirmModal>
  )
}
