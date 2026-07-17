import {
  FormDrawer,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'miyrah'
import type { FormEvent } from 'react'

const wrap: React.CSSProperties = {
  position: 'relative',
  width: 560,
  minHeight: 640,
  padding: 24,
  background: 'var(--background)',
}

const noop = () => {}
const onSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault()

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

// Drawer lateral de criação de transação (campos + Cancelar/Salvar).
export function NewTransaction() {
  return (
    <div style={wrap}>
      <FormDrawer
        open
        onOpenChange={noop}
        onSubmit={onSubmit}
        title="Nova transação"
        description="Registre uma entrada ou saída da igreja."
        submitLabel="Salvar transação"
      >
        <Field label="Descrição">
          <Input defaultValue="Dízimo do culto de domingo" />
        </Field>
        <Field label="Valor">
          <Input className="text-right font-mono" defaultValue="350,00" inputMode="decimal" />
        </Field>
        <Field label="Tipo">
          <Select defaultValue="income">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Entrada</SelectItem>
              <SelectItem value="expense">Saída</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Categoria">
          <Select defaultValue="tithe">
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tithe">Dízimos</SelectItem>
              <SelectItem value="offering">Ofertas</SelectItem>
              <SelectItem value="donation">Doações</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Data">
          <Input type="date" defaultValue="2026-07-12" />
        </Field>
      </FormDrawer>
    </div>
  )
}

// Estado de edição em carregamento (campos bloqueados, botão "Salvando…").
export function Saving() {
  return (
    <div style={wrap}>
      <FormDrawer
        open
        loading
        onOpenChange={noop}
        onSubmit={onSubmit}
        title="Editar transação"
        description="Altere os dados do lançamento."
      >
        <Field label="Descrição">
          <Input defaultValue="Oferta especial de missões" />
        </Field>
        <Field label="Valor">
          <Input className="text-right font-mono" defaultValue="1.200,00" inputMode="decimal" />
        </Field>
      </FormDrawer>
    </div>
  )
}
