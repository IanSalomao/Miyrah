// Confirmação de exclusão de conta — component_modal_form.md (variante "Confirmação"),
// com reautenticação (Senha Atual) + frase de confirmação. wiki/api/account.md (DELETE /v1/account).
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/auth-context'
import { ConfirmModal } from '@/components/modal-form/confirm-modal'
import { PasswordInput } from '@/components/password-input'
import { Label } from '@/components/ui/label'
import { ApiError } from '@/lib/api-client'
import { useDeleteAccount } from '../hooks/use-account-mutations'

const CONFIRMATION_PHRASE = 'EXCLUIR'

interface DeleteAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAccountModal({ open, onOpenChange }: DeleteAccountModalProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const deleteAccount = useDeleteAccount()
  const [currentPassword, setCurrentPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setCurrentPassword('')
      setPasswordError(null)
      setFormError(null)
    }
    onOpenChange(nextOpen)
  }

  function handleConfirm() {
    setFormError(null)
    if (!currentPassword) {
      setPasswordError('Informe a senha atual.')
      return
    }
    setPasswordError(null)
    deleteAccount.mutate(
      { currentPassword, confirmationPhrase: CONFIRMATION_PHRASE },
      {
        onSuccess: () => {
          // Ação irreversível: encerra a sessão e volta para o login.
          logout()
          navigate('/login', { replace: true })
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === 'INVALID_CREDENTIALS') {
            setPasswordError(error.message)
            return
          }
          setFormError(
            error instanceof ApiError
              ? error.message
              : 'Ocorreu um erro inesperado. Tente novamente.',
          )
        },
      },
    )
  }

  return (
    <ConfirmModal
      open={open}
      onOpenChange={handleOpenChange}
      onConfirm={handleConfirm}
      loading={deleteAccount.isPending}
      title="Excluir conta da igreja"
      description="Esta ação é irreversível. Confirme sua identidade e digite a frase abaixo para prosseguir."
      confirmLabel="Excluir definitivamente"
      cancelLabel="Manter conta"
      confirmationPhrase={CONFIRMATION_PHRASE}
      confirmationLabel={`Digite "${CONFIRMATION_PHRASE}" para confirmar`}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="delete-account-password">Senha Atual</Label>
        <PasswordInput
          id="delete-account-password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => {
            setCurrentPassword(event.target.value)
            setPasswordError(null)
          }}
        />
        {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
      </div>
      {formError && <p className="text-sm text-destructive">{formError}</p>}
    </ConfirmModal>
  )
}
