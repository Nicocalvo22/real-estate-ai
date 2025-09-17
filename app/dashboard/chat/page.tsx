import { PropertyFinderChat } from "@/components/chat/property-finder-chat"

export default function PropertyFinderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Findy AI</h1>
        <p className="text-muted-foreground">
          Encuentra exactamente 10 propiedades que coincidan con tus criterios específicos en Córdoba, Argentina
        </p>
      </div>

      <div className="grid gap-4">
        <PropertyFinderChat />
      </div>
    </div>
  )
}