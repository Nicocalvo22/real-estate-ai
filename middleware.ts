import type { NextRequest } from "next/server"
// import { updateSession } from "@/utils/supabase/middleware"

// TEMPORALMENTE DESHABILITADO - Para habilitar autenticación, descomenta las líneas:
export async function middleware(request: NextRequest) {
  // return await updateSession(request)

  // Por ahora permite acceso directo sin autenticación
  return
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
