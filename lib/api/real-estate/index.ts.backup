import { config } from "@/lib/config"
import { createClient } from "@/utils/supabase/server"
import { zillowClient } from "./clients/zillow"
import { redfinClient } from "./clients/redfin"
import { mlsClient } from "./clients/mls"
import {
  repliersClient,
  type RepliersMarketInsight,
  type RepliersPropertyAnalysis,
  type RepliersOpportunityZone,
} from "./clients/repliers"
import type { PropertyDetails, PropertyValuation, MarketTrend, NeighborhoodInfo, PropertySearchParams } from "./types"

// Re-export Repliers types
export type { RepliersMarketInsight, RepliersPropertyAnalysis, RepliersOpportunityZone }

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

// Fetch property listings from real APIs or database
export async function fetchPropertyListings(params: PropertySearchParams): Promise<PropertyDetails[]> {
  const cacheKey = getCacheKey("fetchPropertyListings", params)
  const cached = getFromCache<PropertyDetails[]>(cacheKey)
  if (cached) return cached

  try {
    if (config.features.useRealApis) {
      // Try to fetch from real APIs
      try {
        // Try Repliers first (our new API)
        if (config.repliers.apiKey) {
          const results = await repliersClient.searchProperties(params)
          if (results.length > 0) {
            setCache(cacheKey, results)
            return results
          }
        }

        // Try Redfin next
        if (config.redfin.apiKey) {
          const results = await redfinClient.searchProperties(params)
          if (results.length > 0) {
            setCache(cacheKey, results)
            return results
          }
        }

        // Try Zillow next
        if (config.zillow.apiKey) {
          const results = await zillowClient.searchProperties(params)
          if (results.length > 0) {
            setCache(cacheKey, results)
            return results
          }
        }

        // Try MLS last
        if (config.mls.apiKey) {
          const results = await mlsClient.searchProperties(params)
          if (results.length > 0) {
            setCache(cacheKey, results)
            return results
          }
        }
      } catch (error) {
        console.error("Error fetching from real estate APIs:", error)
        // Fall back to database if API calls fail
      }
    }

    // Fall back to database
    const supabase = createClient()
    let query = supabase.from("real_estate_listings").select("*")

    if (params.location) {
      query = query.or(
        `city.ilike.%${params.location}%,state.ilike.%${params.location}%,zip_code.ilike.%${params.location}%`,
      )
    }
    if (params.minPrice) {
      query = query.gte("price", params.minPrice)
    }
    if (params.maxPrice) {
      query = query.lte("price", params.maxPrice)
    }
    if (params.bedrooms) {
      query = query.gte("bedrooms", params.bedrooms)
    }
    if (params.bathrooms) {
      query = query.gte("bathrooms", params.bathrooms)
    }
    if (params.propertyType) {
      query = query.eq("property_type", params.propertyType)
    }

    query = query.limit(params.limit || 10)

    const { data, error } = await query

    if (error) {
      console.error("Error fetching property listings:", error)
      return []
    }

    // Transform database results to PropertyDetails format
    const results = data.map((item) => ({
      id: item.id,
      address: item.address,
      city: item.city,
      state: item.state,
      zipCode: item.zip_code,
      price: item.price,
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      squareFeet: item.square_feet,
      yearBuilt: item.year_built,
      propertyType: item.property_type,
      listingStatus: item.listing_status,
      description:
        "Beautiful property in a desirable neighborhood with modern amenities and convenient access to shopping and dining.",
      features: ["Central Air", "Garage", "Fireplace", "Updated Kitchen", "Hardwood Floors"],
      images: [item.image_url || `/placeholder.svg?height=400&width=600`],
      daysOnMarket: Math.floor(Math.random() * 60) + 1,
      listingDate: new Date(Date.now() - (Math.floor(Math.random() * 60) + 1) * 24 * 60 * 60 * 1000).toISOString(),
      source: "internal" as const,
    }))

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
    if (config.features.useRealApis) {
      try {
        // Try Repliers first (our new API)
        if (config.repliers.apiKey && params.region) {
          const results = await repliersClient.getMarketTrends({
            region: params.region,
            regionType: params.regionType,
            months: params.months,
          })

          if (results.length > 0) {
            setCache(cacheKey, results)
            return results
          }
        }

        // Try Redfin next
        if (config.redfin.apiKey && params.region) {
          const results = await redfinClient.getMarketTrends({
            region: params.region,
            regionType: params.regionType,
            months: params.months,
          })

          if (results.length > 0) {
            setCache(cacheKey, results)
            return results
          }
        }
      } catch (error) {
        console.error("Error fetching market trends from APIs:", error)
        // Fall back to database
      }
    }

    // Fall back to database
    const supabase = createClient()
    let query = supabase.from("market_trends").select("*")

    if (params.region) {
      query = query.ilike("region", `%${params.region}%`)
    }

    if (params.regionType) {
      query = query.eq("region_type", params.regionType)
    }

    query = query.order("created_at", { ascending: false })
    query = query.limit(params.months || 12)

    const { data, error } = await query

    if (error) {
      console.error("Error fetching market trends:", error)
      return []
    }

    // Transform database results to MarketTrend format
    const results = data.map((item) => ({
      region: item.region,
      regionType: item.region_type,
      medianPrice: item.median_price,
      priceChangePct: item.price_change_pct,
      avgDaysOnMarket: item.avg_days_on_market,
      inventoryCount: item.inventory_count,
      month: item.month,
      year: item.year,
      source: "internal" as const,
    }))

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
    // First get property details from database to get address
    const supabase = createClient()
    const { data: property, error } = await supabase
      .from("real_estate_listings")
      .select("*")
      .eq("id", propertyId)
      .single()

    if (error || !property) {
      console.error("Error fetching property:", error)
      throw new Error("Property not found")
    }

    // Try to get valuation from Repliers API first
    if (config.features.useRealApis && config.repliers.apiKey) {
      try {
        const valuation = await repliersClient.getPropertyValuation(propertyId)
        setCache(cacheKey, valuation)
        return valuation
      } catch (error) {
        console.error("Error fetching property valuation from Repliers:", error)
        // Fall back to Zillow or generated data
      }
    }

    // Try to get valuation from Zillow API
    if (config.features.useRealApis && config.zillow.apiKey) {
      try {
        const valuation = await zillowClient.getPropertyValuation(property.address, property.zip_code)
        setCache(cacheKey, valuation)
        return valuation
      } catch (error) {
        console.error("Error fetching property valuation from Zillow:", error)
        // Fall back to generated data
      }
    }

    // Generate mock valuation data if API calls fail or are disabled
    const baseValue = property.price
    const historicalMonths = 12
    const historicalValues = []

    // Generate historical values with some random fluctuation
    for (let i = historicalMonths; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)

      // Random fluctuation between -2% and +2% month-to-month
      const fluctuation = 1 + (Math.random() * 4 - 2) / 100

      // Cumulative growth of about 3-5% annually
      const growthFactor = 1 + ((5 / 12) * (historicalMonths - i)) / 100

      const value = Math.round(baseValue * fluctuation * growthFactor)

      historicalValues.push({
        date: date.toISOString().split("T")[0],
        value,
      })
    }

    const result = {
      propertyId,
      estimatedValue: Math.round(baseValue * 1.02), // Slightly higher than listing price
      valuationRange: {
        low: Math.round(baseValue * 0.95),
        high: Math.round(baseValue * 1.08),
      },
      lastUpdated: new Date().toISOString(),
      historicalValues,
      source: "internal" as const,
    }

    setCache(cacheKey, result)
    return result
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
    // Try to get neighborhood info from Repliers API first
    if (config.features.useRealApis && config.repliers.apiKey) {
      try {
        const data = await repliersClient.getNeighborhoodInfo(params)

        if (data) {
          setCache(cacheKey, data)
          return data
        }
      } catch (error) {
        console.error("Error fetching neighborhood info from Repliers:", error)
        // Fall back to Redfin or mock data
      }
    }

    // Try to get neighborhood info from Redfin API
    if (config.features.useRealApis && config.redfin.apiKey) {
      try {
        const data = await redfinClient.getNeighborhoodInfo(params)

        if (data) {
          const result: NeighborhoodInfo = {
            overview: {
              population: data.overview?.population || 45000,
              medianIncome: data.overview?.medianIncome || 85000,
              medianHomeValue: data.overview?.medianHomeValue || 450000,
              costOfLivingIndex: data.overview?.costOfLivingIndex || 110,
            },
            schools:
              data.schools?.map((school: any) => ({
                name: school.name,
                type: school.type,
                grades: school.grades,
                rating: school.rating,
                distance: school.distance,
              })) || [],
            amenities: {
              restaurants: data.amenities?.restaurants || 42,
              groceryStores: data.amenities?.groceryStores || 8,
              parks: data.amenities?.parks || 5,
              gyms: data.amenities?.gyms || 6,
              hospitals: data.amenities?.hospitals || 2,
            },
            transportation: {
              walkScore: data.transportation?.walkScore || 72,
              transitScore: data.transportation?.transitScore || 65,
              bikeScore: data.transportation?.bikeScore || 68,
              averageCommute: data.transportation?.averageCommute || 28,
            },
            crimeRate: {
              overall: data.crimeRate?.overall || "Low",
              violent: data.crimeRate?.violent || "Very Low",
              property: data.crimeRate?.property || "Low",
              comparedToNational: data.crimeRate?.comparedToNational || "-15%",
            },
            marketTrends: {
              homeValueTrend: data.marketTrends?.homeValueTrend || "+4.2% YoY",
              forecastNextYear: data.marketTrends?.forecastNextYear || "+3.8%",
              averageDaysOnMarket: data.marketTrends?.averageDaysOnMarket || 18,
              medianRent: data.marketTrends?.medianRent || 2200,
            },
          }

          setCache(cacheKey, result)
          return result
        }
      } catch (error) {
        console.error("Error fetching neighborhood info from Redfin:", error)
        // Fall back to mock data
      }
    }

    // Return mock data if API call fails or is disabled
    const result: NeighborhoodInfo = {
      overview: {
        population: 45000,
        medianIncome: 85000,
        medianHomeValue: 450000,
        costOfLivingIndex: 110, // 100 is national average
      },
      schools: [
        {
          name: "Washington Elementary",
          type: "Public",
          grades: "K-5",
          rating: 8.5,
          distance: 0.8,
        },
        {
          name: "Lincoln Middle School",
          type: "Public",
          grades: "6-8",
          rating: 7.9,
          distance: 1.2,
        },
        {
          name: "Roosevelt High School",
          type: "Public",
          grades: "9-12",
          rating: 8.2,
          distance: 1.5,
        },
      ],
      amenities: {
        restaurants: 42,
        groceryStores: 8,
        parks: 5,
        gyms: 6,
        hospitals: 2,
      },
      transportation: {
        walkScore: 72,
        transitScore: 65,
        bikeScore: 68,
        averageCommute: 28, // minutes
      },
      crimeRate: {
        overall: "Low",
        violent: "Very Low",
        property: "Low",
        comparedToNational: "-15%", // 15% below national average
      },
      marketTrends: {
        homeValueTrend: "+4.2% YoY",
        forecastNextYear: "+3.8%",
        averageDaysOnMarket: 18,
        medianRent: 2200,
      },
    }

    setCache(cacheKey, result)
    return result
  } catch (error) {
    console.error("Error in getNeighborhoodInfo:", error)
    throw error
  }
}

