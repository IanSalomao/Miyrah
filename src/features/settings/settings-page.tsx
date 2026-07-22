// page_settings (Configurações do usuário) — wiki/pages/page_settings.md.
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs/tabs'
import { ProfileTab } from './components/profile-tab'
import { SecurityTab } from './components/security-tab'

export function SettingsPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os dados da igreja e a segurança da sua conta.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
