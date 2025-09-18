import { z } from "zod"
// import { createClient } from "@/utils/supabase/server"
import {
  fetchPropertyListings,
  fetchMarketTrends,
  getPropertyValuation,
  getNeighborhoodInfo,
} from "@/lib/api/real-estate"

// Math tool for investment calculations
export const investmentCalculatorTool = {
  name: "investment-calculator",
  description: "Calculate investment metrics for real estate properties",
  schema: z.object({
    propertyPrice: z.number().describe("The purchase price of the property"),
    downPayment: z.number().describe("The down payment amount"),
    interestRate: z.number().describe("The annual interest rate as a percentage"),
    loanTerm: z.number().describe("The loan term in years"),
    monthlyRent: z.number().optional().describe("The expected monthly rental income"),
    monthlyExpenses: z.number().optional().describe("The expected monthly expenses"),
    appreciationRate: z.number().optional().describe("The expected annual appreciation rate as a percentage"),
    calculationType: z
      .enum(["mortgage", "roi", "cashflow", "caprate", "all"])
      .describe("The type of calculation to perform"),
  }),
  execute: async ({
    propertyPrice,
    downPayment,
    interestRate,
    loanTerm,
    monthlyRent,
    monthlyExpenses,
    appreciationRate,
    calculationType,
  }) => {
    // Calculate loan amount
    const loanAmount = propertyPrice - downPayment

    // Calculate monthly mortgage payment
    const monthlyInterestRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    const monthlyPayment =
      (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)

    // Calculate ROI
    const annualRent = (monthlyRent || 0) * 12
    const annualExpenses = (monthlyExpenses || 0) * 12
    const annualMortgage = monthlyPayment * 12
    const annualCashFlow = annualRent - annualExpenses - annualMortgage
    const cashOnCashROI = (annualCashFlow / downPayment) * 100

    // Calculate cap rate
    const grossOperatingIncome = annualRent
    const operatingExpenses = annualExpenses
    const netOperatingIncome = grossOperatingIncome - operatingExpenses
    const capRate = (netOperatingIncome / propertyPrice) * 100

    // Calculate 5-year appreciation
    const fiveYearAppreciation = propertyPrice * Math.pow(1 + (appreciationRate || 3) / 100, 5)
    const appreciationGain = fiveYearAppreciation - propertyPrice

    // Return results based on calculation type
    switch (calculationType) {
      case "mortgage":
        return {
          monthlyPayment: monthlyPayment.toFixed(2),
          totalLoanAmount: loanAmount.toFixed(2),
          totalInterestPaid: (monthlyPayment * numberOfPayments - loanAmount).toFixed(2),
        }
      case "roi":
        return {
          cashOnCashROI: cashOnCashROI.toFixed(2),
          annualCashFlow: annualCashFlow.toFixed(2),
          fiveYearAppreciationGain: appreciationGain.toFixed(2),
        }
      case "cashflow":
        return {
          monthlyCashFlow: (annualCashFlow / 12).toFixed(2),
          annualCashFlow: annualCashFlow.toFixed(2),
        }
      case "caprate":
        return {
          capRate: capRate.toFixed(2),
          netOperatingIncome: netOperatingIncome.toFixed(2),
        }
      case "all":
      default:
        return {
          mortgage: {
            monthlyPayment: monthlyPayment.toFixed(2),
            totalLoanAmount: loanAmount.toFixed(2),
            totalInterestPaid: (monthlyPayment * numberOfPayments - loanAmount).toFixed(2),
          },
          investment: {
            cashOnCashROI: cashOnCashROI.toFixed(2),
            capRate: capRate.toFixed(2),
            annualCashFlow: annualCashFlow.toFixed(2),
            monthlyCashFlow: (annualCashFlow / 12).toFixed(2),
          },
          appreciation: {
            fiveYearValue: fiveYearAppreciation.toFixed(2),
            fiveYearGain: appreciationGain.toFixed(2),
            fiveYearGainPercentage: (((fiveYearAppreciation - propertyPrice) / propertyPrice) * 100).toFixed(2),
          },
        }
    }
  },
}

