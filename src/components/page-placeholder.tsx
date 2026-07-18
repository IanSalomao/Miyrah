// Stub temporário de página — substituído pela tela real em cada fase.
export function PagePlaceholder({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">
        {description ?? 'Tela em construção.'}
      </p>
    </div>
  )
}
