// wiki/pages/page_forgot_password.md — Passo 1 (informar e-mail) e Passo 2 (e-mail enviado)
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ApiError } from '@/lib/api-client'
import { useForgotPassword } from './hooks/use-forgot-password'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from './schemas'

type Step = 'form' | 'sent'

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('form')
  const [genericError, setGenericError] = useState<string | null>(null)
  const forgotPasswordMutation = useForgotPassword()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    setGenericError(null)
    try {
      await forgotPasswordMutation.mutateAsync(values)
      // Resposta sempre genérica (anti-enumeração): avança independentemente de o e-mail existir.
      setStep('sent')
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'VALIDATION_ERROR' && error.details) {
          for (const detail of error.details) {
            if (detail.field === 'email') {
              form.setError('email', { message: detail.message })
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

  if (step === 'sent') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <MailCheck className="size-10 text-primary" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight">E-mail enviado</h1>
          <p className="text-sm text-muted-foreground">
            Se o e-mail informado existir em nossa base, enviaremos um link de recuperação. Confira
            sua caixa de entrada.
          </p>
        </div>
        <Link to="/login" className="text-sm text-primary underline-offset-4 hover:underline">
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Recuperar senha</h1>
        <p className="text-sm text-muted-foreground">
          Informe seu e-mail para receber o link de recuperação.
        </p>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
            {forgotPasswordMutation.isPending ? 'Enviando...' : 'Enviar link de recuperação'}
          </Button>
        </form>
      </Form>

      <div className="flex justify-center text-sm">
        <Link to="/login" className="text-primary underline-offset-4 hover:underline">
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}
