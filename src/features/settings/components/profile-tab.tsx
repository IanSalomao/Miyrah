// Aba "Perfil" — dados da igreja. wiki/pages/page_settings.md, wiki/api/account.md.
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Check } from 'lucide-react'
import { useAccount } from '@/components/side-bar/hooks/use-account'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/lib/api-client'
import { maskCnpj, maskPhone } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useUpdateAccount } from '../hooks/use-account-mutations'
import { profileFormSchema, toUpdateAccountPayload, type ProfileFormValues } from '../schemas'

const FIELD_NAMES = new Set<keyof ProfileFormValues>([
  'name',
  'email',
  'phone',
  'cnpj',
  'denomination',
])

const EMPTY_VALUES: ProfileFormValues = {
  name: '',
  email: '',
  phone: '',
  cnpj: '',
  denomination: '',
}

export function ProfileTab() {
  const { data: account, isLoading } = useAccount()
  const updateAccount = useUpdateAccount()
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: EMPTY_VALUES,
  })

  // Preenche o formulário quando o perfil carrega (GET /v1/account).
  useEffect(() => {
    if (!account) return
    reset({
      name: account.name,
      email: account.email,
      phone: account.phone ? maskPhone(account.phone) : '',
      cnpj: account.cnpj ? maskCnpj(account.cnpj) : '',
      denomination: account.denomination ?? '',
    })
  }, [account, reset])

  const phoneField = register('phone')
  const cnpjField = register('cnpj')

  function onSubmit(values: ProfileFormValues) {
    setSaved(false)
    updateAccount.mutate(toUpdateAccountPayload(values), {
      onSuccess: () => setSaved(true),
      onError: (error) => {
        if (!(error instanceof ApiError)) return
        if (error.code === 'EMAIL_ALREADY_IN_USE') {
          setError('email', { message: error.message })
          return
        }
        if (error.details) {
          for (const detail of error.details) {
            if (FIELD_NAMES.has(detail.field as keyof ProfileFormValues)) {
              setError(detail.field as keyof ProfileFormValues, { message: detail.message })
            }
          }
        }
      },
    })
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-1 p-6 pb-0">
        <h2 className="text-lg font-semibold">Dados da igreja</h2>
        <p className="text-sm text-muted-foreground">
          Informações de contato e cadastro exibidas no sistema.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={cn('flex flex-col gap-2', i === 0 && 'sm:col-span-2')}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="settings-name">Nome da Igreja</Label>
              <Input
                id="settings-name"
                autoComplete="organization"
                aria-invalid={Boolean(errors.name)}
                {...register('name')}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="settings-email">Email</Label>
              <Input
                id="settings-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="settings-phone">Telefone</Label>
              <Input
                id="settings-phone"
                type="tel"
                aria-invalid={Boolean(errors.phone)}
                {...phoneField}
                onChange={(event) => {
                  event.target.value = maskPhone(event.target.value)
                  phoneField.onChange(event)
                }}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="settings-cnpj">
                CNPJ <span className="font-normal text-muted-foreground">· opcional</span>
              </Label>
              <Input
                id="settings-cnpj"
                aria-invalid={Boolean(errors.cnpj)}
                {...cnpjField}
                onChange={(event) => {
                  event.target.value = maskCnpj(event.target.value)
                  cnpjField.onChange(event)
                }}
              />
              {errors.cnpj ? (
                <p className="text-sm text-destructive">{errors.cnpj.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Usado em recibos e relatórios oficiais.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="settings-denomination">
                Denominação <span className="font-normal text-muted-foreground">· opcional</span>
              </Label>
              <Input
                id="settings-denomination"
                placeholder="Ex.: Batista, Assembleia de Deus…"
                {...register('denomination')}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border p-6">
            <p className="flex items-center gap-1.5 text-sm font-medium text-income">
              {saved && (
                <>
                  <Check className="size-4" />
                  Alterações salvas
                </>
              )}
            </p>
            <Button type="submit" disabled={updateAccount.isPending}>
              {updateAccount.isPending ? 'Salvando…' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
