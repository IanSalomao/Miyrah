import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from 'miyrah'
import { Trash2, AlertTriangle } from 'lucide-react'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
  minHeight: 420,
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
}

// Confirmação destrutiva de exclusão de transação (pop-up centralizado).
export function ConfirmDelete() {
  return (
    <div style={wrap}>
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir transação?</DialogTitle>
            <DialogDescription>
              A transação "Dízimo — Ana Beatriz Ferreira" no valor de R$ 350,00 será
              removida. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive">
              <Trash2 />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Estado fechado: gatilho que abre o pop-up de confirmação.
export function Trigger() {
  return (
    <div style={wrap}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 />
            Excluir categoria
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir categoria?</DialogTitle>
            <DialogDescription>
              A categoria "Ofertas" deixará de aparecer em novos lançamentos.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Confirmação crítica: exclusão de conta da igreja (irreversível).
export function DangerConfirm() {
  return (
    <div style={wrap}>
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir conta da igreja</DialogTitle>
            <DialogDescription>
              Todos os membros, ministérios e transações da Igreja Batista Central
              serão apagados permanentemente. Esta ação é irreversível.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Manter conta</Button>
            </DialogClose>
            <Button variant="destructive">
              <AlertTriangle />
              Excluir definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