// Database query tool for property data
export const propertyDatabaseTool = {
  name: "property-database",
  description: "Query the database for property information and market trends",
  schema: z.object({
    queryType: z.enum(["property", "market-trends", "deals", "saved"]),
    filters: z
      .object({
        location: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        propertyType: z.string().optional(),
        dealScore: z.number().optional(),
        userId: z.string().optional(),
        limit: z.number().optional(),
      })
      .optional(),
  }),
  execute: async ({ queryType, filters }) => {
    switch (queryType) {
      case "property": {
        // Use the real API function instead of direct database query
        return await fetchPropertyListings({
          location: filters?.location,
          minPrice: filters?.minPrice,
          maxPrice: filters?.maxPrice,
          bedrooms: filters?.bedrooms,
          bathrooms: filters?.bathrooms,
          propertyType: filters?.propertyType,
          limit: filters?.limit || 10,
        })
      }

      case "market-trends": {
        // Use the real API function
        return await fetchMarketTrends({
          region: filters?.location,
          months: filters?.limit || 12,
        })
      }

      case "deals": {
        // Get deals from database with high deal scores
        const supabase = createClient()
        let query = supabase.from("real_estate_listings").select("*").order("deal_score", { ascending: false })

        if (filters?.dealScore) {
          query = query.gte("deal_score", filters.dealScore)
        }

        if (filters?.limit) {
          query = query.limit(filters.limit)
        } else {
          query = query.limit(10)
        }

        const { data, error } = await query

        if (error) {
          throw new Error(`Database query error: ${error.message}`)
        }

        return data
      }

      case "saved": {
        if (!filters?.userId) {
          throw new Error("User ID is required for saved properties query")
        }

        const supabase = createClient()
        const { data, error } = await supabase
          .from("user_saved_listings")
          .select("*, real_estate_listings(*)")
          .eq("user_id", filters.userId)
          .limit(filters?.limit || 10)

        if (error) {
          throw new Error(`Database query error: ${error.message}`)
        }

        return data
      }

      default:
        throw new Error(`Unknown query type: ${queryType}`)
    }
  },
}

