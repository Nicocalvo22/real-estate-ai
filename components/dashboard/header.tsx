import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export async function Header() {
  // TEMPORALMENTE DESHABILITADO - Para habilitar, descomenta:
  // const supabase = createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Mock data para desarrollo
  const user = { email: "demo@example.com" }
  const profile = { full_name: "Usuario Demo", subscription_tier: "basic" }

  return (
    <header className="flex h-16 items-center px-4 border-b">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{profile?.full_name || user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Account Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/subscription">Subscription: {profile?.subscription_tier || "Free"}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action="/auth/signout" method="post">
                <button type="submit" className="w-full text-left">
                  Sign Out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
