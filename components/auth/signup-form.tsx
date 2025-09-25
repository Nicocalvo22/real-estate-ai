"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
// import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  // TEMPORALMENTE DESHABILITADO:
  // const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      // TEMPORALMENTE DESHABILITADO - Para habilitar, descomenta:
      // const { error: signUpError, data } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: {
      //       full_name: fullName,
      //     },
      //   },
      // })

      // if (signUpError) {
      //   setError(signUpError.message)
      //   return
      // }

      // // Create profile entry
      // if (data?.user) {
      //   const { error: profileError } = await supabase.from("profiles").insert({
      //     id: data.user.id,
      //     full_name: fullName,
      //     subscription_tier: "free",
      //     subscription_status: "active",
      //   })

      //   if (profileError) {
      //     console.error("Error creating profile:", profileError)
      //   }
      // }

      // Mock signup para desarrollo
      if (fullName && email && password.length >= 8) {
        console.log('Registro simulado exitoso:', { fullName, email })
        setMessage("¡Cuenta creada exitosamente! Puedes iniciar sesión.")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError("Por favor completa todos los campos y usa una contraseña de al menos 8 caracteres")
      }
    } catch (err) {
      console.error("Sign up error:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Sign up to access real estate market insights and deals</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/login" className="text-sm text-primary hover:underline">
          Already have an account? Sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
