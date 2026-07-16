// wiki/components/component_tabs.md — variante "Filtro": cada aba refiltra os mesmos
// dados da página (ex.: page_categories, abas Todas/Entradas/Saídas via parâmetro `type`).
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs/tabs'

export interface FilterTabOption<TValue extends string> {
  value: TValue
  label: string
}

interface FilterTabsProps<TValue extends string> {
  options: FilterTabOption<TValue>[]
  value: TValue
  onValueChange: (value: TValue) => void
  className?: string
}

/** Navegação em abas horizontais que refiltra a listagem abaixo (não troca de sub-seção). */
export function FilterTabs<TValue extends string>({
  options,
  value,
  onValueChange,
  className,
}: FilterTabsProps<TValue>) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as TValue)}
      className={className}
    >
      <TabsList>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
