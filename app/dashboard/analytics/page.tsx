import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { runAgent } from "@/lib/ai/agent-system-simple"
import { MarketInsightsCard } from "@/components/analytics/market-insights-card"
import { MarketTrendsFilter } from "@/components/analytics/market-trends-filter"
import { OpportunityZonesCard } from "@/components/analytics/opportunity-zones-card-spanish"
import { InvestmentStrategyGenerator } from "@/components/analytics/investment-strategy-generator-spanish"

export default async function AnalyticsPage() {
  // Contenido de análisis estático (IA temporalmente deshabilitada por cuota)
  const marketAnalysis = `Basado en el análisis de datos de ZonaProp para Córdoba, Argentina:

• Resumen del Mercado: 4,382 propiedades activas con fuerte actividad de mercado
• Rango de Precios: Las propiedades van desde $47,000 a $675,000 USD, con un promedio de $127,000
• Tipos de Propiedades: Los departamentos dominan el mercado, siendo el tipo más común
• Distribución Geográfica: Fuerte presencia en Centro, Nueva Córdoba y Villa Allende
• Rango de Tamaños: Las propiedades típicamente van de 40-180 m², adecuadas para diversas estrategias de inversión

Insights Clave:
- Córdoba muestra niveles robustos de inventario indicando un mercado activo
- Diversos puntos de precio ofrecen oportunidades para diferentes perfiles de inversionistas
- Áreas urbanas como Nueva Córdoba muestran precios premium debido a ventajas de ubicación
- La profundidad del mercado sugiere buena liquidez tanto para comprar como vender`

  const trendPrediction = `Perspectivas de Inversión para Bienes Raíces en Córdoba (Próximos 6-12 meses):

• Áreas de Crecimiento: Nueva Córdoba y Centro continúan mostrando fundamentos sólidos
• Estrategia de Inversión: Enfocarse en departamentos en barrios establecidos
• Tendencias de Precios: Mercado estable con apreciación moderada esperada
• Demanda de Alquiler: Mercado de alquiler sólido impulsado por presencia universitaria y empleo urbano

Recomendaciones:
- Considerar propiedades en el rango de $80K-$150K para flujo de caja óptimo
- Buscar oportunidades en barrios emergentes adyacentes a áreas establecidas
- Propiedades de 50-100 m² muestran buen balance entre asequibilidad y atractivo para alquiler
- Monitorear niveles de inventario - la alta actividad actual sugiere condiciones competitivas

Factores de Riesgo:
- Impactos de fluctuación cambiaria en inversiones denominadas en USD
- Cambios regulatorios en políticas del mercado de alquiler
- Volatilidad económica afectando la demanda de propiedades`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-findy-magenta to-findy-electric bg-clip-text text-transparent">
            Analíticas del Mercado
          </span>
        </h1>
        <p className="text-findy-lightgray">
          Insights inteligentes sobre las condiciones del mercado inmobiliario y tendencias en Córdoba, Argentina
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-findy-electric/20 bg-gradient-to-br from-findy-electric/5 to-findy-electric/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-findy-lightgray">Propiedades Totales</CardTitle>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-findy-electric to-findy-skyblue flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-white"
              >
                <path d="M12 2v20m8-10H4" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-findy-electric">4,382</div>
            <p className="text-xs text-findy-mediumgray">Propiedades en Córdoba</p>
          </CardContent>
        </Card>
        <Card className="border-findy-orange/20 bg-gradient-to-br from-findy-orange/5 to-findy-orange/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-findy-lightgray">Precio Promedio</CardTitle>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-findy-orange to-yellow-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-white"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-findy-orange">$127K</div>
            <p className="text-xs text-findy-mediumgray">Promedio en USD</p>
          </CardContent>
        </Card>
        <Card className="border-findy-magenta/20 bg-gradient-to-br from-findy-magenta/5 to-findy-magenta/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-findy-lightgray">Listados Activos</CardTitle>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-findy-magenta to-findy-fuchsia flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-white"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-findy-magenta">4,382</div>
            <p className="text-xs text-findy-mediumgray">Todos activos</p>
          </CardContent>
        </Card>
        <Card className="border-findy-skyblue/20 bg-gradient-to-br from-findy-skyblue/5 to-findy-skyblue/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-findy-lightgray">Barrios</CardTitle>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-findy-skyblue to-findy-electric flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-white"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-findy-skyblue">25+</div>
            <p className="text-xs text-findy-mediumgray">Áreas cubiertas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-findy-magenta/20">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-findy-electric/20 data-[state=active]:to-findy-electric/10 data-[state=active]:text-findy-electric data-[state=active]:border-findy-electric/30 hover:bg-findy-electric/5 text-findy-lightgray"
          >
            📊 Resumen
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-findy-magenta/20 data-[state=active]:to-findy-magenta/10 data-[state=active]:text-findy-magenta data-[state=active]:border-findy-magenta/30 hover:bg-findy-magenta/5 text-findy-lightgray"
          >
            📈 Tendencias
          </TabsTrigger>
          <TabsTrigger
            value="opportunities"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-findy-orange/20 data-[state=active]:to-findy-orange/10 data-[state=active]:text-findy-orange data-[state=active]:border-findy-orange/30 hover:bg-findy-orange/5 text-findy-lightgray"
          >
            🎯 Oportunidades
          </TabsTrigger>
          <TabsTrigger
            value="strategy"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-findy-skyblue/20 data-[state=active]:to-findy-skyblue/10 data-[state=active]:text-findy-skyblue data-[state=active]:border-findy-skyblue/30 hover:bg-findy-skyblue/5 text-findy-lightgray"
          >
            🧠 Estrategia
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-findy-electric/20 bg-gradient-to-br from-findy-electric/5 to-transparent">
              <CardHeader className="bg-gradient-to-r from-findy-electric/10 to-transparent border-b border-findy-electric/20">
                <CardTitle className="flex items-center gap-2 text-findy-electric">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Análisis del Mercado
                </CardTitle>
                <CardDescription className="text-findy-mediumgray">
                  Análisis inteligente de las condiciones actuales del mercado
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm whitespace-pre-wrap text-findy-lightgray leading-relaxed">{marketAnalysis}</p>
              </CardContent>
            </Card>
            <Card className="border-findy-magenta/20 bg-gradient-to-br from-findy-magenta/5 to-transparent">
              <CardHeader className="bg-gradient-to-r from-findy-magenta/10 to-transparent border-b border-findy-magenta/20">
                <CardTitle className="flex items-center gap-2 text-findy-magenta">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Insights de Inversión
                </CardTitle>
                <CardDescription className="text-findy-mediumgray">
                  Tendencias clave y predicciones para inversores
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm whitespace-pre-wrap text-findy-lightgray leading-relaxed">{trendPrediction}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <MarketTrendsFilter />
        </TabsContent>
        <TabsContent value="opportunities" className="space-y-4">
          <OpportunityZonesCard />
        </TabsContent>
        <TabsContent value="strategy" className="space-y-4">
          <InvestmentStrategyGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}