// import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // TEMPORALMENTE DESHABILITADO - Para habilitar, descomenta:
  // const supabase = createClient()

  // await supabase.auth.signOut()

  // Mock signout - solo redirect
  console.log("SignOut simulado")

  return NextResponse.redirect(new URL("/", request.url), {
    status: 302,
  })
}
