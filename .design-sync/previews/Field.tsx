import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  Input,
  Textarea,
  Checkbox,
} from 'miyrah'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
  maxWidth: 380,
}

// Campo completo: label + input + descrição de apoio.
export function WithDescription() {
  return (
    <div style={wrap}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="f-amount">Valor</FieldLabel>
          <Input id="f-amount" placeholder="0,00" />
          <FieldDescription>
            Informe o valor positivo; o tipo define entrada ou saída.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="f-notes">Observações</FieldLabel>
          <Textarea id="f-notes" placeholder="Detalhes do lançamento (opcional)" />
        </Field>
      </FieldGroup>
    </div>
  )
}

// Campo em estado de erro de validação.
export function WithError() {
  return (
    <div style={wrap}>
      <Field data-invalid="true">
        <FieldLabel htmlFor="f-email">E-mail</FieldLabel>
        <Input id="f-email" aria-invalid defaultValue="joao.igreja.com" />
        <FieldError errors={[{ message: 'Informe um e-mail válido.' }]} />
      </Field>
    </div>
  )
}

// Campo horizontal com checkbox (orientação alternativa).
export function Horizontal() {
  return (
    <div style={wrap}>
      <Field orientation="horizontal">
        <Checkbox id="f-active" defaultChecked />
        <FieldLabel htmlFor="f-active">Membro ativo</FieldLabel>
      </Field>
    </div>
  )
}
