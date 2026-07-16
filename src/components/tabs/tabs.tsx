// Abas horizontais — variante "Filtro" (refiltra os mesmos dados, ex.: page_categories)
// ou "Navegação" (troca todo o conteúdo abaixo, ex.: page_settings). A diferença entre
// variantes é de uso pela feature consumidora — a API deste componente é a mesma.
// Ver wiki/components/component_tabs.md.
import type { ComponentProps } from 'react'
import {
  Tabs as TabsRoot,
  TabsContent as TabsContentPrimitive,
  TabsList as TabsListPrimitive,
  TabsTrigger as TabsTriggerPrimitive,
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export const Tabs = TabsRoot

export function TabsList({ className, ...props }: ComponentProps<typeof TabsListPrimitive>) {
  return (
    <TabsListPrimitive
      variant="line"
      className={cn('h-auto w-full justify-start gap-4 border-b border-border p-0', className)}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsTriggerPrimitive>) {
  return (
    <TabsTriggerPrimitive
      className={cn(
        'h-auto flex-none rounded-md border-none px-2 py-2 text-foreground/70 shadow-none transition-colors',
        'hover:bg-accent hover:text-foreground',
        'after:bg-primary',
        'data-active:bg-transparent data-active:text-primary data-active:shadow-none',
        'dark:data-active:bg-transparent',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsContentPrimitive>) {
  return <TabsContentPrimitive className={cn('pt-4', className)} {...props} />
}
