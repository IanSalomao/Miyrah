// Popup de boas-vindas exibido no primeiro acesso ao dashboard, informando o
// início do período de teste gratuito. Controlado pela DashboardPage a partir
// do onboardedAt da conta.
import { PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface TrialWelcomeDialogProps {
  open: boolean
  onDismiss: () => void
}

export function TrialWelcomeDialog({ open, onDismiss }: TrialWelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PartyPopper className="size-6" aria-hidden="true" />
          </div>
          <DialogTitle className="font-display text-xl">
            Seu teste grátis de 14 dias começou!
          </DialogTitle>
          <DialogDescription>
            Você tem acesso completo ao Miyrah por 14 dias, sem precisar de cartão. Cadastre suas
            transações, membros e ministérios à vontade. Avisaremos quando o teste estiver perto do
            fim.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button size="lg" className="w-full" onClick={onDismiss}>
            Começar a usar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
