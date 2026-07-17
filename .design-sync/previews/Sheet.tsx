import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'miyrah'
import { Plus } from 'lucide-react'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
  minHeight: 560,
  position: 'relative',
}

const fieldGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 20,
}

const field: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

// Drawer lateral de criação de transação (não-modal, tela principal utilizável).
export function NewTransaction() {
  return (
    <div style={wrap}>
      <Sheet defaultOpen modal={false}>
        <SheetContent overlay={false}>
          <SheetHeader>
            <SheetTitle>Nova transação</SheetTitle>
            <SheetDescription>
              Registre uma entrada ou saída para a Igreja Batista Central.
            </SheetDescription>
          </SheetHeader>
          <div style={fieldGroup}>
            <div style={field}>
              <Label htmlFor="descr">Descrição</Label>
              <Input id="descr" defaultValue="Dízimo — culto de domingo" />
            </div>
            <div style={field}>
              <Label htmlFor="value">Valor</Label>
              <Input id="value" defaultValue="R$ 350,00" style={{ fontFamily: 'var(--font-mono)' }} />
            </div>
            <div style={field}>
              <Label>Categoria</Label>
              <Select defaultValue="tithe">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tithe">Dízimos</SelectItem>
                  <SelectItem value="offering">Ofertas</SelectItem>
                  <SelectItem value="donation">Doações</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
            <Button>Salvar transação</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Estado fechado: botão que abre o drawer de cadastro.
export function Trigger() {
  return (
    <div style={{ ...wrap, minHeight: 200 }}>
      <Sheet>
        <Button>
          <Plus />
          Novo membro
        </Button>
      </Sheet>
    </div>
  )
}

// Drawer de edição de membro com dados preenchidos.
export function EditMember() {
  return (
    <div style={wrap}>
      <Sheet defaultOpen modal={false}>
        <SheetContent overlay={false}>
          <SheetHeader>
            <SheetTitle>Editar membro</SheetTitle>
            <SheetDescription>Atualize os dados de contato do membro.</SheetDescription>
          </SheetHeader>
          <div style={fieldGroup}>
            <div style={field}>
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" defaultValue="Ana Beatriz Ferreira" />
            </div>
            <div style={field}>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" defaultValue="ana.ferreira@email.com" />
            </div>
            <div style={field}>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" defaultValue="(11) 98765-4321" style={{ fontFamily: 'var(--font-mono)' }} />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
            <Button>Salvar alterações</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
