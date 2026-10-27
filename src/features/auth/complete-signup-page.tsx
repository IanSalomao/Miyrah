// Cadastro, Etapa 1 (/register/complete): o link de verificação abre esta tela.
// Valida o token, coleta nome + senha e CRIA a conta (a igreja passa a existir
// aqui). Em sucesso, faz login automático e segue para a Etapa 2 (/onboarding).
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, TriangleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/app/auth-context'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useCompleteSignup } from './hooks/use-complete-signup'
import { useVerifySignupToken } from './hooks/use-verify-signup-token'
import { completeSignupSchema, type CompleteSignupFormValues } from './schemas'

const COMPLETE_FIELDS = ['name', 'password'] as const
type CompleteApiField = (typeof COMPLETE_FIELDS)[number]

function isCompleteApiField(field: string): field is CompleteApiField {
  return (COMPLETE_FIELDS as readonly string[]).includes(field)
}

function InvalidToken() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <TriangleAlert className="size-10 text-destructive" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Link inválido ou expirado
        </h1>
        <p className="text-sm text-muted-foreground">
          Este link de verificação expirou ou já foi utilizado. Solicite um novo para continuar o
          cadastro.
        </p>
      </div>
      <Button asChild size="lg" className="w-full">
        <Link to="/register">Solicitar novo link</Link>
      </Button>
    </div>
  )
}

export function CompleteSignupPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const { login: setSession } = useAuth()
  const tokenQuery = useVerifySignupToken(token)
  const completeMutation = useCompleteSignup()
  const [genericError, setGenericError] = useState<string | null>(null)
  const [tokenInvalid, setTokenInvalid] = useState(false)

  const form = useForm<CompleteSignupFormValues>({
    resolver: zodResolver(completeSignupSchema),
    defaultValues: { name: '', password: '', confirmPassword: '', acceptTerms: false },
  })

  async function onSubmit(values: CompleteSignupFormValues) {
    if (!token) {
      setTokenInvalid(true)
      return
    }
    setGenericError(null)
    try {
      const response = await completeMutation.mutateAsync({
        token,
        name: values.name,
        password: values.password,
      })
      // Conta criada: login automático (sessão padrão, sem "lembrar-me") e
      // segue para a Etapa 2 (perfil).
      setSession(response.token, false)
      navigate('/onboarding', { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'INVALID_OR_EXPIRED_TOKEN') {
          setTokenInvalid(true)
          return
        }
        if (error.code === 'EMAIL_ALREADY_IN_USE') {
          setGenericError('Este e-mail já tem uma conta. Faça login para continuar.')
          return
        }
        if (error.code === 'VALIDATION_ERROR' && error.details) {
          for (const detail of error.details) {
            if (isCompleteApiField(detail.field)) {
              form.setError(detail.field, { message: detail.message })
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

  // Token ausente, inválido (query falhou) ou recusado na finalização.
  if (!token || tokenInvalid || tokenQuery.isError) {
    return <InvalidToken />
  }

  if (tokenQuery.isPending) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Verificando o link...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Falta pouco para criar sua conta.
        </h1>
        <p className="text-base text-muted-foreground">
          Defina um nome e uma senha para{' '}
          <span className="font-medium text-foreground">{tokenQuery.data.email}</span>.
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Igreja</FormLabel>
                <FormControl>
                  <Input autoComplete="organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                </FormControl>
                <div className="flex flex-col gap-1">
                  <FormLabel className="font-normal">
                    Li e aceito os termos de uso e a política de privacidade.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" size="lg" className="w-full" disabled={completeMutation.isPending}>
            {completeMutation.isPending ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
