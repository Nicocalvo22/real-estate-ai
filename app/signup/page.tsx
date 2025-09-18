import SignUpForm from "@/components/auth/signup-form"
// import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Building } from "lucide-react"

export default async function SignUpPage() {
  // TEMPORALMENTE DESHABILITADO - Para habilitar, descomenta:
  // const supabase = createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (user) {
  //   redirect("/dashboard")
  // }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-16 items-center px-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Building className="h-6 w-6" />
          <span>RealEstate AI</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center py-12">
        <SignUpForm />
      </div>
    </div>
  )
}
