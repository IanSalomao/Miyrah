// Aba "Segurança" — alterar senha + zona de perigo. wiki/pages/page_settings.md.
import { useState } from 'react'
import { ChangePasswordCard } from './change-password-card'
import { DangerZoneCard } from './danger-zone-card'
import { DeleteAccountModal } from './delete-account-modal'

export function SecurityTab() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <ChangePasswordCard />
      <DangerZoneCard onDelete={() => setDeleteModalOpen(true)} />
      <DeleteAccountModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} />
    </div>
  )
}
