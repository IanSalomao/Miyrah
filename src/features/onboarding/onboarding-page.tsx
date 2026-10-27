// Cadastro, Etapa 2 (/onboarding): perfil da igreja (denominação, telefone,
// CNPJ). A conta já existe — todos os campos são opcionais e o usuário pode
// pular; em ambos os casos segue para o dashboard, onde vê o popup do trial.
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import miyrahLogo from '@/assets/miyrah_logo_blue.svg'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ApiError } from '@/lib/api-client'
import { maskCnpj, maskPhone } from '@/lib/format'
import { useUpdateProfile } from './hooks/use-update-profile'
import {
  onboardingProfileSchema,
  toUpdateAccountPayload,
  type OnboardingProfileFormValues,
} from './schemas'

const ONBOARDING_FIELDS = ['denomination', 'phone', 'cnpj'] as const
type OnboardingApiField = (typeof ONBOARDING_FIELDS)[number]

function isOnboardingApiField(field: string): field is OnboardingApiField {
  return (ONBOARDING_FIELDS as readonly string[]).includes(field)
}

export function OnboardingProfilePage() {
  const navigate = useNavigate()
  const updateProfile = useUpdateProfile()
  const [genericError, setGenericError] = useState<string | null>(null)

  const form = useForm<OnboardingProfileFormValues>({
    resolver: zodResolver(onboardingProfileSchema),
    defaultValues: { denomination: '', phone: '', cnpj: '' },
  })

  function goToDashboard() {
    navigate('/dashboard', { replace: true })
  }

  async function onSubmit(values: OnboardingProfileFormValues) {
    setGenericError(null)
    try {
      await updateProfile.mutateAsync(toUpdateAccountPayload(values))
      goToDashboard()
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'VALIDATION_ERROR' && error.details) {
          for (const detail of error.details) {
            if (isOnboardingApiField(detail.field)) {
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

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <div className="mb-6 flex flex-col gap-3">
          <img src={miyrahLogo} alt="Miyrah" className="h-9 w-auto" />
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl leading-tight font-semibold tracking-tight text-foreground">
              Complete o perfil da sua igreja
            </h1>
            <p className="text-sm text-muted-foreground">
              Esses dados são opcionais — você pode preencher agora ou depois em Configurações.
            </p>
          </div>
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
              name="denomination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Denominação</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Batista, Assembleia de Deus" {...field} />
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
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      {...field}
                      onChange={(event) => field.onChange(maskPhone(event.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="text"
                      placeholder="00.000.000/0000-00"
                      {...field}
                      onChange={(event) => field.onChange(maskCnpj(event.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Usado em recibos e relatórios da igreja.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-2 flex flex-col gap-2">
              <Button type="submit" size="lg" className="w-full" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Salvando...' : 'Concluir'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="w-full"
                onClick={goToDashboard}
                disabled={updateProfile.isPending}
              >
                Pular por agora
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
