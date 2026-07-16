// Variante "Confirmação" do modal-form — texto + Cancelar/ação destrutiva.
// Quando a ação exige reautenticação (ex.: Excluir Conta em page_settings), aceita
// campos extras (ex.: Senha Atual) via `children` e uma frase de confirmação
// obrigatória via `confirmationPhrase` — o botão destrutivo só habilita quando bate.
// Ver wiki/components/component_modal_form.md.
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  /** Bloqueia campos/botões enquanto a ação está em andamento. */
  loading?: boolean
  /** `true` (padrão) para ações destrutivas (Excluir) — botão em Saídas. */
  destructive?: boolean
  /**
   * Frase exata que o usuário deve digitar para habilitar a ação (ex.: "EXCLUIR MINHA CONTA").
   * Quando informada, o campo de confirmação é renderizado e o botão fica desabilitado
   * até o valor digitado bater exatamente com a frase.
   */
  confirmationPhrase?: string
  /** Rótulo do campo de frase. Padrão: `Digite "<frase>" para confirmar`. */
  confirmationLabel?: string
  /** Campos extras (ex.: Senha Atual), renderizados acima da frase de confirmação. */
  children?: ReactNode
  className?: string
}

/** Variante "Confirmação" — texto + Cancelar/ação destrutiva, botão em Saídas. */
export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  onConfirm,
  loading = false,
  destructive = true,
  confirmationPhrase,
  confirmationLabel,
  children,
  className,
}: ConfirmModalProps) {
  const [typedPhrase, setTypedPhrase] = useState('')
  const requiresPhrase = Boolean(confirmationPhrase)
  const phraseMatches = !requiresPhrase || typedPhrase === confirmationPhrase
  const isConfirmDisabled = loading || !phraseMatches

  // Limpa a frase digitada sempre que o modal fecha, para não vazar entre aberturas
  // (reset no próprio evento de fechamento, nunca em setState síncrono dentro de effect).
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setTypedPhrase('')
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn('sm:max-w-md', className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {(children || requiresPhrase) && (
          <fieldset disabled={loading} className="flex flex-col gap-4 py-2">
            {children}
            {requiresPhrase && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-modal-phrase">
                  {confirmationLabel ?? `Digite "${confirmationPhrase}" para confirmar`}
                </Label>
                <Input
                  id="confirm-modal-phrase"
                  value={typedPhrase}
                  onChange={(event) => setTypedPhrase(event.target.value)}
                  autoComplete="off"
                />
              </div>
            )}
          </fieldset>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isConfirmDisabled}
          >
            {loading ? 'Processando…' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
