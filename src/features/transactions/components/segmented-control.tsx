// Segmented control genérico usado no campo "Tipo" do formulário de transação
// (component_modal_form) — apenas Entrada/Saída, sem a opção "Todas" do
// component_filter_bar/type-filter (que é específica de listagens filtradas).

import { cn } from '@/lib/utils'

interface SegmentedControlOption<TValue extends string> {
  value: TValue
  label: string
}

interface SegmentedControlProps<TValue extends string> {
  value: TValue
  onChange: (value: TValue) => void
  options: SegmentedControlOption<TValue>[]
  'aria-label'?: string
}

export function SegmentedControl<TValue extends string>({
  value,
  onChange,
  options,
  'aria-label': ariaLabel,
}: SegmentedControlProps<TValue>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex items-center gap-0.5 rounded-md border border-border p-0.5"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-sm px-2.5 py-1 text-sm transition-colors',
            value === option.value
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-muted',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