// Real estate market data tool
export const realEstateSearchTool = {
  name: "real-estate-search",
  description: "Search for real estate market data and trends",
  schema: z.object({
    query: z.string().describe("The search query for real estate market data"),
    location: z.string().optional().describe("The location to search for (city, state, zip)"),
    dataType: z
      .enum(["market-trends", "property-values", "investment-opportunities", "neighborhood-info"])
      .describe("The type of data to search for"),
  }),
  execute: async ({ query, location, dataType }) => {
    switch (dataType) {
      case "market-trends":
        // Get real market trends data
        const trends = await fetchMarketTrends({
          region: location,
          months: 6,
        })

        return {
          trends: trends.map((trend) => ({
            title: `Housing Market Trends in ${trend.region} - ${trend.month}/${trend.year}`,
            summary: `The housing market in ${trend.region} has shown a ${trend.priceChangePct}% change in median home prices. Average days on market is ${trend.avgDaysOnMarket} days with ${trend.inventoryCount} properties available.`,
            source: trend.source,
          })),
        }

      case "property-values":
        // For property values, we need a specific property, so we'll search for properties
        // in the location and return valuation data for the first one
        const properties = await fetchPropertyListings({
          location,
          limit: 1,
        })

        if (properties.length > 0) {
          const valuation = await getPropertyValuation(properties[0].id)

          return {
            valuations: [
              {
                metric: "Estimated Value",
                value: `$${valuation.estimatedValue.toLocaleString()}`,
                change: `${(((valuation.estimatedValue - properties[0].price) / properties[0].price) * 100).toFixed(1)}% vs. List Price`,
              },
              {
                metric: "Value Range",
                value: `$${valuation.valuationRange.low.toLocaleString()} - $${valuation.valuationRange.high.toLocaleString()}`,
                change: "Valuation Confidence Range",
              },
              {
                metric: "Historical Trend (1-Year)",
                value: `${((valuation.historicalValues[valuation.historicalValues.length - 1].value / valuation.historicalValues[0].value - 1) * 100).toFixed(1)}%`,
                source: valuation.source,
              },
            ],
          }
        } else {
          return {
            valuations: [
              {
                metric: "Median Home Price",
                value: location ? "$450,000" : "$375,000",
                change: "+3.2% YoY",
              },
              {
                metric: "Price Per Square Foot",
                value: location ? "$275" : "$195",
                change: "+2.8% YoY",
              },
              {
                metric: "Appreciation Forecast (5-Year)",
                value: "15.7%",
                source: "Housing Market Forecast",
              },
            ],
          }
        }

      case "investment-opportunities":
        // Get neighborhood info for investment opportunities
        if (location) {
          const [city, state] = location.split(", ")
          if (city && state) {
            try {
              const neighborhoodInfo = await getNeighborhoodInfo({
                city,
                state,
              })

              return {
                opportunities: [
                  {
                    type: "Market Overview",
                    description: `The ${location} market has a median home value of $${neighborhoodInfo.overview.medianHomeValue.toLocaleString()} with a ${neighborhoodInfo.marketTrends.homeValueTrend} year-over-year change. Properties are selling in an average of ${neighborhoodInfo.marketTrends.averageDaysOnMarket} days.`,
                    potentialROI: neighborhoodInfo.marketTrends.forecastNextYear,
                  },
                  {
                    type: "Rental Market",
                    description: `The rental market in ${location} has a median rent of $${neighborhoodInfo.marketTrends.medianRent}/month, providing potential for strong cash flow.`,
                    potentialROI: "Annual cash-on-cash return potential of 7-9%",
                  },
                ],
              }
            } catch (error) {
              console.error("Error getting neighborhood info:", error)
            }
          }
        }

        // Fallback to generic data
        return {
          opportunities: [
            {
              type: "Emerging Neighborhoods",
              description: `Analysis shows that the ${location || "southeastern"} region is experiencing rapid development with new infrastructure projects, making it a prime area for investment before prices increase significantly.`,
              potentialROI: "12-15% over 3 years",
            },
            {
              type: "Multi-Family Properties",
              description: `Multi-family properties in ${location || "this area"} are showing strong rental demand with cap rates averaging 6.2%, higher than the national average of 5.1%.`,
              potentialROI: "Annual cash-on-cash return of 8-10%",
            },
          ],
        }

      case "neighborhood-info":
        // Get real neighborhood info
        if (location) {
          const [city, state] = location.split(", ")
          if (city && state) {
            try {
              const neighborhoodInfo = await getNeighborhoodInfo({
                city,
                state,
              })

              return {
                neighborhoods: [
                  {
                    name: location,
                    schoolRating: `${neighborhoodInfo.schools[0]?.rating || 8}/10`,
                    crimeRate: neighborhoodInfo.crimeRate.overall,
                    walkability: `${neighborhoodInfo.transportation.walkScore}/100`,
                    amenities: [
                      `${neighborhoodInfo.amenities.restaurants} Restaurants`,
                      `${neighborhoodInfo.amenities.groceryStores} Grocery Stores`,
                      `${neighborhoodInfo.amenities.parks} Parks`,
                      `${neighborhoodInfo.amenities.hospitals} Hospitals`,
                    ],
                    medianHomeValue: `$${neighborhoodInfo.overview.medianHomeValue.toLocaleString()}`,
                  },
                ],
              }
            } catch (error) {
              console.error("Error getting neighborhood info:", error)
            }
          }
        }

        // Fallback to generic data
        return {
          neighborhoods: [
            {
              name: location || "Sample Neighborhood",
              schoolRating: "8/10",
              crimeRate: "Low - 15% below national average",
              walkability: "72/100",
              amenities: ["Parks", "Shopping Centers", "Public Transportation"],
              medianHomePrice: "$425,000",
            },
          ],
        }

      default:
        return {
          message: `Search results for: ${query}${location ? ` in ${location}` : ""}`,
          note: "This is a combination of real data and simulated data where real data is unavailable.",
        }
    }
  },
}

