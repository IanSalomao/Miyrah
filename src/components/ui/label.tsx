import * as React from 'react'
import { Label as LabelPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  /** Marca o campo como obrigatório: "*" em cor de erro, após o rótulo. */
  required?: boolean
  /** Marca o campo como opcional: sufixo discreto "· opcional". */
  optional?: boolean
}

function Label({ className, required, optional, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-required={required || undefined}
      data-optional={(optional && !required) || undefined}
      className={cn(
        'flex items-center gap-1.5 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        // Marcadores via ::after (não entram no textContent do label, então não
        // alteram o nome acessível do campo nem quebram queries por label).
        required && "after:text-destructive after:content-['*']",
        optional &&
          !required &&
          "after:font-normal after:text-muted-foreground after:content-['·_opcional']",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
