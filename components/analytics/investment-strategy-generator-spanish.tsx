"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrainCircuit, CheckCircle2 } from "lucide-react"

export function InvestmentStrategyGenerator() {
  const [region, setRegion] = useState("Córdoba, Argentina")
  const [budget, setBudget] = useState("250000")
  const [investmentGoals, setInvestmentGoals] = useState("cash-flow")
  const [timeHorizon, setTimeHorizon] = useState("medium")
  const [riskTolerance, setRiskTolerance] = useState("moderate")
  const [strategy, setStrategy] = useState<string | null>(null)

  const handleGenerateStrategy = async () => {
    // Generar estrategia estática basada en las selecciones
    const strategicRecommendations = generateStaticStrategy(investmentGoals, timeHorizon, riskTolerance, budget)
    setStrategy(strategicRecommendations)
  }

  const generateStaticStrategy = (goals: string, horizon: string, risk: string, budgetAmount: string) => {
    const budget = parseInt(budgetAmount)
    const budgetRange = budget < 150000 ? 'bajo' : budget < 300000 ? 'medio' : 'alto'

    let strategy = `<h3>Estrategia de Inversión Personalizada para Córdoba</h3>`

    // Recomendaciones basadas en presupuesto
    if (budgetRange === 'bajo') {
      strategy += `<h4>Presupuesto: $${budget.toLocaleString()} USD - Rango Inicial</h4>
      <p>Con tu presupuesto, te recomendamos comenzar con propiedades en barrios emergentes como:</p>
      <ul>
        <li><strong>Centro Histórico:</strong> Departamentos para renovar desde $80K</li>
        <li><strong>Alberdi:</strong> Casas pequeñas con potencial de mejora</li>
        <li><strong>San Martín:</strong> Departamentos de 1-2 ambientes</li>
      </ul>`
    } else if (budgetRange === 'medio') {
      strategy += `<h4>Presupuesto: $${budget.toLocaleString()} USD - Rango Intermedio</h4>
      <p>Tu presupuesto te permite acceder a propiedades de mejor calidad en zonas consolidadas:</p>
      <ul>
        <li><strong>Nueva Córdoba:</strong> Departamentos modernos cerca de universidades</li>
        <li><strong>Centro:</strong> Propiedades comerciales o mixtas</li>
        <li><strong>Villa Allende:</strong> Casas familiares en crecimiento</li>
      </ul>`
    } else {
      strategy += `<h4>Presupuesto: $${budget.toLocaleString()} USD - Rango Premium</h4>
      <p>Con tu presupuesto elevado, puedes considerar inversiones de mayor escala:</p>
      <ul>
        <li><strong>Villa Belgrano:</strong> Propiedades de lujo y casas grandes</li>
        <li><strong>Nueva Córdoba Premium:</strong> Penthouses y departamentos de alta gama</li>
        <li><strong>Propiedades Comerciales:</strong> Oficinas en Centro o locales comerciales</li>
      </ul>`
    }

    // Recomendaciones basadas en objetivos de inversión
    strategy += `<h4>Estrategia según tu Objetivo: ${getGoalLabel(goals)}</h4>`

    if (goals === 'cash-flow') {
      strategy += `<p><strong>Enfoque en Flujo de Caja:</strong></p>
      <ul>
        <li>Buscar propiedades con relación precio-alquiler alta (6-8% anual)</li>
        <li>Enfocarse en departamentos de 1-2 ambientes en Nueva Córdoba</li>
        <li>Considerar propiedades cerca de universidades para alquiler estudiantil</li>
        <li>Meta: ROI del 8-12% anual en efectivo</li>
      </ul>`
    } else if (goals === 'appreciation') {
      strategy += `<p><strong>Enfoque en Apreciación:</strong></p>
      <ul>
        <li>Invertir en barrios en desarrollo como Villa Allende</li>
        <li>Buscar propiedades con potencial de mejora y renovación</li>
        <li>Considerar áreas cerca de proyectos de infraestructura futuros</li>
        <li>Meta: Apreciación del 12-20% anual</li>
      </ul>`
    } else {
      strategy += `<p><strong>Enfoque Balanceado:</strong></p>
      <ul>
        <li>70% en propiedades de flujo de caja estable</li>
        <li>30% en propiedades con potencial de apreciación</li>
        <li>Diversificar entre departamentos y casas</li>
        <li>Meta: ROI total del 10-15% anual</li>
      </ul>`
    }

    // Recomendaciones basadas en horizonte temporal
    strategy += `<h4>Plan según Horizonte Temporal: ${getHorizonLabel(horizon)}</h4>`

    if (horizon === 'short') {
      strategy += `<p><strong>Estrategia a Corto Plazo:</strong></p>
      <ul>
        <li>Enfocarse en propiedades listas para alquilar inmediatamente</li>
        <li>Evitar renovaciones mayores</li>
        <li>Considerar propiedades con inquilinos existentes</li>
        <li>Preparar estrategia de salida en 1-2 años</li>
      </ul>`
    } else if (horizon === 'long') {
      strategy += `<p><strong>Estrategia a Largo Plazo:</strong></p>
      <ul>
        <li>Invertir en barrios emergentes con potencial de desarrollo</li>
        <li>Considerar propiedades que requieran renovaciones mayores</li>
        <li>Evaluar oportunidades comerciales o de mayor escala</li>
        <li>Estrategia de "comprar y mantener" por 5+ años</li>
      </ul>`
    } else {
      strategy += `<p><strong>Estrategia a Mediano Plazo:</strong></p>
      <ul>
        <li>Balancear flujo de caja inmediato con potencial de apreciación</li>
        <li>Renovaciones moderadas para aumentar valor</li>
        <li>Reevaluación de cartera cada 2-3 años</li>
        <li>Posibilidad de refinanciamiento para expansión</li>
      </ul>`
    }

    // Recomendaciones basadas en tolerancia al riesgo
    strategy += `<h4>Gestión de Riesgo: ${getRiskLabel(risk)}</h4>`

    if (risk === 'conservative') {
      strategy += `<p><strong>Perfil Conservador:</strong></p>
      <ul>
        <li>Propiedades en barrios establecidos y seguros</li>
        <li>Evitar renovaciones mayores o propiedades problemáticas</li>
        <li>Financiamiento conservador (máximo 70% LTV)</li>
        <li>Fondo de reserva del 6 meses de gastos</li>
      </ul>`
    } else if (risk === 'aggressive') {
      strategy += `<p><strong>Perfil Agresivo:</strong></p>
      <ul>
        <li>Propiedades con potencial alto pero mayor riesgo</li>
        <li>Renovaciones mayores y desarrollos</li>
        <li>Uso de apalancamiento máximo disponible</li>
        <li>Diversificación en múltiples tipos de propiedades</li>
      </ul>`
    } else {
      strategy += `<p><strong>Perfil Moderado:</strong></p>
      <ul>
        <li>80% propiedades estables, 20% oportunidades de mayor riesgo</li>
        <li>Renovaciones moderadas para agregar valor</li>
        <li>Financiamiento prudente (70-80% LTV)</li>
        <li>Diversificación geográfica dentro de Córdoba</li>
      </ul>`
    }

    strategy += `<h4>Próximos Pasos Recomendados:</h4>
    <ol>
      <li><strong>Investigación de Mercado:</strong> Analizar precios actuales en las zonas objetivo</li>
      <li><strong>Financiamiento:</strong> Pre-aprobación hipotecaria y líneas de crédito</li>
      <li><strong>Equipo Profesional:</strong> Agente inmobiliario, abogado, contador especializado</li>
      <li><strong>Primera Inversión:</strong> Comenzar con una propiedad que cumpla tus criterios</li>
      <li><strong>Análisis y Expansión:</strong> Evaluar resultados y planificar siguiente adquisición</li>
    </ol>`

    return strategy
  }

  const getGoalLabel = (value: string) => {
    switch (value) {
      case "cash-flow": return "Maximizar flujo de caja mensual"
      case "appreciation": return "Maximizar apreciación a largo plazo"
      case "balanced": return "Enfoque balanceado"
      case "tax-benefits": return "Beneficios fiscales y preservación patrimonial"
      default: return "Enfoque balanceado"
    }
  }

  const getHorizonLabel = (value: string) => {
    switch (value) {
      case "short": return "Corto plazo (1-2 años)"
      case "medium": return "Mediano plazo (3-5 años)"
      case "long": return "Largo plazo (5+ años)"
      default: return "Mediano plazo (3-5 años)"
    }
  }

  const getRiskLabel = (value: string) => {
    switch (value) {
      case "conservative": return "Conservador"
      case "moderate": return "Moderado"
      case "aggressive": return "Agresivo"
      default: return "Moderado"
    }
  }

  return (
    <Card className="border-findy-skyblue/20 bg-gradient-to-br from-findy-skyblue/5 to-transparent">
      <CardHeader className="bg-gradient-to-r from-findy-skyblue/10 to-transparent border-b border-findy-skyblue/20">
        <CardTitle className="flex items-center gap-2 text-findy-skyblue">
          <BrainCircuit className="h-5 w-5" />
          🧠 Generador de Estrategia de Inversión
        </CardTitle>
        <CardDescription className="text-findy-mediumgray">
          Genera una estrategia personalizada de inversión inmobiliaria basada en tus criterios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generator" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-findy-skyblue/20">
            <TabsTrigger
              value="generator"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-findy-skyblue/20 data-[state=active]:to-findy-skyblue/10 data-[state=active]:text-findy-skyblue data-[state=active]:border-findy-skyblue/30 hover:bg-findy-skyblue/5 text-findy-lightgray"
            >
              ⚙️ Generador
            </TabsTrigger>
            <TabsTrigger
              value="strategy"
              disabled={!strategy}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-findy-fuchsia/20 data-[state=active]:to-findy-fuchsia/10 data-[state=active]:text-findy-fuchsia data-[state=active]:border-findy-fuchsia/30 hover:bg-findy-fuchsia/5 text-findy-lightgray disabled:opacity-50"
            >
              📋 Tu Estrategia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="region" className="text-findy-lightgray font-medium">🌎 Región</Label>
                <Input
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  disabled
                  className="bg-gray-800 border-findy-skyblue/20 text-findy-lightgray"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-findy-lightgray font-medium">💰 Presupuesto de Inversión ($USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="ej. 250000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-gray-800 border-findy-skyblue/20 text-findy-lightgray placeholder:text-findy-mediumgray"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentGoals" className="text-findy-lightgray font-medium">🎯 Objetivos de Inversión</Label>
                <Select value={investmentGoals} onValueChange={setInvestmentGoals}>
                  <SelectTrigger id="investmentGoals" className="bg-gray-800 border-findy-skyblue/20 text-findy-lightgray">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-findy-skyblue/20">
                    <SelectItem value="cash-flow" className="text-findy-lightgray hover:bg-findy-skyblue/10">Maximizar flujo de caja mensual</SelectItem>
                    <SelectItem value="appreciation" className="text-findy-lightgray hover:bg-findy-skyblue/10">Maximizar apreciación a largo plazo</SelectItem>
                    <SelectItem value="balanced" className="text-findy-lightgray hover:bg-findy-skyblue/10">Enfoque balanceado</SelectItem>
                    <SelectItem value="tax-benefits" className="text-findy-lightgray hover:bg-findy-skyblue/10">Beneficios fiscales y preservación patrimonial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeHorizon" className="text-findy-lightgray font-medium">⏱️ Horizonte Temporal</Label>
                <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                  <SelectTrigger id="timeHorizon" className="bg-gray-800 border-findy-skyblue/20 text-findy-lightgray">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-findy-skyblue/20">
                    <SelectItem value="short" className="text-findy-lightgray hover:bg-findy-skyblue/10">Corto plazo (1-2 años)</SelectItem>
                    <SelectItem value="medium" className="text-findy-lightgray hover:bg-findy-skyblue/10">Mediano plazo (3-5 años)</SelectItem>
                    <SelectItem value="long" className="text-findy-lightgray hover:bg-findy-skyblue/10">Largo plazo (5+ años)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskTolerance" className="text-findy-lightgray font-medium">⚖️ Tolerancia al Riesgo</Label>
                <Select value={riskTolerance} onValueChange={setRiskTolerance}>
                  <SelectTrigger id="riskTolerance" className="bg-gray-800 border-findy-skyblue/20 text-findy-lightgray">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-findy-skyblue/20">
                    <SelectItem value="conservative" className="text-findy-lightgray hover:bg-findy-skyblue/10">Conservador</SelectItem>
                    <SelectItem value="moderate" className="text-findy-lightgray hover:bg-findy-skyblue/10">Moderado</SelectItem>
                    <SelectItem value="aggressive" className="text-findy-lightgray hover:bg-findy-skyblue/10">Agresivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            {strategy && (
              <div className="rounded-lg border border-findy-fuchsia/20 bg-gradient-to-r from-findy-fuchsia/5 to-transparent p-6">
                <div className="prose max-w-none text-sm text-findy-lightgray prose-headings:text-findy-fuchsia prose-h3:text-findy-fuchsia prose-h4:text-findy-electric prose-strong:text-findy-orange prose-ul:text-findy-lightgray prose-ol:text-findy-lightgray prose-li:text-findy-lightgray">
                  <div dangerouslySetInnerHTML={{ __html: strategy }} />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-findy-skyblue/5 to-transparent border-t border-findy-skyblue/20">
        <Button onClick={handleGenerateStrategy} className="w-full bg-gradient-to-r from-findy-skyblue to-findy-electric hover:from-findy-skyblue/80 hover:to-findy-electric/80 text-white border-0">
          {strategy ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" /> 🔄 Regenerar Estrategia
            </>
          ) : (
            <>
              <BrainCircuit className="mr-2 h-4 w-4" /> ✨ Generar Estrategia de Inversión
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}