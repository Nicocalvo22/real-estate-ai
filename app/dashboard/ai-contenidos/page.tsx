"use client"

import { ContentCreatorChat } from "@/components/ai-contenidos/content-creator-chat"

export default function AIContenidosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Contenidos</h1>
        <p className="text-muted-foreground">
          Asistente de creación de contenidos. Genera ideas, escribe textos, optimiza contenido y analiza datos CSV.
        </p>
      </div>

      <div className="grid gap-4">
        <ContentCreatorChat />
      </div>
    </div>
  )
}