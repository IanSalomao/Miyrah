import * as React from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
} from 'miyrah'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
  maxWidth: 400,
}

interface CategoryValues {
  name: string
  type: string
}

// Formulário de categoria: nome (Input) + tipo (Select), com descrição de ajuda.
export function CategoryForm() {
  const form = useForm<CategoryValues>({
    defaultValues: { name: 'Dízimos', type: 'income' },
  })

  return (
    <div style={wrap}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {})}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Ex.: Dízimos" {...field} />
                </FormControl>
                <FormDescription>Aparece na lista de categorias e nos filtros.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">Entrada</SelectItem>
                    <SelectItem value="expense">Saída</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Salvar categoria</Button>
        </form>
      </Form>
    </div>
  )
}

// Estado de erro de validação: campo obrigatório destacado com mensagem em pt-BR.
export function WithValidationError() {
  const form = useForm<CategoryValues>({
    defaultValues: { name: '', type: 'expense' },
  })

  React.useEffect(() => {
    form.setError('name', { type: 'required', message: 'Informe o nome da categoria.' })
  }, [form])

  return (
    <div style={wrap}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {})}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Ex.: Aluguel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Salvar categoria</Button>
        </form>
      </Form>
    </div>
  )
}