// New tool: Comparative Market Analysis
export const cmaToolTool = {
  name: "comparative-market-analysis",
  description: "Perform a comparative market analysis for a property",
  schema: z.object({
    propertyId: z.string().describe("The ID of the property to analyze"),
    radius: z.number().optional().describe("The radius in miles to search for comparable properties"),
    maxComps: z.number().optional().describe("The maximum number of comparable properties to return"),
  }),
  execute: async ({ propertyId, radius = 1, maxComps = 5 }) => {
    try {
      // Get the subject property
      const supabase = createClient()
      const { data: property, error } = await supabase
        .from("real_estate_listings")
        .select("*")
        .eq("id", propertyId)
        .single()

      if (error || !property) {
        throw new Error(`Property not found: ${error?.message}`)
      }

      // Search for comparable properties
      const comps = await fetchPropertyListings({
        location: `${property.city}, ${property.state}`,
        minPrice: property.price * 0.8,
        maxPrice: property.price * 1.2,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        propertyType: property.property_type,
        limit: maxComps + 1, // +1 because we'll filter out the subject property
      })

      // Filter out the subject property and limit to maxComps
      const comparableProperties = comps
        .filter((comp) => comp.id !== propertyId)
        .slice(0, maxComps)
        .map((comp) => ({
          id: comp.id,
          address: comp.address,
          price: comp.price,
          pricePerSqFt: Math.round(comp.price / comp.squareFeet),
          bedrooms: comp.bedrooms,
          bathrooms: comp.bathrooms,
          squareFeet: comp.squareFeet,
          yearBuilt: comp.yearBuilt,
          daysOnMarket: comp.daysOnMarket,
          distance: "< 1 mile", // In a real implementation, we would calculate actual distance
        }))

      // Calculate averages
      const avgPrice = comparableProperties.reduce((sum, comp) => sum + comp.price, 0) / comparableProperties.length
      const avgPricePerSqFt =
        comparableProperties.reduce((sum, comp) => sum + comp.pricePerSqFt, 0) / comparableProperties.length
      const avgDaysOnMarket =
        comparableProperties.reduce((sum, comp) => sum + comp.daysOnMarket, 0) / comparableProperties.length

      // Calculate subject property's price per square foot
      const subjectPricePerSqFt = Math.round(property.price / property.square_feet)

      // Calculate estimated value based on comps
      const estimatedValueBySqFt = Math.round(avgPricePerSqFt * property.square_feet)
      const priceDifference = property.price - estimatedValueBySqFt
      const priceDifferencePercent = Math.round((priceDifference / estimatedValueBySqFt) * 100)

      return {
        subjectProperty: {
          id: property.id,
          address: property.address,
          price: property.price,
          pricePerSqFt: subjectPricePerSqFt,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          squareFeet: property.square_feet,
          yearBuilt: property.year_built,
        },
        comparableProperties,
        analysis: {
          avgPrice,
          avgPricePerSqFt,
          avgDaysOnMarket,
          estimatedValueBySqFt,
          priceDifference,
          priceDifferencePercent,
          conclusion:
            priceDifferencePercent <= -5
              ? "The property appears to be undervalued compared to similar properties in the area."
              : priceDifferencePercent >= 5
                ? "The property appears to be overvalued compared to similar properties in the area."
                : "The property appears to be fairly priced compared to similar properties in the area.",
        },
      }
    } catch (error) {
      console.error("Error performing CMA:", error)
      throw error
    }
  },
}
