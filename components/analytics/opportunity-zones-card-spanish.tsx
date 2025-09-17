"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, MapPin } from "lucide-react"

export function OpportunityZonesCard() {
  const zones = [
    {
      region: "Nueva Córdoba",
      opportunityScore: 88,
      medianPrice: 135000,
      priceChangePct: 12,
      rentalDemand: 92,
      investorActivity: 85,
      recommendedTypes: ["Departamento", "Loft"],
      insights: [
        "Alta demanda por proximidad a universidades",
        "Crecimiento constante en precios últimos 12 meses",
        "Excelente conectividad con transporte público"
      ]
    },
    {
      region: "Centro",
      opportunityScore: 82,
      medianPrice: 98000,
      priceChangePct: 8,
      rentalDemand: 78,
      investorActivity: 74,
      recommendedTypes: ["Departamento", "Oficina"],
      insights: [
        "Zona comercial consolidada con alta rentabilidad",
        "Oportunidades de renovación en edificios históricos",
        "Demanda estable de alquiler comercial y residencial"
      ]
    },
    {
      region: "Villa Allende",
      opportunityScore: 75,
      medianPrice: 165000,
      priceChangePct: 15,
      rentalDemand: 68,
      investorActivity: 62,
      recommendedTypes: ["Casa", "Duplex"],
      insights: [
        "Crecimiento residencial en expansión",
        "Atractivo para familias jóvenes profesionales",
        "Potencial de apreciación a largo plazo"
      ]
    }
  ]

  const topZone = zones[0]

  return (
    <Card className="border-findy-orange/20 bg-gradient-to-br from-findy-orange/5 to-transparent">
      <CardHeader className="bg-gradient-to-r from-findy-orange/10 to-transparent border-b border-findy-orange/20">
        <CardTitle className="flex items-center gap-2 text-findy-orange">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          🎯 Zonas de Oportunidad de Inversión
        </CardTitle>
        <CardDescription className="text-findy-mediumgray">
          Áreas de alto potencial para inversión inmobiliaria en Córdoba
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border border-findy-orange/20">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-findy-orange/20 data-[state=active]:to-findy-orange/10 data-[state=active]:text-findy-orange data-[state=active]:border-findy-orange/30 hover:bg-findy-orange/5 text-findy-lightgray"
            >
              🏆 Mejores Oportunidades
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-findy-skyblue/20 data-[state=active]:to-findy-skyblue/10 data-[state=active]:text-findy-skyblue data-[state=active]:border-findy-skyblue/30 hover:bg-findy-skyblue/5 text-findy-lightgray"
            >
              📍 Detalles de Zonas
            </TabsTrigger>
            <TabsTrigger
              value="strategy"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-findy-fuchsia/20 data-[state=active]:to-findy-fuchsia/10 data-[state=active]:text-findy-fuchsia data-[state=active]:border-findy-fuchsia/30 hover:bg-findy-fuchsia/5 text-findy-lightgray"
            >
              🚀 Estrategia de Inversión
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="rounded-lg border border-findy-orange/20 bg-gradient-to-r from-findy-orange/5 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-findy-orange" />
                  <h3 className="font-medium text-findy-lightgray">{topZone.region}</h3>
                </div>
                <Badge
                  variant="outline"
                  className="bg-findy-orange/20 text-findy-orange border-findy-orange/30"
                >
                  {topZone.opportunityScore}/100
                </Badge>
              </div>
              <Progress value={topZone.opportunityScore} className="mt-2 h-1.5" />

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-findy-mediumgray">Precio Medio</p>
                  <p className="font-medium text-findy-lightgray">${topZone.medianPrice.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-findy-mediumgray">Cambio de Precio</p>
                  <p className="font-medium text-findy-orange">
                    +{topZone.priceChangePct}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-findy-mediumgray">Demanda de Alquiler</p>
                  <p className="font-medium text-findy-lightgray">{topZone.rentalDemand}/100</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-findy-mediumgray">Actividad Inversores</p>
                  <p className="font-medium text-findy-lightgray">{topZone.investorActivity}/100</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-findy-lightgray">Tipos de Propiedad Recomendados</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {topZone.recommendedTypes.map((type, index) => (
                    <Badge key={index} className="bg-findy-skyblue/20 text-findy-skyblue border-findy-skyblue/30">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-findy-lightgray">Insights Clave</h4>
                <ul className="mt-1 space-y-1">
                  {topZone.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-findy-lightgray">
                      <TrendingUp className="mt-0.5 h-3 w-3 flex-shrink-0 text-findy-orange" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {zones.slice(1, 3).map((zone, index) => (
                <div key={index} className={`rounded-lg border p-3 ${
                  index === 0
                    ? 'border-findy-electric/20 bg-gradient-to-r from-findy-electric/5 to-transparent'
                    : 'border-findy-skyblue/20 bg-gradient-to-r from-findy-skyblue/5 to-transparent'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-findy-lightgray">{zone.region}</h3>
                    <Badge
                      variant="outline"
                      className={
                        index === 0
                          ? 'bg-findy-electric/20 text-findy-electric border-findy-electric/30'
                          : 'bg-findy-skyblue/20 text-findy-skyblue border-findy-skyblue/30'
                      }
                    >
                      {zone.opportunityScore}/100
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-0.5">
                      <p className="text-xs text-findy-mediumgray">Precio Medio</p>
                      <p className="text-findy-lightgray">${zone.medianPrice.toLocaleString()}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-findy-mediumgray">Cambio de Precio</p>
                      <p className={index === 0 ? 'text-findy-electric' : 'text-findy-skyblue'}>
                        +{zone.priceChangePct}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-findy-mediumgray">Recomendado</p>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {zone.recommendedTypes.slice(0, 2).map((type, i) => (
                        <Badge
                          key={i}
                          className={`text-xs ${
                            index === 0
                              ? 'bg-findy-electric/20 text-findy-electric border-findy-electric/30'
                              : 'bg-findy-skyblue/20 text-findy-skyblue border-findy-skyblue/30'
                          }`}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-4">
              {zones.map((zone, index) => (
                <div key={index} className={`rounded-lg border p-4 ${
                  index === 0
                    ? 'border-findy-orange/20 bg-gradient-to-r from-findy-orange/5 to-transparent'
                    : index === 1
                    ? 'border-findy-electric/20 bg-gradient-to-r from-findy-electric/5 to-transparent'
                    : 'border-findy-skyblue/20 bg-gradient-to-r from-findy-skyblue/5 to-transparent'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-findy-lightgray">{zone.region}</h3>
                    <Badge
                      variant="outline"
                      className={
                        zone.opportunityScore >= 85
                          ? "bg-findy-orange/20 text-findy-orange border-findy-orange/30"
                          : zone.opportunityScore >= 70
                            ? "bg-findy-electric/20 text-findy-electric border-findy-electric/30"
                            : "bg-findy-skyblue/20 text-findy-skyblue border-findy-skyblue/30"
                      }
                    >
                      {zone.opportunityScore}/100
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-xs text-findy-mediumgray">Precio Medio</p>
                      <p className="font-medium text-findy-lightgray">${zone.medianPrice.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-findy-mediumgray">Cambio de Precio</p>
                      <p className={`font-medium ${
                        index === 0
                          ? 'text-findy-orange'
                          : index === 1
                          ? 'text-findy-electric'
                          : 'text-findy-skyblue'
                      }`}>
                        +{zone.priceChangePct}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-findy-mediumgray">Demanda de Alquiler</p>
                      <p className="font-medium text-findy-lightgray">{zone.rentalDemand}/100</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-findy-mediumgray">Actividad Inversores</p>
                      <p className="font-medium text-findy-lightgray">{zone.investorActivity}/100</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-findy-lightgray">Tipos de Propiedad Recomendados</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {zone.recommendedTypes.map((type, i) => (
                        <Badge key={i} className={`${
                          index === 0
                            ? 'bg-findy-orange/20 text-findy-orange border-findy-orange/30'
                            : index === 1
                            ? 'bg-findy-electric/20 text-findy-electric border-findy-electric/30'
                            : 'bg-findy-skyblue/20 text-findy-skyblue border-findy-skyblue/30'
                        }`}>
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-findy-lightgray">Insights Clave</h4>
                    <ul className="mt-1 space-y-1">
                      {zone.insights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-findy-lightgray">
                          <TrendingUp className={`mt-0.5 h-3 w-3 flex-shrink-0 ${
                            index === 0
                              ? 'text-findy-orange'
                              : index === 1
                              ? 'text-findy-electric'
                              : 'text-findy-skyblue'
                          }`} />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border border-findy-fuchsia/20 bg-gradient-to-r from-findy-fuchsia/5 to-transparent p-4">
                <h3 className="font-medium text-findy-fuchsia">🎯 Estrategia a Corto Plazo (6-12 meses)</h3>
                <p className="mt-2 text-sm text-findy-lightgray">
                  Enfocarse en propiedades en Nueva Córdoba con potencial de flujo de caja inmediato. Apuntar a
                  departamentos con precios por debajo del mercado que requieran renovaciones mínimas. La fuerte
                  demanda de alquiler (92/100) sugiere colocación rápida de inquilinos e ingresos estables.
                </p>
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-findy-fuchsia">Pasos de Acción:</h4>
                  <ol className="mt-1 space-y-1 pl-5 text-sm text-findy-lightgray">
                    <li className="list-decimal">
                      Configurar alertas de propiedades para departamentos en Nueva Córdoba
                    </li>
                    <li className="list-decimal">
                      Enfocarse en propiedades con precios 5-10% por debajo del mercado en buenas condiciones
                    </li>
                    <li className="list-decimal">
                      Preparar opciones de financiamiento enfocadas en maximizar flujo de caja
                    </li>
                    <li className="list-decimal">Construir relaciones con administradores de propiedades en la zona</li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg border border-findy-electric/20 bg-gradient-to-r from-findy-electric/5 to-transparent p-4">
                <h3 className="font-medium text-findy-electric">⚡ Estrategia a Mediano Plazo (1-3 años)</h3>
                <p className="mt-2 text-sm text-findy-lightgray">
                  Expandir cartera para incluir propiedades en Centro y Villa Allende con potencial de valor agregado.
                  Las tendencias de apreciación del 8-15% indican buen potencial de crecimiento de capital.
                  Considerar propiedades que puedan beneficiarse de mejoras estratégicas.
                </p>
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-findy-electric">Pasos de Acción:</h4>
                  <ol className="mt-1 space-y-1 pl-5 text-sm text-findy-lightgray">
                    <li className="list-decimal">
                      Identificar propiedades con potencial de renovación para forzar apreciación
                    </li>
                    <li className="list-decimal">Desarrollar relaciones con contratistas y especialistas en renovación</li>
                    <li className="list-decimal">
                      Considerar refinanciamiento de propiedades iniciales para extraer capital para nuevas adquisiciones
                    </li>
                    <li className="list-decimal">
                      Monitorear proyectos de desarrollo que puedan impactar valores de propiedades
                    </li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg border border-findy-skyblue/20 bg-gradient-to-r from-findy-skyblue/5 to-transparent p-4">
                <h3 className="font-medium text-findy-skyblue">🚀 Estrategia a Largo Plazo (3-5+ años)</h3>
                <p className="mt-2 text-sm text-findy-lightgray">
                  Posicionar cartera para máxima apreciación adquiriendo propiedades en barrios emergentes antes
                  de que se completen proyectos de desarrollo importantes. Considerar propiedades multifamiliares
                  o comerciales más grandes para diversificación de cartera.
                </p>
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-findy-skyblue">Pasos de Acción:</h4>
                  <ol className="mt-1 space-y-1 pl-5 text-sm text-findy-lightgray">
                    <li className="list-decimal">
                      Investigar próximos proyectos de infraestructura y desarrollo en la región
                    </li>
                    <li className="list-decimal">
                      Explorar oportunidades de propiedades comerciales conforme crezca la cartera
                    </li>
                    <li className="list-decimal">
                      Desarrollar estrategias de salida para cada propiedad basadas en la posición del ciclo de mercado
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}