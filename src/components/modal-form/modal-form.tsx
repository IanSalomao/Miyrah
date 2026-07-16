// Modal sobreposto para criar/editar registro ("Formulário completo") ou confirmar
// uma ação destrutiva ("Confirmação"). Ver wiki/components/component_modal_form.md.
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { FormEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ModalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  /** Campos do formulário. Campo de Valor deve usar `font-mono` (design_system.md). */
  children: ReactNode
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  submitLabel?: string
  cancelLabel?: string
  /** Bloqueia os campos e mostra o botão de ação principal em estado de carregamento. */
  loading?: boolean
  className?: string
}

/** Variante "Formulário completo" — campos + Cancelar/Salvar, botão primário em Contas. */
export function ModalForm({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  loading = false,
  className,
}: ModalFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('sm:max-w-md', className)}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <fieldset disabled={loading} className="flex flex-col gap-4 py-4">
            {children}
          </fieldset>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando…' : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
