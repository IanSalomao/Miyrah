// wiki/pages/page_forgot_password.md — Passo 3 (nova senha) e Passo 4 (sucesso)
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheck, TriangleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ApiError } from '@/lib/api-client'
import { useResetPassword } from './hooks/use-reset-password'
import { resetPasswordSchema, type ResetPasswordFormValues } from './schemas'

type Step = 'form' | 'success' | 'invalid-token'

// Redirecionamento automático para o login após o Passo 4 (sucesso).
const SUCCESS_REDIRECT_DELAY_MS = 3000

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const resetPasswordMutation = useResetPassword()
  const [step, setStep] = useState<Step>(token ? 'form' : 'invalid-token')
  const [genericError, setGenericError] = useState<string | null>(null)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmNewPassword: '' },
  })

  useEffect(() => {
    if (step !== 'success') return
    const timeout = setTimeout(() => navigate('/login', { replace: true }), SUCCESS_REDIRECT_DELAY_MS)
    return () => clearTimeout(timeout)
  }, [step, navigate])

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      setStep('invalid-token')
      return
    }
    setGenericError(null)
    try {
      await resetPasswordMutation.mutateAsync({ token, newPassword: values.newPassword })
      setStep('success')
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'INVALID_OR_EXPIRED_TOKEN') {
          setStep('invalid-token')
          return
        }
        if (error.code === 'VALIDATION_ERROR' && error.details) {
          for (const detail of error.details) {
            if (detail.field === 'newPassword') {
              form.setError('newPassword', { message: detail.message })
            }
          }
          return
        }
        setGenericError(error.message)
        return
      }
      setGenericError('Ocorreu um erro inesperado. Tente novamente.')
    }
  }

  if (step === 'invalid-token') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <TriangleAlert className="size-10 text-destructive" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">
            Link inválido ou expirado
          </h1>
          <p className="text-sm text-muted-foreground">
            Este link de recuperação expirou ou já foi utilizado. Solicite um novo link para
            continuar.
          </p>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link to="/forgot-password">Solicitar novo link</Link>
        </Button>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <CircleCheck className="size-10 text-income" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">
            Senha alterada com sucesso
          </h1>
          <p className="text-sm text-muted-foreground">
            Você será redirecionado para o login em instantes.
          </p>
        </div>
        <Link to="/login" className="text-sm text-primary underline-offset-4 hover:underline">
          Ir para o login agora
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Defina nova senha
        </h1>
        <p className="text-base text-muted-foreground">Escolha uma nova senha para sua conta.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {genericError && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {genericError}
            </p>
          )}

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Nova Senha</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? 'Salvando...' : 'Salvar nova senha'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
