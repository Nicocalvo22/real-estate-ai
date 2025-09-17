import { config } from "@/lib/config"
import { csvClient } from "./clients/csv-client"
import type { PropertyDetails, PropertyValuation, MarketTrend, NeighborhoodInfo, PropertySearchParams } from "./types"

// Cache implementation for API responses
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 15 // 15 minutes

function getCacheKey(method: string, params: any): string {
  return `${method}:${JSON.stringify(params)}`
}

function getFromCache<T>(key: string): T | null {
  if (!config.features.enableCaching) return null

  const cached = cache.get(key)
  if (!cached) return null

  const now = Date.now()
  if (now - cached.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }

  return cached.data as T
}

function setCache(key: string, data: any): void {
  if (!config.features.enableCaching) return
  cache.set(key, { data, timestamp: Date.now() })
}

// Fetch property listings from CSV
export async function fetchPropertyListings(params: PropertySearchParams): Promise<PropertyDetails[]> {
  const cacheKey = getCacheKey("fetchPropertyListings", params)
  const cached = getFromCache<PropertyDetails[]>(cacheKey)
  if (cached) return cached

  try {
    const results = await csvClient.searchProperties(params)
    setCache(cacheKey, results)
    return results
  } catch (error) {
    console.error("Error in fetchPropertyListings:", error)
    return []
  }
}

export async function fetchMarketTrends(params: {
  region?: string
  regionType?: "city" | "zip" | "state" | "neighborhood"
  months?: number
}): Promise<MarketTrend[]> {
  const cacheKey = getCacheKey("fetchMarketTrends", params)
  const cached = getFromCache<MarketTrend[]>(cacheKey)
  if (cached) return cached

  try {
    if (!params.region) return []

    const results = await csvClient.getMarketTrends({
      region: params.region,
      regionType: params.regionType,
      months: params.months,
    })

    setCache(cacheKey, results)
    return results
  } catch (error) {
    console.error("Error in fetchMarketTrends:", error)
    return []
  }
}

export async function getPropertyValuation(propertyId: string): Promise<PropertyValuation> {
  const cacheKey = getCacheKey("getPropertyValuation", { propertyId })
  const cached = getFromCache<PropertyValuation>(cacheKey)
  if (cached) return cached

  try {
    const valuation = await csvClient.getPropertyValuation(propertyId)
    setCache(cacheKey, valuation)
    return valuation
  } catch (error) {
    console.error("Error in getPropertyValuation:", error)
    throw error
  }
}

export async function getNeighborhoodInfo(params: {
  city: string
  state: string
  zipCode?: string
}): Promise<NeighborhoodInfo> {
  const cacheKey = getCacheKey("getNeighborhoodInfo", params)
  const cached = getFromCache<NeighborhoodInfo>(cacheKey)
  if (cached) return cached

  try {
    const result = await csvClient.getNeighborhoodInfo(params)
    setCache(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error in getNeighborhoodInfo:", error)
    throw error
  }
}

// CSV-specific utility methods
export function getPropertyCount(): number {
  return csvClient.getPropertyCount()
}

export function getAvailableLocations(): string[] {
  return csvClient.getAvailableLocations()
}

export function getPropertyTypes(): string[] {
  return csvClient.getPropertyTypes()
}

export function reloadCSVData(): void {
  csvClient.reloadData()
}

// Mock functions for backward compatibility with existing API structure
export async function getMarketInsights(params: {
  region: string
  regionType?: string
}) {
  // Generate mock insights based on CSV data
  const trends = await csvClient.getMarketTrends({
    region: params.region,
    regionType: params.regionType,
    months: 1
  })

  const currentTrend = trends[0] || {
    medianPrice: 450000,
    priceChangePct: 3.5,
    avgDaysOnMarket: 22,
    inventoryCount: 350
  }

  return {
    region: params.region,
    regionType: params.regionType || "city",
    period: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
    metrics: {
      medianPrice: currentTrend.medianPrice,
      priceChangePct: currentTrend.priceChangePct,
      avgDaysOnMarket: currentTrend.avgDaysOnMarket,
      inventoryCount: currentTrend.inventoryCount,
      salesVolume: Math.round(currentTrend.inventoryCount * 0.3),
      medianRentPrice: Math.round(currentTrend.medianPrice * 0.005),
      rentYield: 5.8,
      priceToRentRatio: 17.2,
      affordabilityIndex: 68,
      marketHeatIndex: 72,
    },
    forecast: {
      shortTerm: { priceChangePct: 1.2, confidence: 85 },
      mediumTerm: { priceChangePct: 3.8, confidence: 75 },
      longTerm: { priceChangePct: 12.5, confidence: 65 },
    },
  }
}

export async function getPropertyAnalysis(propertyId: string) {
  try {
    const property = await csvClient.getPropertyDetails(propertyId)

    return {
      propertyId,
      valuationScore: Math.floor(Math.random() * 30) + 70,
      investmentScore: Math.floor(Math.random() * 30) + 70,
      rentalScore: Math.floor(Math.random() * 30) + 70,
      appreciationScore: Math.floor(Math.random() * 30) + 70,
      cashFlowScore: Math.floor(Math.random() * 30) + 70,
      riskScore: Math.floor(Math.random() * 30) + 50,
      overallScore: Math.floor(Math.random() * 20) + 75,
      insights: [
        "Property is priced competitively based on local market data",
        "Location shows good fundamentals for long-term appreciation",
        "Property features align well with current market preferences",
        "Recent market activity suggests stable demand in this area",
      ],
      recommendations: [
        "Property appears to be a solid investment opportunity",
        "Consider rental strategy based on local market conditions",
        "Monitor local market trends for optimal timing",
        "Evaluate financing options to maximize returns",
      ],
      comparableProperties: [],
      financialMetrics: {
        estimatedValue: Math.round(property.price * 1.05),
        estimatedRent: Math.round(property.price * 0.005),
        capRate: 5.8,
        cashOnCashReturn: 8.2,
        grossRentMultiplier: 16.5,
        netOperatingIncome: Math.round(property.price * 0.005 * 12 * 0.7),
        operatingExpenseRatio: 0.3,
        debtServiceCoverageRatio: 1.5,
        breakEvenRatio: 0.85,
      },
    }
  } catch (error) {
    console.error("Error in getPropertyAnalysis:", error)
    throw error
  }
}

export async function getOpportunityZones(params: {
  region: string
  regionType?: string
}) {
  // Generate mock opportunity zones based on region
  return [
    {
      region: `${params.region} - Central`,
      regionType: params.regionType || "neighborhood",
      opportunityScore: 85,
      metrics: {
        medianPrice: 380000,
        priceChangePct: 4.2,
        avgDaysOnMarket: 18,
        inventoryCount: 45,
        rentalDemand: 88,
        jobGrowth: 3.5,
        populationGrowth: 2.8,
        incomeGrowth: 3.2,
        newDevelopment: 12,
        investorActivity: 75,
      },
      insights: [
        "Area showing strong growth fundamentals",
        "Good rental demand in the market",
        "Competitive property values",
        "Active investment community",
      ],
      recommendedPropertyTypes: ["Single-family", "Condos", "Multi-family"],
      riskFactors: ["Market volatility", "Economic factors"],
    }
  ]
}