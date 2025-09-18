// import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building } from "lucide-react"
import Link from "next/link"

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: { token_hash?: string; type?: string }
}) {
  // TEMPORALMENTE DESHABILITADO - Para habilitar, descomenta:
  // const supabase = createClient()

  // const { token_hash, type } = searchParams

  // if (token_hash && type) {
  //   const { error } = await supabase.auth.verifyOtp({
  //     token_hash,
  //     type: type as any,
  //   })

  //   if (!error) {
  //     redirect("/dashboard")
  //   }
  // }

  // Mock functionality - redirect to dashboard
  const { token_hash, type } = searchParams
  if (token_hash && type) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-16 items-center px-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Building className="h-6 w-6" />
          <span>RealEstate AI</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Email Confirmation</CardTitle>
            <CardDescription>There was a problem confirming your email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The confirmation link is invalid or has expired. Please try signing in again and a new confirmation link
              will be sent to your email.
            </p>
            <Link href="/login" className="block text-center text-sm underline">
              Back to sign in
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
