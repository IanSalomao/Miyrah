// wiki/pages/page_login.md
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
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
import { useLogin } from './hooks/use-login'
import { loginSchema, type LoginFormValues } from './schemas'

export function LoginPage() {
  const navigate = useNavigate()
  const { login: setSession } = useAuth()
  const loginMutation = useLogin()
  const [genericError, setGenericError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  async function onSubmit(values: LoginFormValues) {
    setGenericError(null)
    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      })
      setSession(response.token, values.rememberMe)
      navigate('/', { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'VALIDATION_ERROR' && error.details) {
          for (const detail of error.details) {
            if (detail.field === 'email' || detail.field === 'password') {
              form.setError(detail.field, { message: detail.message })
            }
          }
          return
        }
        // 401 INVALID_CREDENTIALS: mensagem genérica, sem indicar qual campo está errado.
        setGenericError(error.message)
        return
      }
      setGenericError('Ocorreu um erro inesperado. Tente novamente.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">
          Bem-vindo ao melhor lugar{' '}
          <span className="font-normal">para cuidar das finanças da sua igreja.</span>
        </h1>
        <p className="text-base text-muted-foreground">Faça login na sua conta para continuar.</p>
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                </FormControl>
                <FormLabel className="font-normal">Lembrar-me</FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" size="lg" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col items-center gap-2 text-sm">
        <Link to="/forgot-password" className="text-primary underline-offset-4 hover:underline">
          Esqueci minha senha
        </Link>
        <p className="text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary underline-offset-4 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
