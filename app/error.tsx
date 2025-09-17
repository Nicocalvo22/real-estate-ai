'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-findy-orange/20">
        <CardHeader className="text-center pb-4 bg-gradient-to-r from-findy-orange/10 to-red-500/10 border-b border-findy-orange/20">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-findy-orange to-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-findy-orange to-red-400 bg-clip-text text-transparent">
              ¡Oops! Algo salió mal
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 space-y-4">
          <p className="text-findy-lightgray">
            Ocurrió un error inesperado. Nuestro equipo ha sido notificado automáticamente.
          </p>

          {error.digest && (
            <div className="bg-findy-mediumgray/10 p-3 rounded-lg border border-findy-mediumgray/20">
              <p className="text-xs text-findy-mediumgray">
                ID del error: {error.digest}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={reset}
              className="w-full bg-gradient-to-r from-findy-orange to-red-500 hover:from-findy-orange/80 hover:to-red-500/80 text-white border-0"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Intentar nuevamente
            </Button>

            <Link href="/dashboard">
              <Button
                variant="outline"
                className="w-full border-findy-orange/30 text-findy-orange hover:bg-findy-orange/10"
              >
                <Home className="mr-2 h-4 w-4" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}