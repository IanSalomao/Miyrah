// Zona de perigo "Excluir Conta" — aba Segurança. wiki/pages/page_settings.md.
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DangerZoneCardProps {
  onDelete: () => void
}

export function DangerZoneCard({ onDelete }: DangerZoneCardProps) {
  return (
    <div className="rounded-lg border border-expense/30 bg-card shadow-sm">
      <div className="flex items-start gap-3 p-6 pb-0">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-expense/10 text-expense">
          <AlertTriangle className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Excluir conta</h2>
          <p className="text-sm text-muted-foreground">Zona de perigo — ação irreversível.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 p-6">
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Ao excluir a conta,{' '}
          <strong className="font-medium text-foreground">
            todos os membros, ministérios e transações
          </strong>{' '}
          da igreja serão apagados permanentemente. O acesso é encerrado na hora e não há prazo de
          recuperação.
        </p>
        <Button type="button" variant="destructive" onClick={onDelete}>
          Excluir Conta
        </Button>
      </div>
    </div>
  )
}
