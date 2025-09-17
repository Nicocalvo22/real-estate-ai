// Environment configuration for APIs and services
export const config = {
  // CSV Data Configuration
  csv: {
    fileName: process.env.CSV_FILE_NAME || "properties.csv",
    dataPath: process.env.CSV_DATA_PATH || "./data",
  },

  // AI Services
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: "gpt-4o",
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || "",
    model: "claude-3-opus-20240229",
  },
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY || "",
    model: "mistral-large-latest",
  },

  // Geocoding and Maps
  google: {
    apiKey: process.env.GOOGLE_API_KEY || "",
  },

  // Database
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },

  // Feature flags
  features: {
    useCSV: true,
    enableCaching: true,
    logApiCalls: true,
  },
}
