// Cadastro, Etapa 0: a tela pede só o e-mail e envia um link de verificação.
// Depois do envio, mostra uma tela de retry com contador (cooldown) para o
// usuário reenviar caso não receba. A conta só passa a existir na Etapa 1
// (/register/complete), após o link.
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock, MailCheck } from 'lucide-react'
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
import { useRequestVerification } from './hooks/use-request-verification'
import { requestVerificationSchema, type RequestVerificationFormValues } from './schemas'

type Step = 'form' | 'sent'

// mm:ss a partir de segundos.
function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function RegisterPage() {
  const [step, setStep] = useState<Step>('form')
  const [sentEmail, setSentEmail] = useState('')
  const [genericError, setGenericError] = useState<string | null>(null)
  // Segundos restantes até o reenvio ser liberado; 0 = pode reenviar.
  const [secondsLeft, setSecondsLeft] = useState(0)
  const requestMutation = useRequestVerification()

  // Contador regressivo: um setTimeout por segundo enquanto houver cooldown.
  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft])

  const form = useForm<RequestVerificationFormValues>({
    resolver: zodResolver(requestVerificationSchema),
    defaultValues: { email: '' },
  })

  // Envia (ou reenvia) o link e arma o cooldown a partir do retryAfterSeconds.
  async function sendVerification(email: string): Promise<boolean> {
    setGenericError(null)
    try {
      const response = await requestMutation.mutateAsync({ email })
      setSecondsLeft(response.retryAfterSeconds)
      return true
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'VALIDATION_ERROR' && error.details) {
          for (const detail of error.details) {
            if (detail.field === 'email') {
              form.setError('email', { message: detail.message })
            }
          }
          return false
        }
        if (error.code === 'TOO_MANY_REQUESTS') {
          setGenericError('Muitas tentativas. Aguarde um instante e tente novamente.')
          return false
        }
        setGenericError(error.message)
        return false
      }
      setGenericError('Ocorreu um erro inesperado. Tente novamente.')
      return false
    }
  }

  async function onSubmit(values: RequestVerificationFormValues) {
    // Resposta sempre genérica (anti-enumeração): avança independentemente de
    // o e-mail já existir ou não.
    const ok = await sendVerification(values.email)
    if (ok) {
      setSentEmail(values.email)
      setStep('sent')
    }
  }

  function changeEmail() {
    setStep('form')
    setSecondsLeft(0)
    setGenericError(null)
    form.reset({ email: sentEmail })
  }

  if (step === 'sent') {
    const waiting = secondsLeft > 0
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <MailCheck className="size-10 text-primary" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">
            Verifique seu e-mail
          </h1>
          <p className="text-sm text-muted-foreground">
            Se o e-mail estiver disponível, enviamos um link de verificação para{' '}
            <span className="font-medium text-foreground">{sentEmail}</span>. Abra o link para
            continuar o cadastro.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
          <p className="text-sm text-muted-foreground">Não recebeu o e-mail?</p>

          {genericError && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {genericError}
            </p>
          )}

          {waiting ? (
            <div
              className="flex items-center gap-2 text-sm font-medium text-foreground"
              aria-live="polite"
            >
              <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
              <span>
                Reenviar em{' '}
                <span className="font-mono tabular-nums">{formatCountdown(secondsLeft)}</span>
              </span>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={requestMutation.isPending}
              onClick={() => void sendVerification(sentEmail)}
            >
              {requestMutation.isPending ? 'Enviando...' : 'Reenviar e-mail'}
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 text-sm">
          <button
            type="button"
            onClick={changeEmail}
            className="text-primary underline-offset-4 hover:underline"
          >
            Usar outro e-mail
          </button>
          <Link to="/login" className="text-muted-foreground underline-offset-4 hover:underline">
            Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Crie sua conta e organize as finanças da sua igreja.
        </h1>
        <p className="text-base text-muted-foreground">
          Informe seu e-mail e enviaremos um link para continuar o cadastro.
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

          <Button type="submit" size="lg" className="w-full" disabled={requestMutation.isPending}>
            {requestMutation.isPending ? 'Enviando...' : 'Enviar link de verificação'}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col items-center gap-2 text-sm">
        <p className="text-muted-foreground">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary underline-offset-4 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
