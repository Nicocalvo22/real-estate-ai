"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
// import { createClient } from "@/utils/supabase/client"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface SavePropertyButtonProps {
  propertyId: string
  isSaved: boolean
}

export function SavePropertyButton({ propertyId, isSaved }: SavePropertyButtonProps) {
  const [saved, setSaved] = useState(isSaved)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  // TEMPORALMENTE DESHABILITADO:
  // const supabase = createClient()

  const handleSaveProperty = async () => {
    setLoading(true)

    try {
      // TEMPORALMENTE DESHABILITADO - Para habilitar, descomenta:
      // const {
      //   data: { user },
      // } = await supabase.auth.getUser()

      // if (!user) {
      //   router.push("/login")
      //   return
      // }

      // if (saved) {
      //   // Remove from saved properties
      //   await supabase.from("user_saved_listings").delete().eq("user_id", user.id).eq("listing_id", propertyId)

      //   setSaved(false)
      // } else {
      //   // Add to saved properties
      //   await supabase.from("user_saved_listings").insert({
      //     user_id: user.id,
      //     listing_id: propertyId,
      //   })

      //   setSaved(true)
      // }

      // router.refresh()

      // Mock functionality para desarrollo
      setSaved(!saved)
      console.log(`Propiedad ${propertyId} ${saved ? 'removida de' : 'guardada en'} favoritos`)
    } catch (error) {
      console.error("Error saving property:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={saved ? "default" : "outline"}
      size="icon"
      onClick={handleSaveProperty}
      disabled={loading}
      className={saved ? "bg-red-500 hover:bg-red-600" : ""}
    >
      <Heart className={`h-5 w-5 ${saved ? "fill-white" : ""}`} />
      <span className="sr-only">{saved ? "Unsave" : "Save"} property</span>
    </Button>
  )
}
