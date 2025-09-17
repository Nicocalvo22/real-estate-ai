import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-gray-800 border-findy-electric/20">
        <CardHeader className="text-center pb-4 bg-gradient-to-r from-findy-electric/10 to-findy-fuchsia/10 border-b border-findy-electric/20">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-findy-electric to-findy-fuchsia rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-white animate-pulse" />
          </div>
          <CardTitle className="text-xl font-bold">
            <span className="bg-gradient-to-r from-findy-electric to-findy-fuchsia bg-clip-text text-transparent">
              RealEstate AI
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-findy-electric" />
            <span className="text-findy-lightgray font-medium">
              Cargando...
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-findy-fuchsia rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-findy-electric rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-findy-magenta rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>

            <p className="text-sm text-findy-mediumgray">
              Preparando tu experiencia inmobiliaria
            </p>
          </div>

          <div className="w-full bg-findy-mediumgray/20 rounded-full h-1">
            <div className="bg-gradient-to-r from-findy-electric via-findy-fuchsia to-findy-magenta h-1 rounded-full animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
