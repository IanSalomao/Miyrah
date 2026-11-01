// Campo de valor monetário no estilo dos apps de banco: começa em "0,00" e, a
// cada dígito, o número cresce da direita para a esquerda mantendo sempre duas
// casas decimais. O "R$" é um adorno fixo à esquerda (fora do <input>); o texto
// fica em JetBrains Mono, alinhado à direita (design_system.md — valor).
import * as React from 'react'

import { Input } from '@/components/ui/input'
import { formatAmountInput, parseAmountInput } from '@/lib/format'
import { cn } from '@/lib/utils'

interface CurrencyInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type' | 'inputMode'> {
  /** Valor em reais. */
  value: number
  /** Recebe o novo valor em reais a cada dígito. */
  onChange: (value: number) => void
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      onChange(parseAmountInput(event.target.value))
    }

    return (
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center font-mono text-sm text-muted-foreground"
        >
          R$
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={formatAmountInput(value)}
          onChange={handleChange}
          placeholder="0,00"
          className={cn('pl-8 text-right font-mono', className)}
          {...props}
        />
      </div>
    )
  },
)
CurrencyInput.displayName = 'CurrencyInput'

export { CurrencyInput }
