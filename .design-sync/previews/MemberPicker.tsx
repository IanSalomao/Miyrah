import { MemberPicker } from 'miyrah'

const wrap: React.CSSProperties = {
  width: 360,
  minHeight: 96,
  padding: 24,
  background: 'var(--background)',
}

const noop = () => {}

// Estado com membro selecionado — o trigger mostra avatar (iniciais) + nome,
// sem depender da busca na API (usa `value`/`label`).
export function Selected() {
  return (
    <div style={wrap}>
      <MemberPicker value="m1" label="Ana Beatriz Ferreira" onSelect={noop} />
    </div>
  )
}

// Estado vazio: placeholder "Selecionar responsável".
export function Placeholder() {
  return (
    <div style={wrap}>
      <MemberPicker value={null} label={null} onSelect={noop} />
    </div>
  )
}

// Desabilitado (ex.: formulário em carregamento).
export function Disabled() {
  return (
    <div style={wrap}>
      <MemberPicker value="m2" label="Carlos Henrique Souza" onSelect={noop} disabled />
    </div>
  )
}
