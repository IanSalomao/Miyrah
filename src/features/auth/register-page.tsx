// wiki/pages/page_register.md
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/auth-context'
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
import { useRegister } from './hooks/use-register'
import { registerSchema, type RegisterFormValues } from './schemas'

const REGISTER_FIELDS = ['name', 'email', 'phone', 'password'] as const
type RegisterApiField = (typeof REGISTER_FIELDS)[number]

function isRegisterApiField(field: string): field is RegisterApiField {
  return (REGISTER_FIELDS as readonly string[]).includes(field)
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { login: setSession } = useAuth()
  const registerMutation = useRegister()
  const [genericError, setGenericError] = useState<string | null>(null)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  async function onSubmit(values: RegisterFormValues) {
    setGenericError(null)
    try {
      const response = await registerMutation.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone ? values.phone : undefined,
        password: values.password,
      })
      // Sem checkbox "Lembrar-me" no cadastro: sessão padrão (sessionStorage, 24h).
      setSession(response.token, false)
      navigate('/', { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'VALIDATION_ERROR' && error.details) {
          for (const detail of error.details) {
            if (isRegisterApiField(detail.field)) {
              form.setError(detail.field, { message: detail.message })
            }
          }
          return
        }
        if (error.code === 'EMAIL_ALREADY_IN_USE') {
          form.setError('email', { message: error.message })
          return
        }
        setGenericError(error.message)
        return
      }
      setGenericError('Ocorreu um erro inesperado. Tente novamente.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Criar conta</h1>
        <p className="text-sm text-muted-foreground">Cadastre a conta da sua igreja.</p>
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone (opcional)</FormLabel>
                <FormControl>
                  <Input type="tel" autoComplete="tel" {...field} />
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
                  <Input type="password" autoComplete="new-password" {...field} />
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
                  <Input type="password" autoComplete="new-password" {...field} />
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

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Criando conta...' : 'Criar conta'}
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
