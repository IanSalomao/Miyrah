// Checklist de requisitos de senha — comunica as regras ANTES do submit e
// marca cada uma como atendida ao vivo conforme o usuário digita.
// Consome a lista única de regras de @/lib/password.
import { Check, X } from 'lucide-react'

import { passwordRules } from '@/lib/password'
import { cn } from '@/lib/utils'

interface PasswordRequirementsProps {
  value: string
  className?: string
}

export function PasswordRequirements({ value, className }: PasswordRequirementsProps) {
  return (
    <ul className={cn('flex flex-col gap-1', className)} aria-label="Requisitos da senha">
      {passwordRules.map((rule) => {
        const met = rule.test(value)
        return (
          <li
            key={rule.id}
            className={cn(
              'flex items-center gap-1.5 text-xs transition-colors',
              met ? 'text-income' : 'text-muted-foreground',
            )}
          >
            {met ? (
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <X className="size-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>{rule.label}</span>
            <span className="sr-only">{met ? ' (atendido)' : ' (não atendido)'}</span>
          </li>
        )
      })}
    </ul>
  )
}