// Repliers-specific API methods

export async function getMarketInsights(params: {
  region: string
  regionType?: string
}): Promise<RepliersMarketInsight> {
  const cacheKey = getCacheKey("getMarketInsights", params)
  const cached = getFromCache<RepliersMarketInsight>(cacheKey)
  if (cached) return cached

  try {
    if (config.features.useRealApis && config.repliers.apiKey) {
      const insights = await repliersClient.getMarketInsights(params)
      setCache(cacheKey, insights)
      return insights
    } else {
      // Return mock data if API is not available
      const mockInsights: RepliersMarketInsight = {
        region: params.region,
        regionType: params.regionType || "city",
        period: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
        metrics: {
          medianPrice: 450000,
          priceChangePct: 3.5,
          avgDaysOnMarket: 22,
          inventoryCount: 350,
          salesVolume: 120,
          medianRentPrice: 2200,
          rentYield: 5.8,
          priceToRentRatio: 17.2,
          affordabilityIndex: 68,
          marketHeatIndex: 72,
        },
        forecast: {
          shortTerm: {
            priceChangePct: 1.2,
            confidence: 85,
          },
          mediumTerm: {
            priceChangePct: 3.8,
            confidence: 75,
          },
          longTerm: {
            priceChangePct: 12.5,
            confidence: 65,
          },
        },
      }
      setCache(cacheKey, mockInsights)
      return mockInsights
    }
  } catch (error) {
    console.error("Error in getMarketInsights:", error)
    throw error
  }
}

