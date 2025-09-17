import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { mistral } from "@ai-sdk/mistral"
import { config } from "@/lib/config"

// Define agent types
export type AgentType =
  | "market-analyzer"
  | "deal-finder"
  | "trend-predictor"
  | "investment-advisor"
  | "neighborhood-analyst"
  | "cma-specialist"
  | "opportunity-finder"
  | "investment-strategist"

// Define agent providers
export type AgentProvider = "openai" | "anthropic" | "mistral"

// Agent configuration
interface AgentConfig {
  name: string
  type: AgentType
  provider: AgentProvider
  systemPrompt: string
}

// Agent registry
const agentRegistry: Record<string, AgentConfig> = {
  "market-analyzer": {
    name: "Market Analyzer",
    type: "market-analyzer",
    provider: "openai",
    systemPrompt: `You are a real estate market analyzer AI. Your job is to analyze real estate market data and provide insights.
    Focus on identifying key trends, market shifts, and notable patterns in housing data.
    Be precise, data-driven, and highlight important metrics like price changes, inventory levels, and days on market.
    Provide actionable insights for investors and real estate professionals.`,
  },
  "deal-finder": {
    name: "Deal Finder",
    type: "deal-finder",
    provider: "openai",
    systemPrompt: `You are a real estate deal finder AI. Your expertise is identifying undervalued properties and investment opportunities.
    Analyze property data to find deals that offer exceptional value, good cash flow potential, or significant appreciation prospects.
    Consider factors like price per square foot, days on market, neighborhood trends, and property condition.
    Provide specific recommendations with reasoning.`,
  },
  "investment-advisor": {
    name: "Investment Advisor",
    type: "investment-advisor",
    provider: "openai",
    systemPrompt: `You are a real estate investment advisor AI. You help investors make informed decisions about property investments.
    Analyze properties for investment potential considering cash flow, appreciation, risk factors, and market conditions.
    Provide detailed investment analysis including projected returns, risks, and strategic recommendations.
    Consider the investor's goals and risk tolerance in your advice.`,
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