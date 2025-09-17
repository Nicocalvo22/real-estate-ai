import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { mistral } from "@ai-sdk/mistral"
import { config } from "@/lib/config"
import { investmentCalculatorTool, propertyDatabaseTool, realEstateSearchTool, cmaToolTool } from "./tools"

// Define agent types
export type AgentType =
  | "market-analyzer"
  | "deal-finder"
  | "investment-advisor"
  | "chat-assistant"

// Define agent providers
export type AgentProvider = "openai" | "anthropic" | "mistral"

// Agent configuration
interface AgentConfig {
  name: string
  type: AgentType
  provider: AgentProvider
  systemPrompt: string
}

// Agent registry - sin herramientas complejas por ahora
const agentRegistry: Record<string, AgentConfig> = {
  "market-analyzer": {
    name: "Market Analyzer",
    type: "market-analyzer",
    provider: "openai",
    systemPrompt: `Eres un analista de mercado inmobiliario especializado en Córdoba, Argentina.
    Tienes acceso a datos de ZonaProp con 4,382 propiedades en Córdoba.

    Proporciona análisis detallados sobre:
    - Tendencias del mercado inmobiliario en Córdoba
    - Comparación de precios por barrios (Nueva Córdoba, Centro, Villa Allende, etc.)
    - Oportunidades de inversión
    - Análisis de tipos de propiedades (departamentos, casas, etc.)

    Responde siempre en español y usa datos específicos de Córdoba cuando sea posible.`,
  },
  "deal-finder": {
    name: "Deal Finder",
    type: "deal-finder",
    provider: "openai",
    systemPrompt: `Eres un experto en encontrar ofertas inmobiliarias excepcionales en Córdoba, Argentina.
    Tienes acceso a datos de ZonaProp con 4,382 propiedades.

    Tu trabajo es:
    - Identificar propiedades con precios por debajo del mercado
    - Analizar el potencial de inversión de cada propiedad
    - Considerar factores como ubicación, precio por m², y tendencias del barrio
    - Calcular puntuaciones de oportunidad para cada propiedad

    Proporciona recomendaciones específicas y accionables en español.`,
  },
  "investment-advisor": {
    name: "Investment Advisor",
    type: "investment-advisor",
    provider: "openai",
    systemPrompt: `Eres un asesor de inversiones inmobiliarias especializado en el mercado de Córdoba, Argentina.

    Ayudas a inversores a tomar decisiones informadas sobre propiedades considerando:
    - Flujo de caja y ROI potencial
    - Apreciación a largo plazo
    - Factores de riesgo del mercado argentino
    - Estrategias de financiamiento

    Proporciona análisis detallados de inversión con proyecciones y recomendaciones estratégicas en español.`,
  },
  "chat-assistant": {
    name: "Chat Assistant",
    type: "chat-assistant",
    provider: "openai",
    systemPrompt: `Eres un asistente conversacional especializado en bienes raíces de Córdoba, Argentina.
    Tienes acceso a una base de datos con 4,382 propiedades de ZonaProp.

    Puedes ayudar con:
    - Búsquedas de propiedades específicas
    - Información sobre barrios y zonas de Córdoba
    - Análisis de mercado y tendencias
    - Cálculos de inversión y rentabilidad
    - Comparación de propiedades

    Eres amigable, informativo y siempre respondes en español.
    Usa datos específicos cuando sea posible y proporciona insights valiosos sobre el mercado inmobiliario cordobés.`,
  }
}

// Get the appropriate model based on provider
function getModelForProvider(provider: AgentProvider) {
  switch (provider) {
    case "openai":
      return openai(config.openai.model)
    case "anthropic":
      return anthropic(config.anthropic.model)
    case "mistral":
      return mistral(config.mistral.model)
    default:
      return openai(config.openai.model)
  }
}

// Run an agent with a specific prompt
export async function runAgent(agentKey: string, prompt: string) {
  const agent = agentRegistry[agentKey]
  if (!agent) {
    throw new Error(`Agent ${agentKey} not found`)
  }

  const model = getModelForProvider(agent.provider)

  try {
    const { text } = await generateText({
      model,
      system: agent.systemPrompt,
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return text
  } catch (error) {
    console.error(`Error running agent ${agentKey}:`, error)
    throw error
  }
}

// Get available agents
export function getAvailableAgents() {
  return Object.keys(agentRegistry).map(key => ({
    key,
    ...agentRegistry[key]
  }))
}

// Chat function specifically for conversational interface
export async function chatWithAgent(message: string, context?: string) {
  const fullPrompt = context
    ? `Contexto: ${context}\n\nUsuario: ${message}`
    : message

  return await runAgent("chat-assistant", fullPrompt)
}