export async function getPropertyAnalysis(propertyId: string): Promise<RepliersPropertyAnalysis> {
  const cacheKey = getCacheKey("getPropertyAnalysis", { propertyId })
  const cached = getFromCache<RepliersPropertyAnalysis>(cacheKey)
  if (cached) return cached

  try {
    if (config.features.useRealApis && config.repliers.apiKey) {
      const analysis = await repliersClient.getPropertyAnalysis(propertyId)
      setCache(cacheKey, analysis)
      return analysis
    } else {
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

      // Generate mock analysis
      const mockAnalysis: RepliersPropertyAnalysis = {
        propertyId,
        valuationScore: Math.floor(Math.random() * 30) + 70, // 70-100
        investmentScore: Math.floor(Math.random() * 30) + 70, // 70-100
        rentalScore: Math.floor(Math.random() * 30) + 70, // 70-100
        appreciationScore: Math.floor(Math.random() * 30) + 70, // 70-100
        cashFlowScore: Math.floor(Math.random() * 30) + 70, // 70-100
        riskScore: Math.floor(Math.random() * 30) + 50, // 50-80
        overallScore: Math.floor(Math.random() * 20) + 75, // 75-95
        insights: [
          "Property is priced below market value by approximately 5-8%",
          "Location shows strong appreciation potential over the next 5 years",
          "Rental demand in this area is consistently high with low vacancy rates",
          "Property features align well with current market preferences",
          "Recent infrastructure improvements nearby are likely to increase property value",
        ],
        recommendations: [
          "Consider making an offer at or slightly below asking price",
          "Rental strategy would yield positive cash flow with current market rates",
          "Minor cosmetic upgrades could significantly increase rental income",
          "Hold for at least 5 years to maximize appreciation potential",
          "Consider refinancing options after 2 years to improve cash flow",
        ],
        comparableProperties: [
          {
            id: "comp1",
            address: `${Math.floor(Math.random() * 9999)} ${property.address.split(" ")[1]} St`,
            price: Math.round(property.price * 0.95),
            pricePerSqFt: Math.round((property.price * 0.95) / property.square_feet),
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            squareFeet: property.square_feet - 100,
            yearBuilt: property.year_built - 2,
            distance: 0.3,
            similarity: 92,
          },
          {
            id: "comp2",
            address: `${Math.floor(Math.random() * 9999)} ${property.address.split(" ")[1]} Ave`,
            price: Math.round(property.price * 1.05),
            pricePerSqFt: Math.round((property.price * 1.05) / (property.square_feet + 150)),
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms + 0.5,
            squareFeet: property.square_feet + 150,
            yearBuilt: property.year_built + 3,
            distance: 0.5,
            similarity: 88,
          },
          {
            id: "comp3",
            address: `${Math.floor(Math.random() * 9999)} ${property.address.split(" ")[1]} Dr`,
            price: Math.round(property.price * 1.02),
            pricePerSqFt: Math.round((property.price * 1.02) / (property.square_feet + 50)),
            bedrooms: property.bedrooms + 1,
            bathrooms: property.bathrooms,
            squareFeet: property.square_feet + 50,
            yearBuilt: property.year_built - 1,
            distance: 0.7,
            similarity: 85,
          },
        ],
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
      setCache(cacheKey, mockAnalysis)
      return mockAnalysis
    }
  } catch (error) {
    console.error("Error in getPropertyAnalysis:", error)
    throw error
  }
}

export async function getOpportunityZones(params: {
  region: string
  regionType?: string
}): Promise<RepliersOpportunityZone[]> {
  const cacheKey = getCacheKey("getOpportunityZones", params)
  const cached = getFromCache<RepliersOpportunityZone[]>(cacheKey)
  if (cached) return cached

  try {
    if (config.features.useRealApis && config.repliers.apiKey) {
      const zones = await repliersClient.getOpportunityZones(params)
      setCache(cacheKey, zones)
      return zones
    } else {
      // Return mock data if API is not available
      const mockZones: RepliersOpportunityZone[] = [
        {
          region: `${params.region} - Downtown`,
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
            "Area is experiencing rapid gentrification with new businesses opening",
            "Public transportation improvements planned for next year",
            "Strong rental demand from young professionals",
            "Low inventory creating competitive buying environment",
            "Multiple mixed-use developments in planning stages",
          ],
          recommendedPropertyTypes: ["Multi-family", "Condos", "Mixed-use"],
          riskFactors: ["Potential for property tax increases", "Some areas still in early stages of revitalization"],
        },
        {
          region: `${params.region} - Westside`,
          regionType: params.regionType || "neighborhood",
          opportunityScore: 78,
          metrics: {
            medianPrice: 420000,
            priceChangePct: 3.8,
            avgDaysOnMarket: 22,
            inventoryCount: 65,
            rentalDemand: 82,
            jobGrowth: 2.9,
            populationGrowth: 2.2,
            incomeGrowth: 3.5,
            newDevelopment: 8,
            investorActivity: 68,
          },
          insights: [
            "Established neighborhood with strong school district",
            "New commercial corridor developing along main avenue",
            "Steady appreciation with minimal volatility",
            "Strong rental market for single-family homes",
            "Aging housing stock creating renovation opportunities",
          ],
          recommendedPropertyTypes: ["Single-family", "Townhomes", "Small multi-family"],
          riskFactors: ["Higher entry prices", "Some infrastructure needs updating"],
        },
        {
          region: `${params.region} - Eastside`,
          regionType: params.regionType || "neighborhood",
          opportunityScore: 92,
          metrics: {
            medianPrice: 310000,
            priceChangePct: 5.5,
            avgDaysOnMarket: 15,
            inventoryCount: 32,
            rentalDemand: 92,
            jobGrowth: 4.2,
            populationGrowth: 3.5,
            incomeGrowth: 3.8,
            newDevelopment: 18,
            investorActivity: 85,
          },
          insights: [
            "Rapidly developing area with significant public investment",
            "New tech campus bringing high-paying jobs to the area",
            "Multiple new apartment complexes under construction",
            "Excellent price-to-rent ratios for investors",
            "Strong potential for appreciation over next 5 years",
          ],
          recommendedPropertyTypes: ["Multi-family", "New construction", "Fix-and-flip opportunities"],
          riskFactors: ["Rapid changes may lead to market volatility", "Some areas still have higher crime rates"],
        },
      ]
      setCache(cacheKey, mockZones)
      return mockZones
    }
  } catch (error) {
    console.error("Error in getOpportunityZones:", error)
    throw error
  }
}
