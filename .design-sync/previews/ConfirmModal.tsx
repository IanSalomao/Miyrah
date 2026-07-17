import { ConfirmModal, Input, Label } from 'miyrah'

const wrap: React.CSSProperties = {
  position: 'relative',
  width: 520,
  minHeight: 460,
  padding: 24,
  background: 'var(--background)',
}

const noop = () => {}

// Confirmação destrutiva simples: excluir uma transação.
export function DeleteTransaction() {
  return (
    <div style={wrap}>
      <ConfirmModal
        open
        onOpenChange={noop}
        onConfirm={noop}
        title="Excluir transação?"
        description={
          <>
            A transação "Dízimo — Ana Beatriz Ferreira" no valor de R$ 350,00 será
            removida. Esta ação não pode ser desfeita.
          </>
        }
      />
    </div>
  )
}

// Confirmação crítica com reautenticação: excluir conta da igreja
// (senha atual + frase de confirmação obrigatória).
export function DeleteAccount() {
  return (
    <div style={{ ...wrap, minHeight: 560 }}>
      <ConfirmModal
        open
        onOpenChange={noop}
        onConfirm={noop}
        title="Excluir conta da igreja"
        confirmLabel="Excluir definitivamente"
        cancelLabel="Manter conta"
        confirmationPhrase="EXCLUIR MINHA CONTA"
        description={
          <>
            Todos os membros, ministérios e transações da Igreja Batista Central
            serão apagados permanentemente. Esta ação é irreversível.
          </>
        }
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="current-password">Senha atual</Label>
          <Input id="current-password" type="password" placeholder="••••••••" />
        </div>
      </ConfirmModal>
    </div>
  )
}

// Confirmação não-destrutiva (botão primário em Azul).
export function NonDestructive() {
  return (
    <div style={wrap}>
      <ConfirmModal
        open
        onOpenChange={noop}
        onConfirm={noop}
        destructive={false}
        confirmLabel="Encerrar período"
        title="Encerrar o mês de junho?"
        description={
          <>
            Após o encerramento, novos lançamentos em junho/2026 ficarão bloqueados.
            Você ainda poderá consultar o período.
          </>
        }
      />
    </div>
  )
}
