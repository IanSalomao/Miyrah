// Card "Alterar senha" — aba Segurança. wiki/api/account.md (PATCH /v1/account/password).
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Check } from 'lucide-react'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ApiError } from '@/lib/api-client'
import { useChangePassword } from '../hooks/use-account-mutations'
import { changePasswordSchema, type ChangePasswordFormValues } from '../schemas'

const EMPTY_VALUES: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

export function ChangePasswordCard() {
  const changePassword = useChangePassword()
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY_VALUES,
  })

  function onSubmit(values: ChangePasswordFormValues) {
    setSaved(false)
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          reset(EMPTY_VALUES)
          setSaved(true)
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === 'INVALID_CREDENTIALS') {
            setError('currentPassword', { message: error.message })
          }
        },
      },
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-1 p-6 pb-0">
        <h2 className="text-lg font-semibold">Alterar senha</h2>
        <p className="text-sm text-muted-foreground">
          Recomendamos uma senha longa e exclusiva deste sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex max-w-md flex-col gap-4 p-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="settings-current-password">Senha Atual</Label>
            <PasswordInput
              id="settings-current-password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.currentPassword)}
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="settings-new-password">Nova Senha</Label>
            <PasswordInput
              id="settings-new-password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.newPassword)}
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="settings-confirm-password">Confirmar Nova Senha</Label>
            <PasswordInput
              id="settings-confirm-password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmNewPassword)}
              {...register('confirmNewPassword')}
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-destructive">{errors.confirmNewPassword.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border p-6">
          <p className="flex items-center gap-1.5 text-sm font-medium text-income">
            {saved && (
              <>
                <Check className="size-4" />
                Senha alterada
              </>
            )}
          </p>
          <Button type="submit" disabled={changePassword.isPending}>
            {changePassword.isPending ? 'Alterando…' : 'Alterar Senha'}
          </Button>
        </div>
      </form>
    </div>
  )
}
