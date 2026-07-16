// Drawer lateral (não-modal) para criar/editar registro. Substitui o antigo
// modal centralizado: aparece na lateral direita e MANTÉM a tela principal
// utilizável (sem overlay bloqueante, não fecha ao clicar fora). Ações
// destrutivas continuam em pop-up centralizado — ver `confirm-modal.tsx`.
// Ver wiki/components/component_modal_form.md.
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { FormEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FormDrawerProps {
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

/**
 * Formulário lateral de criar/editar — cabeçalho fixo, corpo rolável e rodapé
 * com Cancelar/Salvar (botão primário em Azul). Não-modal: a tela principal
 * segue interativa enquanto o drawer está aberto.
 */
export function FormDrawer({
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
}: FormDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        side="right"
        overlay={false}
        className={cn('w-full sm:max-w-md', className)}
        // Não-modal: clicar/interagir na tela principal não fecha o drawer.
        onInteractOutside={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <fieldset disabled={loading} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
            {children}
          </fieldset>
          <SheetFooter>
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
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
