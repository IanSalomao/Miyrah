// Pop-up de confirmação de senha para a sub-opção "Incluir Membro" — dado
// sensível (nome do doador × valor). Ver wiki/pages/page_reports.md e o aviso em
// wiki/Miyrah.md (Relatórios). A senha não é verificada aqui: só é retida no
// estado do formulário e validada quando o relatório é gerado.
//
// Confirmar  → fecha mantendo "Incluir Membro" marcado e a senha retida.
// Cancelar/X → fecha desmarcando "Incluir Membro" e descartando a senha.

import type { FormEvent } from 'react'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'

interface IncludeMemberModalProps {
  open: boolean
  password: string
  /** Mensagem de senha incorreta (401 na geração) — reabre o pop-up com o erro. */
  error?: string | null
  onPasswordChange: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
}

export function IncludeMemberModal({
  open,
  password,
  error,
  onPasswordChange,
  onConfirm,
  onCancel,
}: IncludeMemberModalProps) {
  const canConfirm = password.trim().length > 0

  function handleOpenChange(next: boolean) {
    // Fechar por overlay/Esc/X equivale a Cancelar (desmarca e descarta a senha).
    if (!next) onCancel()
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (canConfirm) onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Incluir nome do membro</DialogTitle>
          <DialogDescription>
            O relatório vai associar o nome de cada membro ao valor doado — um dado sensível.
            Confirme sua senha para liberar essa informação; ela é verificada só na hora de gerar
            o relatório.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-start gap-2.5 rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden />
            <p>
              Compartilhe o PDF apenas com quem tem autorização para ver quanto cada pessoa
              contribuiu.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="report-current-password">Senha atual</Label>
            <PasswordInput
              id="report-current-password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              autoComplete="current-password"
              autoFocus
              aria-invalid={Boolean(error)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!canConfirm}>
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
