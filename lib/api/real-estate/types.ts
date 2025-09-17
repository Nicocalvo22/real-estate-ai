export interface PropertyDetails {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  bedrooms: number
  bathrooms: number
  squareMeters: number
  yearBuilt: number
  propertyType: string
  listingStatus: string
  description: string
  features: string[]
  images: string[]
  latitude?: number
  longitude?: number
  daysOnMarket: number
  listingDate: string
  source: "redfin" | "zillow" | "mls" | "internal" | "zonaprop" | "csv"
  // ZonaProp-specific fields
  vendor?: string
  originalUrl?: string
  totalM2?: number
  coveredM2?: number
}

export interface PropertyValuation {
  propertyId: string
  estimatedValue: number
  valuationRange: {
    low: number
    high: number
  }
  lastUpdated: string
  historicalValues: {
    date: string
    value: number
  }[]
  source: "zillow" | "internal" | "zonaprop" | "csv"
}

export interface MarketTrend {
  region: string
  regionType: "city" | "zip" | "state" | "neighborhood"
  medianPrice: number
  priceChangePct: number
  avgDaysOnMarket: number
  inventoryCount: number
  month: number
  year: number
  source: "redfin" | "zillow" | "mls" | "internal" | "zonaprop" | "csv"
}

export interface NeighborhoodInfo {
  overview: {
    population: number
    medianIncome: number
    medianHomeValue: number
    costOfLivingIndex: number
  }
  schools: {
    name: string
    type: string
    grades: string
    rating: number
    distance: number
  }[]
  amenities: {
    restaurants: number
    groceryStores: number
    parks: number
    gyms: number
    hospitals: number
  }
  transportation: {
    walkScore: number
    transitScore: number
    bikeScore: number
    averageCommute: number
  }
  crimeRate: {
    overall: string
    violent: string
    property: string
    comparedToNational: string
  }
  marketTrends: {
    homeValueTrend: string
    forecastNextYear: string
    averageDaysOnMarket: number
    medianRent: number
  }
}

export interface PropertySearchParams {
  location?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
  limit?: number
}