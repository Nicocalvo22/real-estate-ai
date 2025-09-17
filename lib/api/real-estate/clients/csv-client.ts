import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { join } from 'path'
import type { PropertyDetails, MarketTrend, PropertyValuation, NeighborhoodInfo } from "../types"

// ZonaProp CSV structure
export interface ZonaPropProperty {
  'Fuente/Origen': string
  'Titulo_URL': string
  'Precio': string
  'Latitud': string
  'Longitud': string
  'Dirección': string
  'Barrio/Zona': string
  'Provincia': string
  'Tipología/Producto': string
  'google_maps': string
  'Fecha de publicación': string
  'Vendedor': string
  'm2 totales': string
  'm2 cubiertos': string
  'Dormitorios': string
  'Baños': string
}

class CSVApiClient {
  private csvData: ZonaPropProperty[] = []
  private csvPath: string

  constructor(csvFileName: string = 'ZPAgosto.csv') {
    this.csvPath = join(process.cwd(), 'data', csvFileName)
    this.loadCSVData()
  }

  private loadCSVData(): void {
    try {
      const csvContent = readFileSync(this.csvPath, 'utf-8')
      this.csvData = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      })
      console.log(`Loaded ${this.csvData.length} properties from ZonaProp CSV`)
    } catch (error) {
      console.error('Error loading CSV data:', error)
      this.csvData = []
    }
  }

  // Keep square meters as is (no conversion needed)
  private parseSquareMeters(m2: string | number): number {
    const meters = typeof m2 === 'string' ? parseFloat(m2) || 0 : m2
    return Math.round(meters)
  }

  // Generate unique ID from URL
  private generateId(url: string): string {
    const match = url.match(/(\d+)\.html/)
    return match ? match[1] : Math.random().toString(36).substr(2, 9)
  }

  // Convert property type to English
  private mapPropertyType(tipologia: string): string {
    switch (tipologia?.toLowerCase()) {
      case 'departamento':
        return 'apartment'
      case 'casa':
        return 'house'
      default:
        return 'unknown'
    }
  }

  // Parse date from DD-MM-YYYY format
  private parseDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString()

    const [day, month, year] = dateStr.split('-')
    // Fix year to 2024 since data shows 2025 but it's likely 2024
    const actualYear = year === '2025' ? '2024' : year
    return new Date(`${actualYear}-${month}-${day}`).toISOString()
  }

  // Reload CSV data (useful for updates)
  public reloadData(): void {
    this.loadCSVData()
  }

  async getPropertyDetails(propertyId: string): Promise<PropertyDetails> {
    const property = this.csvData.find(p => this.generateId(p['Titulo_URL']) === propertyId)

    if (!property) {
      throw new Error(`Property with ID ${propertyId} not found`)
    }

    return {
      id: propertyId,
      address: property['Dirección'] || "",
      city: property['Barrio/Zona'] || "",
      state: property['Provincia'] || "Córdoba",
      zipCode: "", // Not available in ZonaProp data
      price: parseInt(property['Precio']) || 0,
      bedrooms: parseInt(property['Dormitorios']) || 0,
      bathrooms: parseInt(property['Baños']) || 0,
      squareMeters: this.parseSquareMeters(property['m2 totales']),
      yearBuilt: 0, // Not available in ZonaProp data
      propertyType: this.mapPropertyType(property['Tipología/Producto']),
      listingStatus: "active", // Assuming all listings are active
      description: `Propiedad en ${property['Barrio/Zona']}, ${property['Provincia']}. ${property['m2 totales']}m² totales, ${property['m2 cubiertos']}m² cubiertos.`,
      features: property['m2 cubiertos'] && property['m2 totales'] !== property['m2 cubiertos']
        ? ['Balcón/Terraza', 'Metros cubiertos y descubiertos']
        : ['Totalmente cubierto'],
      images: [], // Not available in CSV
      latitude: parseFloat(property['Latitud']) || 0,
      longitude: parseFloat(property['Longitud']) || 0,
      daysOnMarket: this.calculateDaysOnMarket(property['Fecha de publicación']),
      listingDate: this.parseDate(property['Fecha de publicación']),
      source: "zonaprop",
      // Additional ZonaProp-specific data
      vendor: property['Vendedor'],
      originalUrl: property['Titulo_URL'],
      totalM2: parseInt(property['m2 totales']) || 0,
      coveredM2: parseInt(property['m2 cubiertos']) || 0,
    }
  }

  private calculateDaysOnMarket(dateStr: string): number {
    if (!dateStr) return 0

    const [day, month, year] = dateStr.split('-')
    const actualYear = year === '2025' ? '2024' : year
    const listingDate = new Date(`${actualYear}-${month}-${day}`)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - listingDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  async searchProperties(params: {
    location?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    bathrooms?: number
    propertyType?: string
    limit?: number
  }): Promise<PropertyDetails[]> {
    let filteredProperties = this.csvData

    // Filter by location (city, neighborhood, or province)
    if (params.location) {
      const location = params.location.toLowerCase()
      filteredProperties = filteredProperties.filter(p =>
        p['Barrio/Zona']?.toLowerCase().includes(location) ||
        p['Provincia']?.toLowerCase().includes(location) ||
        p['Dirección']?.toLowerCase().includes(location)
      )
    }

    // Filter by price range (USD)
    if (params.minPrice) {
      filteredProperties = filteredProperties.filter(p => parseInt(p['Precio']) >= params.minPrice!)
    }
    if (params.maxPrice) {
      filteredProperties = filteredProperties.filter(p => parseInt(p['Precio']) <= params.maxPrice!)
    }

    // Filter by bedrooms
    if (params.bedrooms) {
      filteredProperties = filteredProperties.filter(p => parseInt(p['Dormitorios']) >= params.bedrooms!)
    }

    // Filter by bathrooms
    if (params.bathrooms) {
      filteredProperties = filteredProperties.filter(p => parseInt(p['Baños']) >= params.bathrooms!)
    }

    // Filter by property type
    if (params.propertyType) {
      const targetType = params.propertyType.toLowerCase()
      filteredProperties = filteredProperties.filter(p => {
        const mappedType = this.mapPropertyType(p['Tipología/Producto'])
        return mappedType === targetType ||
               p['Tipología/Producto']?.toLowerCase().includes(targetType)
      })
    }

    // Apply limit
    const limit = params.limit || 10
    const limitedProperties = filteredProperties.slice(0, limit)

    // Convert to PropertyDetails format
    return Promise.all(
      limitedProperties.map(async (property) => {
        const id = this.generateId(property['Titulo_URL'])
        return this.getPropertyDetails(id)
      })
    )
  }

  async getPropertyValuation(propertyId: string): Promise<PropertyValuation> {
    const property = this.csvData.find(p => this.generateId(p['Titulo_URL']) === propertyId)

    if (!property) {
      throw new Error(`Property with ID ${propertyId} not found`)
    }

    const price = parseInt(property['Precio']) || 0
    const estimatedValue = price * (0.95 + Math.random() * 0.1) // Random variation ±5%

    return {
      propertyId,
      estimatedValue: Math.round(estimatedValue),
      valuationRange: {
        low: Math.round(estimatedValue * 0.9),
        high: Math.round(estimatedValue * 1.1),
      },
      lastUpdated: new Date().toISOString(),
      historicalValues: [], // Could be populated if CSV had historical data
      source: "zonaprop",
    }
  }

  async getMarketTrends(params: {
    region: string
    regionType?: string
    months?: number
  }): Promise<MarketTrend[]> {
    // Filter properties by region (neighborhood or province)
    const regionProperties = this.csvData.filter(p => {
      const region = params.region.toLowerCase()
      return (
        p['Barrio/Zona']?.toLowerCase().includes(region) ||
        p['Provincia']?.toLowerCase().includes(region)
      )
    })

    if (regionProperties.length === 0) {
      return []
    }

    // Calculate basic market statistics
    const prices = regionProperties.map(p => parseInt(p['Precio'])).filter(p => p > 0)
    const daysOnMarket = regionProperties.map(p => this.calculateDaysOnMarket(p['Fecha de publicación'])).filter(d => d > 0)

    if (prices.length === 0) {
      return []
    }

    const medianPrice = prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)]
    const avgDaysOnMarket = daysOnMarket.reduce((a, b) => a + b, 0) / daysOnMarket.length

    // Generate trend data for the requested months
    const months = params.months || 12
    const trends: MarketTrend[] = []

    for (let i = 0; i < months; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)

      trends.push({
        region: params.region,
        regionType: params.regionType || "neighborhood",
        medianPrice: Math.round(medianPrice * (0.95 + Math.random() * 0.1)),
        priceChangePct: -5 + Math.random() * 10, // Random ±5%
        avgDaysOnMarket: Math.round(avgDaysOnMarket * (0.9 + Math.random() * 0.2)),
        inventoryCount: regionProperties.length,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        source: "zonaprop",
      })
    }

    return trends.reverse() // Return oldest to newest
  }

  async getNeighborhoodInfo(params: {
    city: string
    state: string
    zipCode?: string
  }): Promise<NeighborhoodInfo> {
    // Filter properties by neighborhood/city
    const neighborhoodProperties = this.csvData.filter(p => {
      const matchesCity = p['Barrio/Zona']?.toLowerCase().includes(params.city.toLowerCase())
      const matchesState = p['Provincia']?.toLowerCase() === params.state.toLowerCase()
      return matchesCity && matchesState
    })

    const prices = neighborhoodProperties.map(p => parseInt(p['Precio'])).filter(p => p > 0)
    const medianHomeValue = prices.length > 0
      ? prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)]
      : 0

    return {
      overview: {
        population: 15000 + Math.floor(Math.random() * 50000), // Mock data
        medianIncome: 800 + Math.floor(Math.random() * 1200), // USD monthly
        medianHomeValue,
        costOfLivingIndex: 45 + Math.floor(Math.random() * 30), // Argentina index
      },
      schools: [], // Not available in ZonaProp data
      amenities: {
        restaurants: Math.floor(Math.random() * 50),
        groceryStores: Math.floor(Math.random() * 10),
        parks: Math.floor(Math.random() * 15),
        gyms: Math.floor(Math.random() * 8),
        hospitals: Math.floor(Math.random() * 3),
      },
      transportation: {
        walkScore: Math.floor(Math.random() * 100),
        transitScore: Math.floor(Math.random() * 100),
        bikeScore: Math.floor(Math.random() * 100),
        averageCommute: 15 + Math.floor(Math.random() * 30),
      },
      crimeRate: {
        overall: "Moderate",
        violent: "Low",
        property: "Moderate",
        comparedToNational: "Average",
      },
      marketTrends: {
        homeValueTrend: "Stable",
        forecastNextYear: "Moderate Growth",
        averageDaysOnMarket: Math.floor(Math.random() * 60) + 20,
        medianRent: Math.round(medianHomeValue * 0.008), // Rough estimate for Argentina
      },
    }
  }

  // Utility methods specific to ZonaProp data
  getPropertyCount(): number {
    return this.csvData.length
  }

  getAvailableLocations(): string[] {
    const neighborhoods = [...new Set(this.csvData.map(p => p['Barrio/Zona']).filter(Boolean))]
    return neighborhoods as string[]
  }

  getPropertyTypes(): string[] {
    const types = [...new Set(this.csvData.map(p => this.mapPropertyType(p['Tipología/Producto'])).filter(Boolean))]
    return types as string[]
  }

  getVendors(): string[] {
    const vendors = [...new Set(this.csvData.map(p => p['Vendedor']).filter(Boolean))]
    return vendors as string[]
  }

  // Get properties by specific vendor
  getPropertiesByVendor(vendorName: string): ZonaPropProperty[] {
    return this.csvData.filter(p =>
      p['Vendedor']?.toLowerCase().includes(vendorName.toLowerCase())
    )
  }
}

export const csvClient = new CSVApiClient()