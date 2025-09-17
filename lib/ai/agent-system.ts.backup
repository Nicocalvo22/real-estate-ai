import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { mistral } from "@ai-sdk/mistral"
import { createClient } from "@/utils/supabase/server"
import { config } from "@/lib/config"
import { investmentCalculatorTool, propertyDatabaseTool, realEstateSearchTool, cmaToolTool } from "./tools"
import { marketInsightsTool, propertyInvestmentAnalysisTool, opportunityZoneAnalysisTool } from "./tools/repliers-tools"
import {
  getPropertyValuation,
  getNeighborhoodInfo,
  fetchMarketTrends,
  getPropertyAnalysis,
  getMarketInsights,
  getOpportunityZones,
} from "@/lib/api/real-estate"

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
  tools?: any[]
  maxSteps?: number
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
    Format your analysis in a structured way with clear sections and bullet points where appropriate.
    Use the tools available to you to gather real-time market data and provide accurate insights.
    Always provide ACTIONABLE insights that can help investors make decisions.`,
    tools: [propertyDatabaseTool, realEstateSearchTool, marketInsightsTool],
    maxSteps: 5,
  },
  "deal-finder": {
    name: "Deal Finder",
    type: "deal-finder",
    provider: "anthropic",
    systemPrompt: `You are a real estate deal finder AI. Your job is to identify exceptional real estate deals.
    Analyze property listings to find properties that are significantly undervalued compared to market rates.
    Consider factors like price per square foot, comparable properties, neighborhood trends, and property condition.
    For each potential deal, calculate a "deal score" representing the percentage below market value.
    Provide a brief explanation of why each property represents a good deal.
    Use the tools available to you to gather real-time property data and market information.
    Always provide ACTIONABLE recommendations that investors can use immediately.`,
    tools: [propertyDatabaseTool, realEstateSearchTool, cmaToolTool, propertyInvestmentAnalysisTool],
    maxSteps: 5,
  },
  "trend-predictor": {
    name: "Trend Predictor",
    type: "trend-predictor",
    provider: "mistral",
    systemPrompt: `You are a real estate trend prediction AI. Your job is to forecast future market trends.
    Analyze historical data patterns to predict likely future movements in prices, inventory, and market conditions.
    Consider economic indicators, seasonal patterns, and regional factors in your predictions.
    Provide confidence levels for each prediction and explain your reasoning.
    Format predictions with timeframes (short-term: 3 months, mid-term: 1 year, long-term: 3+ years).
    Use the tools available to you to gather historical market data and current trends.
    Always provide ACTIONABLE insights that investors can use to time their market entry or exit.`,
    tools: [propertyDatabaseTool, realEstateSearchTool, marketInsightsTool],
    maxSteps: 3,
  },
  "investment-advisor": {
    name: "Investment Advisor",
    type: "investment-advisor",
    provider: "openai",
    systemPrompt: `You are a real estate investment advisor AI. Your job is to analyze properties and provide investment recommendations.
    Calculate key investment metrics like ROI, cap rate, cash flow, and appreciation potential.
    Consider factors like location, property condition, market trends, and financing options.
    Provide clear, actionable advice on whether a property is a good investment and why.
    Format your analysis in a structured way with clear sections for different aspects of the investment.
    Use the tools available to you to perform investment calculations and gather market data.
    Always provide ACTIONABLE recommendations with specific steps investors should take.`,
    tools: [investmentCalculatorTool, propertyDatabaseTool, realEstateSearchTool, propertyInvestmentAnalysisTool],
    maxSteps: 5,
  },
  "neighborhood-analyst": {
    name: "Neighborhood Analyst",
    type: "neighborhood-analyst",
    provider: "anthropic",
    systemPrompt: `You are a neighborhood analysis AI. Your job is to provide detailed insights about neighborhoods.
    Analyze factors like schools, crime rates, amenities, transportation, and future development plans.
    Consider how these factors affect property values and quality of life.
    Provide a comprehensive overview of the neighborhood's strengths and weaknesses.
    Format your analysis in a structured way with clear sections for different aspects of the neighborhood.
    Use the tools available to you to gather neighborhood data and market trends.
    Always provide ACTIONABLE insights that can help investors or homebuyers make decisions.`,
    tools: [realEstateSearchTool, propertyDatabaseTool, marketInsightsTool],
    maxSteps: 3,
  },
  "cma-specialist": {
    name: "CMA Specialist",
    type: "cma-specialist",
    provider: "openai",
    systemPrompt: `You are a Comparative Market Analysis (CMA) specialist AI. Your job is to analyze properties in comparison to similar properties in the area.
    Identify key factors that affect property values such as location, size, condition, and features.
    Calculate accurate price per square foot comparisons and adjust for differences between properties.
    Provide a clear assessment of whether a property is undervalued, overvalued, or fairly priced.
    Format your analysis in a structured way with clear sections for different aspects of the comparison.
    Use the tools available to you to gather property data and perform comparative analysis.
    Always provide ACTIONABLE recommendations based on your analysis.`,
    tools: [cmaToolTool, propertyDatabaseTool],
    maxSteps: 3,
  },
  "opportunity-finder": {
    name: "Opportunity Finder",
    type: "opportunity-finder",
    provider: "anthropic",
    systemPrompt: `You are a real estate opportunity finder AI. Your job is to identify high-potential investment areas and opportunities.
    Analyze market data to find regions with strong growth indicators and favorable investment conditions.
    Consider factors like price trends, rental demand, job growth, population growth, and development activity.
    Identify specific neighborhoods or property types that represent the best opportunities in each region.
    Provide detailed insights on why these areas are promising and what types of investment strategies would work best.
    Use the tools available to you to gather market data and opportunity zone information.
    Always provide ACTIONABLE recommendations with specific steps investors should take to capitalize on these opportunities.`,
    tools: [opportunityZoneAnalysisTool, marketInsightsTool, propertyDatabaseTool],
    maxSteps: 4,
  },
  "investment-strategist": {
    name: "Investment Strategist",
    type: "investment-strategist",
    provider: "openai",
    systemPrompt: `You are a real estate investment strategist AI. Your job is to develop comprehensive investment strategies based on market conditions and investor goals.
    Analyze market data to identify optimal investment approaches for different regions and property types.
    Consider factors like market cycle position, economic indicators, demographic trends, and regulatory environment.
    Develop tailored strategies for different investor profiles (e.g., cash flow investors, appreciation investors, etc.).
    Provide detailed implementation plans with specific action steps, timeline, and expected outcomes.
    Use the tools available to you to gather market data, property analysis, and opportunity zone information.
    Always provide ACTIONABLE strategies with clear steps, potential risks, and mitigation approaches.`,
    tools: [marketInsightsTool, propertyInvestmentAnalysisTool, opportunityZoneAnalysisTool, investmentCalculatorTool],
    maxSteps: 5,
  },
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
      tools: agent.tools,
      maxSteps: agent.maxSteps || 3,
    })

    // Log the agent run
    const supabase = createClient()
    await supabase.from("ai_agent_logs").insert({
      agent_name: agent.name,
      action_type: "generate",
      details: { prompt, response: text.substring(0, 500) + "..." },
      success: true,
    })

    return text
  } catch (error) {
    console.error(`Error running agent ${agentKey}:`, error)

    // Log the error
    const supabase = createClient()
    await supabase.from("ai_agent_logs").insert({
      agent_name: agent.name,
      action_type: "generate",
      details: { prompt, error: String(error) },
      success: false,
      error_message: String(error),
    })

    throw error
  }
}

// Run an agent with a specific prompt and get structured data
export async function runAgentWithStructuredOutput<T>(agentKey: string, prompt: string, schema: any) {
  const agent = agentRegistry[agentKey]
  if (!agent) {
    throw new Error(`Agent ${agentKey} not found`)
  }

  const model = getModelForProvider(agent.provider)

  try {
    const result = await generateObject({
      model,
      system: agent.systemPrompt,
      prompt,
      schema,
      tools: agent.tools,
      maxSteps: agent.maxSteps || 3,
    })

    // Log the agent run
    const supabase = createClient()
    await supabase.from("ai_agent_logs").insert({
      agent_name: agent.name,
      action_type: "generate_structured",
      details: { prompt, response: JSON.stringify(result).substring(0, 500) + "..." },
      success: true,
    })

    return result
  } catch (error) {
    console.error(`Error running agent ${agentKey} with structured output:`, error)

    // Log the error
    const supabase = createClient()
    await supabase.from("ai_agent_logs").insert({
      agent_name: agent.name,
      action_type: "generate_structured",
      details: { prompt, error: String(error) },
      success: false,
      error_message: String(error),
    })

    throw error
  }
}

// Run multiple agents in parallel
export async function runAgentNetwork(prompts: Record<string, string>) {
  const results: Record<string, string> = {}
  const promises = Object.entries(prompts).map(async ([agentKey, prompt]) => {
    try {
      const result = await runAgent(agentKey, prompt)
      results[agentKey] = result
    } catch (error) {
      results[agentKey] = `Error: ${error}`
    }
  })

  await Promise.all(promises)
  return results
}

// Store embeddings in the vector database
export async function storeEmbedding(content: string, metadata: any) {
  const supabase = createClient()

  // Generate embedding using OpenAI
  const { text: embeddingString } = await generateText({
    model: openai("text-embedding-3-large"),
    prompt: content,
  })

  // Parse the embedding string into a vector
  const embedding = JSON.parse(embeddingString)

  // Store in Supabase vector store
  const { error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 5,
  })

  if (error) {
    console.error("Error storing embedding:", error)
    throw error
  }

  return true
}

// Get real-time property data
export async function getRealTimePropertyData(propertyId: string) {
  try {
    // Get property details from database
    const supabase = createClient()
    const { data: property, error } = await supabase
      .from("real_estate_listings")
      .select("*")
      .eq("id", propertyId)
      .single()

    if (error || !property) {
      throw new Error("Property not found")
    }

    // Get property valuation from API
    const valuation = await getPropertyValuation(propertyId)

    // Get property investment analysis
    const analysis = await getPropertyAnalysis(propertyId)

    // Get neighborhood info
    const neighborhoodInfo = await getNeighborhoodInfo({
      city: property.city,
      state: property.state,
      zipCode: property.zip_code,
    })

    // Get market trends for the area
    const marketTrends = await fetchMarketTrends({
      region: property.city,
      months: 6,
    })

    // Get market insights for the area
    const marketInsights = await getMarketInsights({
      region: property.city,
    })

    return {
      property,
      valuation,
      analysis,
      neighborhoodInfo,
      marketTrends,
      marketInsights,
    }
  } catch (error) {
    console.error("Error getting real-time property data:", error)
    throw error
  }
}

// Run a CMA analysis for a property
export async function runCMAAnalysis(propertyId: string) {
  try {
    const result = await cmaToolTool.execute({
      propertyId,
      radius: 1,
      maxComps: 5,
    })

    return result
  } catch (error) {
    console.error("Error running CMA analysis:", error)
    throw error
  }
}

// Get investment opportunities in a region
export async function getInvestmentOpportunities(region: string, regionType?: string) {
  try {
    // Get opportunity zones
    const opportunityZones = await getOpportunityZones({ region, regionType })

    // Get market insights
    const marketInsights = await getMarketInsights({ region, regionType })

    // Run opportunity finder agent
    const opportunityAnalysis = await runAgent(
      "opportunity-finder",
      `Analyze investment opportunities in ${region}. Identify the best neighborhoods, property types, and investment strategies based on current market conditions.`,
    )

    return {
      opportunityZones,
      marketInsights,
      opportunityAnalysis,
    }
  } catch (error) {
    console.error("Error getting investment opportunities:", error)
    throw error
  }
}

// Generate investment strategy
export async function generateInvestmentStrategy(params: {
  region: string
  budget: number
  investmentGoals: string
  timeHorizon: string
  riskTolerance: string
}) {
  try {
    // Get market insights
    const marketInsights = await getMarketInsights({ region: params.region })

    // Get opportunity zones
    const opportunityZones = await getOpportunityZones({ region: params.region })

    // Run investment strategist agent
    const strategyPrompt = `
      Generate a comprehensive investment strategy for a real estate investor with the following parameters:
      - Region: ${params.region}
      - Budget: $${params.budget.toLocaleString()}
      - Investment Goals: ${params.investmentGoals}
      - Time Horizon: ${params.timeHorizon}
      - Risk Tolerance: ${params.riskTolerance}
      
      Provide specific recommendations on:
      1. Property types to target
      2. Neighborhoods to focus on
      3. Acquisition strategy
      4. Financing approach
      5. Exit strategy
      6. Risk mitigation measures
      7. Timeline for implementation
      
      Include specific, actionable steps the investor should take.
    `

    const investmentStrategy = await runAgent("investment-strategist", strategyPrompt)

    return {
      marketInsights,
      opportunityZones: opportunityZones.slice(0, 3), // Top 3 opportunity zones
      investmentStrategy,
    }
  } catch (error) {
    console.error("Error generating investment strategy:", error)
    throw error
  }
}
