import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gray-800 border-findy-fuchsia/20">
        <CardHeader className="text-center pb-4 bg-gradient-to-r from-findy-fuchsia/10 to-findy-electric/10 border-b border-findy-fuchsia/20">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-findy-fuchsia to-findy-electric rounded-full flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-findy-fuchsia to-findy-electric bg-clip-text text-transparent">
              404 - Página no encontrada
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 space-y-6">
          <div className="space-y-2">
            <p className="text-findy-lightgray text-lg">
              No pudimos encontrar la página que buscas
            </p>
            <p className="text-findy-mediumgray text-sm">
              Es posible que la URL esté mal escrita o que la página haya sido movida.
            </p>
          </div>

          <div className="bg-gradient-to-r from-findy-fuchsia/5 to-findy-electric/5 p-4 rounded-lg border border-findy-fuchsia/20">
            <p className="text-sm text-findy-lightgray">
              💡 <strong>Sugerencia:</strong> Usa nuestro Findy AI para encontrar exactamente lo que necesitas
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link href="/dashboard/chat">
              <Button className="w-full bg-gradient-to-r from-findy-fuchsia to-findy-magenta hover:from-findy-fuchsia/80 hover:to-findy-magenta/80 text-white border-0">
                <Search className="mr-2 h-4 w-4" />
                Abrir Findy AI
              </Button>
            </Link>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-findy-electric/30 text-findy-electric hover:bg-findy-electric/10"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>

              <Link href="/dashboard" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-findy-skyblue/30 text-findy-skyblue hover:bg-findy-skyblue/10"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}