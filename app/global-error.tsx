'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, RotateCcw, Home, AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-800 border-red-500/30">
            <CardHeader className="text-center pb-4 bg-gradient-to-r from-red-500/20 to-findy-orange/20 border-b border-red-500/30">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-findy-orange rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-red-400 to-findy-orange bg-clip-text text-transparent">
                  Error Crítico del Sistema
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6 space-y-4">
              <div className="space-y-2">
                <p className="text-findy-lightgray font-medium">
                  La aplicación encontró un error crítico y necesita reiniciarse.
                </p>
                <p className="text-findy-mediumgray text-sm">
                  Nuestro equipo técnico ha sido notificado automáticamente.
                </p>
              </div>

              {error.digest && (
                <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-2 justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <p className="text-xs text-red-400">
                      Error ID: {error.digest}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-findy-electric/5 to-findy-fuchsia/5 p-4 rounded-lg border border-findy-electric/20">
                <p className="text-xs text-findy-lightgray">
                  Si el problema persiste, intenta limpiar la caché del navegador o contacta soporte técnico.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={reset}
                  className="w-full bg-gradient-to-r from-red-500 to-findy-orange hover:from-red-500/80 hover:to-findy-orange/80 text-white border-0"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reiniciar Aplicación
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-findy-electric/30 text-findy-electric hover:bg-findy-electric/10"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Ir al Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}