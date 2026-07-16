// Estado de erro por bloco (métricas, gráficos) da tela Dashboard — ícone + mensagem
// + "Tentar novamente", conforme convenção geral de estados de erro por bloco.

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BlockErrorProps {
  message?: string
  onRetry: () => void
  className?: string
}

export function BlockError({
  message = 'Não foi possível carregar estes dados.',
  onRetry,
  className,
}: BlockErrorProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-md border border-border p-8 text-center text-muted-foreground',
        className,
      )}
    >
      <AlertTriangle className="size-8 text-expense" aria-hidden />
      <p className="text-sm">{message}</p>
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  )
}
