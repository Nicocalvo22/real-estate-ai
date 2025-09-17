import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

export interface Property {
  id: string
  fuente: string
  titulo_url: string
  precio: number
  latitud: number
  longitud: number
  direccion: string
  barrio: string
  provincia: string
  tipologia: string
  google_maps: string
  fecha_publicacion: string
  vendedor: string
  m2_totales: number
  m2_cubiertos: number
  dormitorios: number
  banos: number
}

export interface SearchCriteria {
  barrio?: string
  precioMin?: number
  precioMax?: number
  tipologia?: string
  dormitoriosMin?: number
  dormitoriosMax?: number
  banosMin?: number
  m2Min?: number
  m2Max?: number
}

let cachedProperties: Property[] | null = null

function loadProperties(): Property[] {
  if (cachedProperties) {
    return cachedProperties
  }

  try {
    const csvPath = path.join(process.cwd(), 'data', 'ZPAgosto.csv')
    const fileContent = fs.readFileSync(csvPath, 'utf-8')

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    })

    cachedProperties = records.map((record: any, index: number) => ({
      id: `prop_${index + 1}`,
      fuente: record['Fuente/Origen'] || '',
      titulo_url: record['Titulo_URL'] || '',
      precio: parseInt(record['Precio']) || 0,
      latitud: parseFloat(record['Latitud']) || 0,
      longitud: parseFloat(record['Longitud']) || 0,
      direccion: record['Dirección'] || '',
      barrio: record['Barrio/Zona'] || '',
      provincia: record['Provincia'] || '',
      tipologia: record['Tipología/Producto'] || '',
      google_maps: record['google_maps'] || '',
      fecha_publicacion: record['Fecha de publicación'] || '',
      vendedor: record['Vendedor'] || '',
      m2_totales: parseInt(record['m2 totales']) || 0,
      m2_cubiertos: parseInt(record['m2 cubiertos']) || 0,
      dormitorios: parseInt(record['Dormitorios']) || 0,
      banos: parseInt(record['Baños']) || 0,
    }))

    return cachedProperties
  } catch (error) {
    console.error('Error loading CSV:', error)
    return []
  }
}

export function searchProperties(criteria: SearchCriteria): Property[] {
  const allProperties = loadProperties()

  let filteredProperties = allProperties.filter(property => {
    // Filter by neighborhood (case insensitive, partial match with normalization)
    if (criteria.barrio) {
      const searchBarrio = criteria.barrio.toLowerCase().trim()
      const propertyBarrio = property.barrio.toLowerCase().trim()

      // Normalize common variations
      const normalizeBarrio = (barrio: string) => {
        return barrio
          .replace(/nueva\s*cordoba/g, 'nueva córdoba')
          .replace(/guemes/g, 'güemes')
          .replace(/barrio\s*jardin/g, 'barrio jardín')
          .replace(/maipu/g, 'maipú')
          .replace(/\s+/g, ' ')
      }

      const normalizedSearch = normalizeBarrio(searchBarrio)
      const normalizedProperty = normalizeBarrio(propertyBarrio)

      // Try exact match first, then partial match
      const isMatch = normalizedProperty === normalizedSearch ||
                      normalizedProperty.includes(normalizedSearch) ||
                      normalizedSearch.includes(normalizedProperty)

      if (!isMatch) {
        return false
      }
    }

    // Filter by price range
    if (criteria.precioMin && property.precio < criteria.precioMin) {
      return false
    }
    if (criteria.precioMax && property.precio > criteria.precioMax) {
      return false
    }

    // Filter by property type
    if (criteria.tipologia) {
      const searchTipo = criteria.tipologia.toLowerCase()
      const propertyTipo = property.tipologia.toLowerCase()
      if (!propertyTipo.includes(searchTipo)) {
        return false
      }
    }

    // Filter by bedrooms
    if (criteria.dormitoriosMin && property.dormitorios < criteria.dormitoriosMin) {
      return false
    }
    if (criteria.dormitoriosMax && property.dormitorios > criteria.dormitoriosMax) {
      return false
    }

    // Filter by bathrooms
    if (criteria.banosMin && property.banos < criteria.banosMin) {
      return false
    }

    // Filter by square meters
    if (criteria.m2Min && property.m2_totales < criteria.m2Min) {
      return false
    }
    if (criteria.m2Max && property.m2_totales > criteria.m2Max) {
      return false
    }

    return true
  })

  // Sort by price (ascending)
  filteredProperties.sort((a, b) => a.precio - b.precio)

  return filteredProperties
}

export function findPropertiesByQuery(query: string): Property[] {
  const lowerQuery = query.toLowerCase()

  // Extract search criteria from natural language query
  const criteria: SearchCriteria = {}

  // Extract neighborhood - Improved matching
  const neighborhoods = [
    'nueva córdoba', 'nueva cordoba', 'centro', 'villa allende', 'güemes', 'guemes',
    'alberdi', 'arguello', 'cerro de las rosas', 'villa belgrano', 'barrio jardín',
    'alto verde', 'villa carlos paz', 'villa dolores', 'la falda', 'barrio jardin',
    'general paz', 'san vicente', 'cofico', 'maipu', 'maipú', 'observatorio',
    'yofre', 'la france', 'parque chacabuco', 'las flores', 'docta', 'ciudad docta'
  ]

  // More flexible neighborhood matching
  for (const neighborhood of neighborhoods) {
    const normalizedNeighborhood = neighborhood.toLowerCase()
    if (lowerQuery.includes(normalizedNeighborhood)) {
      // Normalize the neighborhood name for consistent searching
      let searchNeighborhood = neighborhood
      if (neighborhood === 'nueva cordoba') searchNeighborhood = 'nueva córdoba'
      if (neighborhood === 'guemes') searchNeighborhood = 'güemes'
      if (neighborhood === 'barrio jardin') searchNeighborhood = 'barrio jardín'
      if (neighborhood === 'maipu') searchNeighborhood = 'maipú'

      criteria.barrio = searchNeighborhood
      console.log(`🏘️ Neighborhood detected: "${searchNeighborhood}" from query: "${query}"`)
      break
    }
  }

  // Also check for partial matches with common neighborhood keywords
  const partialMatches = [
    { pattern: /nueva\s*córdoba|nueva\s*cordoba/i, name: 'nueva córdoba' },
    { pattern: /villa\s*allende/i, name: 'villa allende' },
    { pattern: /cerro\s*de\s*las\s*rosas/i, name: 'cerro de las rosas' },
    { pattern: /villa\s*belgrano/i, name: 'villa belgrano' },
    { pattern: /barrio\s*jardín|barrio\s*jardin/i, name: 'barrio jardín' },
    { pattern: /alto\s*verde/i, name: 'alto verde' },
    { pattern: /villa\s*carlos\s*paz/i, name: 'villa carlos paz' },
    { pattern: /villa\s*dolores/i, name: 'villa dolores' },
    { pattern: /la\s*falda/i, name: 'la falda' }
  ]

  if (!criteria.barrio) {
    for (const match of partialMatches) {
      if (match.pattern.test(lowerQuery)) {
        criteria.barrio = match.name
        console.log(`🏘️ Neighborhood detected via pattern: "${match.name}" from query: "${query}"`)
        break
      }
    }
  }

  // Extract property type
  if (lowerQuery.includes('departamento') || lowerQuery.includes('depto')) {
    criteria.tipologia = 'departamento'
  } else if (lowerQuery.includes('casa')) {
    criteria.tipologia = 'casa'
  } else if (lowerQuery.includes('ph') || lowerQuery.includes('duplex')) {
    criteria.tipologia = 'ph'
  }

  // Extract bedrooms first
  const dormMatches = lowerQuery.match(/(\d+)\s*(dormitorios?|habitaciones?|dorm|amb)/i)
  if (dormMatches) {
    const numDorm = parseInt(dormMatches[1])
    if (lowerQuery.includes('hasta')) {
      criteria.dormitoriosMax = numDorm
    } else if (lowerQuery.includes('desde')) {
      criteria.dormitoriosMin = numDorm
    } else {
      // Exact match
      criteria.dormitoriosMin = numDorm
      criteria.dormitoriosMax = numDorm
    }
    console.log(`🛏️ Bedrooms detected: ${numDorm}`)
  }

  // Extract range like "2 a 3 dormitorios"
  const rangeMatch = lowerQuery.match(/(\d+)\s*a\s*(\d+)\s*(dormitorios?|habitaciones?|dorm)/i)
  if (rangeMatch) {
    criteria.dormitoriosMin = parseInt(rangeMatch[1])
    criteria.dormitoriosMax = parseInt(rangeMatch[2])
    console.log(`🛏️ Bedroom range detected: ${criteria.dormitoriosMin} - ${criteria.dormitoriosMax}`)
  }

  // Extract bathrooms
  const banosMatches = lowerQuery.match(/(\d+)\s*(baños?|banos?)/i)
  if (banosMatches) {
    criteria.banosMin = parseInt(banosMatches[1])
    console.log(`🚿 Bathrooms detected: ${criteria.banosMin}`)
  }

  // Extract square meters BEFORE prices to avoid conflicts - Improved detection
  const m2Patterns = [
    // Pattern for "entre X y Y metros/m2" (prioritize this)
    /entre\s+(\d+)\s+y\s+(\d+)\s*(?:m2|metros?|metro)/gi,
    // Pattern for "desde X metros/m2"
    /desde\s+(\d+)\s*(?:m2|metros?|metro)/gi,
    // Pattern for "hasta X metros/m2"
    /hasta\s+(\d+)\s*(?:m2|metros?|metro)/gi,
    // Pattern for "más de X metros"
    /más\s+de\s+(\d+)\s*(?:m2|metros?|metro)/gi,
    // Pattern for "mínimo X metros"
    /(?:mínimo|minimo)\s+(\d+)\s*(?:m2|metros?|metro)/gi,
    // Pattern for "máximo X metros"
    /(?:máximo|maximo)\s+(\d+)\s*(?:m2|metros?|metro)/gi,
    // Pattern for "X m2/metros totales" (context matters)
    /(\d+)\s*(?:m2|metros?)\s*totales/gi,
    // Pattern for "X metros/m2" in general context (last priority)
    /(\d+)\s*(?:m2|metros?|metro)(?!\s*totales)/gi
  ]

  let detectedM2: number[] = []

  for (const pattern of m2Patterns) {
    let match
    while ((match = pattern.exec(lowerQuery)) !== null) {
      if (match[2]) {
        // Range pattern (entre X y Y)
        const m2_1 = parseInt(match[1])
        const m2_2 = parseInt(match[2])
        detectedM2.push(m2_1, m2_2)
        console.log(`📐 M2 range detected: ${m2_1} - ${m2_2}`)
      } else {
        const m2 = parseInt(match[1])
        detectedM2.push(m2)
      }
    }
  }

  if (detectedM2.length > 0) {
    console.log(`📐 Square meters detected: [${detectedM2.join(', ')}] from query: "${query}"`)

    // Handle range patterns first
    if (lowerQuery.includes('entre') && detectedM2.length >= 2) {
      criteria.m2Min = Math.min(...detectedM2)
      criteria.m2Max = Math.max(...detectedM2)
      console.log(`📐 M2 range set: ${criteria.m2Min} - ${criteria.m2Max} m²`)
    }
    // Handle maximum indicators
    else if (lowerQuery.includes('hasta') || lowerQuery.includes('máximo') || lowerQuery.includes('maximo')) {
      criteria.m2Max = Math.max(...detectedM2)
      console.log(`📐 Max M2 set: ${criteria.m2Max} m²`)
    }
    // Handle minimum indicators
    else if (lowerQuery.includes('desde') || lowerQuery.includes('mínimo') || lowerQuery.includes('minimo') || lowerQuery.includes('más de')) {
      criteria.m2Min = Math.max(...detectedM2)
      console.log(`📐 Min M2 set: ${criteria.m2Min} m²`)
    }
    // Default: treat as minimum if not specified
    else {
      criteria.m2Min = detectedM2[0]
      console.log(`📐 Default min M2 set: ${criteria.m2Min} m²`)
    }
  }

  // Extract price range (in USD) AFTER M2 to avoid conflicts - Only explicit price indicators
  // SKIP price extraction entirely if the query contains M2/metros context
  if (!lowerQuery.match(/\d+\s*(?:m2|metros?|metro)/i)) {
    const pricePatterns = [
      // Pattern for explicit price context with USD/K/mil indicators (highest priority)
      /(\d+(?:,\d+)*)\s*(?:k|mil|thousand)\s*(?:usd|dolares|dolar)/gi,
      /(\d+(?:,\d+)*)\s*(?:k|mil|thousand)/gi,
      // Pattern for dollar amounts (explicit)
      /\$\s*(\d+(?:,\d+)*)\s*(?:k|mil|thousand|usd)?/gi,
      // Pattern for explicit price context
      /(?:precio|presupuesto|costo|vale)\s+(?:\$|usd)?\s*(\d+(?:,\d+)*)/gi,
      // Pattern for price ranges with explicit context
      /entre\s+\$?\s*(\d+(?:,\d+)*)\s+y\s+\$?\s*(\d+(?:,\d+)*)\s*(?:usd|dolares|mil|k)/gi,
      // Pattern for price limits with explicit context
      /(?:hasta|máximo|maximo)\s+\$?\s*(\d+(?:,\d+)*)\s*(?:usd|dolares|mil|k)/gi,
      /(?:desde|mínimo|minimo)\s+\$?\s*(\d+(?:,\d+)*)\s*(?:usd|dolares|mil|k)/gi
    ]

    let detectedPrices: number[] = []

    for (const pattern of pricePatterns) {
      let match
      while ((match = pattern.exec(lowerQuery)) !== null) {
        if (match[2]) {
          // Range pattern (entre X y Y)
          let price1 = parseInt(match[1].replace(/,/g, ''))
          let price2 = parseInt(match[2].replace(/,/g, ''))

          // Handle k/mil multipliers
          if (match[0].toLowerCase().includes('k') || match[0].toLowerCase().includes('mil')) {
            price1 *= 1000
            price2 *= 1000
          }

          detectedPrices.push(price1, price2)
        } else {
          let price = parseInt(match[1].replace(/,/g, ''))
          // Handle k/mil multipliers
          if (match[0].toLowerCase().includes('k') || match[0].toLowerCase().includes('mil')) {
            price *= 1000
          }
          detectedPrices.push(price)
        }
      }
    }

    // Only process prices if we found explicit price indicators
    if (detectedPrices.length > 0 &&
        (lowerQuery.includes('precio') || lowerQuery.includes('presupuesto') || lowerQuery.includes('$') ||
         lowerQuery.includes('usd') || lowerQuery.includes('k') || lowerQuery.includes('mil') ||
         lowerQuery.includes('dolar'))) {
      console.log(`💰 Prices detected: [${detectedPrices.join(', ')}] from query: "${query}"`)

      // Handle range patterns first
      if (lowerQuery.includes('entre') && detectedPrices.length >= 2) {
        criteria.precioMin = Math.min(...detectedPrices)
        criteria.precioMax = Math.max(...detectedPrices)
        console.log(`💰 Price range set: $${criteria.precioMin} - $${criteria.precioMax}`)
      }
      // Handle maximum price indicators
      else if (lowerQuery.includes('hasta') || lowerQuery.includes('máximo') || lowerQuery.includes('maximo')) {
        criteria.precioMax = Math.max(...detectedPrices)
        console.log(`💰 Max price set: $${criteria.precioMax}`)
      }
      // Handle minimum price indicators
      else if (lowerQuery.includes('desde') || lowerQuery.includes('mínimo') || lowerQuery.includes('minimo')) {
        criteria.precioMin = Math.min(...detectedPrices)
        console.log(`💰 Min price set: $${criteria.precioMin}`)
      }
      // Default: single price mentioned assumes it's max
      else if (detectedPrices.length === 1) {
        criteria.precioMax = detectedPrices[0]
        console.log(`💰 Default max price set: $${criteria.precioMax}`)
      }
    }
  } else {
    console.log(`💰 Price extraction skipped - query contains M2/metros context`)
  }


  // Debug: Log all extracted criteria
  console.log(`🔍 Final search criteria for query "${query}":`, {
    barrio: criteria.barrio || 'ANY',
    precioMin: criteria.precioMin || 'NO MIN',
    precioMax: criteria.precioMax || 'NO MAX',
    tipologia: criteria.tipologia || 'ANY',
    dormitoriosMin: criteria.dormitoriosMin || 'NO MIN',
    dormitoriosMax: criteria.dormitoriosMax || 'NO MAX',
    banosMin: criteria.banosMin || 'NO MIN',
    m2Min: criteria.m2Min || 'NO MIN',
    m2Max: criteria.m2Max || 'NO MAX'
  })

  return searchProperties(criteria)
}

export function formatPropertyForDisplay(property: Property, index: number): string {
  const formatPrice = (price: number) => `$${price.toLocaleString()} USD`
  const formatM2 = (m2: number) => `${m2} m²`

  return `${index + 1}. **${property.tipologia} ${property.dormitorios} ambientes** - ${property.direccion}
   • Precio: ${formatPrice(property.precio)} • ${formatM2(property.m2_totales)} • ${property.dormitorios} dorm, ${property.banos} baño${property.banos !== 1 ? 's' : ''}
   • Barrio: ${property.barrio} • Estado: Disponible • Vendedor: ${property.vendedor}
   • 🔗 Ver propiedad: ${property.titulo_url || 'URL no disponible'}`
}

function isConversationalMessage(query: string): boolean {
  const lowerQuery = query.toLowerCase().trim()

  // Greetings and casual messages
  const greetings = ['hola', 'hello', 'hi', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches']
  const casual = ['gracias', 'thanks', 'ok', 'bien', 'perfecto', 'excelente', 'genial', 'como estas', 'cómo estás', 'que tal', 'qué tal']
  const questions = ['que puedes hacer', 'qué puedes hacer', 'como funciona', 'cómo funciona', 'ayuda', 'help']
  const farewells = ['chau', 'adios', 'adiós', 'hasta luego', 'nos vemos', 'bye']

  // Check if message is too short or just casual
  if (lowerQuery.length < 4) return true

  // Check for greetings
  for (const greeting of greetings) {
    if (lowerQuery.includes(greeting)) return true
  }

  // Check for casual responses
  for (const word of casual) {
    if (lowerQuery.includes(word)) return true
  }

  // Check for help questions
  for (const question of questions) {
    if (lowerQuery.includes(question)) return true
  }

  // Check for farewells
  for (const farewell of farewells) {
    if (lowerQuery.includes(farewell)) return true
  }

  return false
}

function generateConversationalResponse(query: string): string {
  const lowerQuery = query.toLowerCase().trim()

  // Greetings
  if (lowerQuery.includes('hola') || lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
    return `¡Hola! 👋 Soy Findy AI, tu asistente especializado en propiedades de Córdoba.

Tengo acceso a **4,382 propiedades reales** de ZonaProp y puedo ayudarte a encontrar exactamente 10 propiedades que coincidan con tus criterios específicos.

**¿Qué tipo de propiedad buscas?** Puedes ser muy específico:

🏠 **Por ejemplo:**
• "Departamentos en Nueva Córdoba hasta 100K USD"
• "Casas de 3 dormitorios en Villa Allende"
• "Propiedades hasta 80K con 2 baños"
• "Departamentos de 2 ambientes en Centro"

**Barrios disponibles:** Nueva Córdoba, Centro, Villa Allende, Güemes, Alberdi, Villa Belgrano, Arguello, Cerro de las Rosas, y muchos más.

¿En qué puedo ayudarte hoy?`
  }

  // Help questions
  if (lowerQuery.includes('que puedes hacer') || lowerQuery.includes('qué puedes hacer') ||
      lowerQuery.includes('como funciona') || lowerQuery.includes('cómo funciona') ||
      lowerQuery.includes('ayuda') || lowerQuery.includes('help')) {
    return `¡Perfecto! Te explico cómo funciono 🤖

**Soy Findy AI, tu asistente especializado en Córdoba** con acceso a 4,382 propiedades reales de ZonaProp.

**¿Qué puedo hacer por ti?**
✅ Encontrar exactamente **10 propiedades** que coincidan con tus criterios
✅ Filtrar por **barrio específico** (Nueva Córdoba, Centro, Villa Allende, etc.)
✅ Buscar por **rango de precios** ("hasta 150K USD", "desde 80K")
✅ Filtrar por **tipo de propiedad** (departamento, casa, PH)
✅ Buscar por **número de dormitorios** y **baños**
✅ Filtrar por **metros cuadrados**

**Ejemplos de búsquedas:**
• "Departamentos en Nueva Córdoba hasta 120K USD"
• "Casas de 2 a 3 dormitorios en Villa Allende"
• "Propiedades hasta 90K con 2 baños en Centro"

Solo dime qué buscas y te mostraré 10 opciones reales con precios, direcciones y características específicas. ¿Empezamos?`
  }

  // Thanks and positive responses
  if (lowerQuery.includes('gracias') || lowerQuery.includes('thanks') ||
      lowerQuery.includes('perfecto') || lowerQuery.includes('excelente') || lowerQuery.includes('genial')) {
    return `¡De nada! 😊 Me alegra poder ayudarte.

¿Hay alguna propiedad específica que te interese buscar? Puedes ser muy detallado con tus criterios y te encontraré las 10 mejores opciones de nuestras **4,382 propiedades** de ZonaProp en Córdoba.

¡Solo dime qué buscas!`
  }

  // Farewells
  if (lowerQuery.includes('chau') || lowerQuery.includes('adios') || lowerQuery.includes('adiós') ||
      lowerQuery.includes('hasta luego') || lowerQuery.includes('bye')) {
    return `¡Hasta luego! 👋

Espero haberte ayudado a encontrar propiedades interesantes. Recuerda que siempre puedes volver cuando necesites buscar más opciones en Córdoba.

¡Que tengas un excelente día! 🏠✨`
  }

  // Default casual response
  return `¡Entendido! 😊

¿Te gustaría que busque alguna propiedad específica en Córdoba? Tengo acceso a **4,382 propiedades** reales de ZonaProp.

Puedes pedirme cosas como:
• "Departamentos en Nueva Córdoba hasta 100K USD"
• "Casas con jardín en Villa Allende"
• "Propiedades de 2 dormitorios hasta 80K"

¿Qué tipo de propiedad tienes en mente?`
}

// Helper function to format applied filters
function formatAppliedFilters(query: string): string {
  const lowerQuery = query.toLowerCase()
  let filters: string[] = []

  // Extract and display the same criteria that findPropertiesByQuery uses
  // Barrio
  const neighborhoods = ['nueva córdoba', 'nueva cordoba', 'centro', 'villa allende', 'güemes', 'guemes', 'alberdi', 'arguello', 'cerro de las rosas', 'villa belgrano', 'barrio jardín', 'alto verde', 'villa carlos paz', 'villa dolores', 'la falda', 'barrio jardin', 'general paz', 'san vicente', 'cofico', 'maipu', 'maipú', 'observatorio', 'yofre', 'la france', 'parque chacabuco', 'las flores', 'docta', 'ciudad docta']
  for (const neighborhood of neighborhoods) {
    if (lowerQuery.includes(neighborhood.toLowerCase())) {
      let displayName = neighborhood
      if (neighborhood === 'nueva cordoba') displayName = 'Nueva Córdoba'
      else if (neighborhood === 'guemes') displayName = 'Güemes'
      else if (neighborhood === 'barrio jardin') displayName = 'Barrio Jardín'
      else if (neighborhood === 'maipu') displayName = 'Maipú'
      else displayName = neighborhood.charAt(0).toUpperCase() + neighborhood.slice(1)
      filters.push(`📍 Barrio: ${displayName}`)
      break
    }
  }

  // Property type
  if (lowerQuery.includes('departamento') || lowerQuery.includes('depto')) {
    filters.push(`🏢 Tipo: Departamento`)
  } else if (lowerQuery.includes('casa')) {
    filters.push(`🏠 Tipo: Casa`)
  } else if (lowerQuery.includes('ph') || lowerQuery.includes('duplex')) {
    filters.push(`🏘️ Tipo: PH/Duplex`)
  }

  // Bedrooms
  const dormMatches = lowerQuery.match(/(\d+)\s*(dormitorios?|habitaciones?|dorm|amb)/i)
  if (dormMatches) {
    const numDorm = parseInt(dormMatches[1])
    filters.push(`🛏️ Dormitorios: ${numDorm}`)
  }
  const rangeMatch = lowerQuery.match(/(\d+)\s*a\s*(\d+)\s*(dormitorios?|habitaciones?|dorm)/i)
  if (rangeMatch) {
    filters.push(`🛏️ Dormitorios: ${rangeMatch[1]} a ${rangeMatch[2]}`)
  }

  // Bathrooms
  const banosMatches = lowerQuery.match(/(\d+)\s*(baños?|banos?)/i)
  if (banosMatches) {
    filters.push(`🚿 Baños: ${banosMatches[1]}+`)
  }

  // Square meters
  if (lowerQuery.match(/\d+\s*(?:m2|metros?|metro)/i)) {
    const m2Range = lowerQuery.match(/entre\s+(\d+)\s+y\s+(\d+)\s*(?:m2|metros?|metro)/i)
    if (m2Range) {
      filters.push(`📐 Superficie: ${m2Range[1]} - ${m2Range[2]} m²`)
    } else {
      const m2Single = lowerQuery.match(/(\d+)\s*(?:m2|metros?|metro)/i)
      if (m2Single) {
        if (lowerQuery.includes('hasta') || lowerQuery.includes('menos de')) {
          filters.push(`📐 Superficie: hasta ${m2Single[1]} m²`)
        } else if (lowerQuery.includes('desde') || lowerQuery.includes('más de')) {
          filters.push(`📐 Superficie: desde ${m2Single[1]} m²`)
        } else {
          filters.push(`📐 Superficie: ~${m2Single[1]} m²`)
        }
      }
    }
  }

  // Price (only if no m2 context)
  if (!lowerQuery.match(/\d+\s*(?:m2|metros?|metro)/i)) {
    if (lowerQuery.includes('$') || lowerQuery.includes('usd') || lowerQuery.includes('k') || lowerQuery.includes('mil') || lowerQuery.includes('precio')) {
      if (lowerQuery.includes('hasta')) {
        const priceMatch = lowerQuery.match(/hasta\s+.*?(\d+)\s*(?:k|mil)?/i)
        if (priceMatch) {
          const price = priceMatch[0].includes('k') || priceMatch[0].includes('mil') ? parseInt(priceMatch[1]) * 1000 : parseInt(priceMatch[1])
          filters.push(`💰 Precio: hasta $${price.toLocaleString()} USD`)
        }
      } else if (lowerQuery.includes('desde')) {
        const priceMatch = lowerQuery.match(/desde\s+.*?(\d+)\s*(?:k|mil)?/i)
        if (priceMatch) {
          const price = priceMatch[0].includes('k') || priceMatch[0].includes('mil') ? parseInt(priceMatch[1]) * 1000 : parseInt(priceMatch[1])
          filters.push(`💰 Precio: desde $${price.toLocaleString()} USD`)
        }
      }
    }
  }

  return filters.length > 0 ? `**🔍 FILTROS APLICADOS:**\n${filters.join(' • ')}\n\n` : ''
}

export function generatePropertyFinderResponse(query: string): string {
  // Check if it's a conversational message first
  if (isConversationalMessage(query)) {
    return generateConversationalResponse(query)
  }

  // If not conversational, proceed with property search
  const properties = findPropertiesByQuery(query)

  if (properties.length === 0) {
    return `No encontré propiedades que coincidan exactamente con tus criterios: "${query}".

🔍 **Sugerencias:**
• Intenta ser más específico con el barrio (ej: "Nueva Córdoba", "Centro")
• Ajusta el rango de precios (ej: "hasta 150K USD")
• Cambia el tipo de propiedad (ej: "departamentos" o "casas")
• Modifica el número de dormitorios (ej: "2 a 3 dormitorios")

**Barrios disponibles:** Nueva Córdoba, Centro, Villa Allende, Güemes, Alberdi, Arguello, Villa Belgrano, y más.`
  }

  // Get exactly 10 properties (or all if less than 10)
  const selectedProperties = properties.slice(0, 10)

  const propertiesText = selectedProperties
    .map((property, index) => formatPropertyForDisplay(property, index))
    .join('\n\n')

  const totalFound = properties.length
  const showingText = totalFound > 10 ? ` (mostrando las 10 más económicas de ${totalFound} encontradas)` : ``

  // Format applied filters
  const appliedFilters = formatAppliedFilters(query)

  return `Encontré ${totalFound} propiedades que coinciden con tu búsqueda: "${query}"${showingText}

${appliedFilters}**🏠 PROPIEDADES SELECCIONADAS:**

${propertiesText}

${totalFound > 10 ? `\n💡 **Tip:** Hay ${totalFound - 10} propiedades más disponibles. Refina tu búsqueda para ver diferentes opciones.` : ''}

¿Te interesa información más detallada sobre alguna propiedad específica? ¿O prefieres ajustar los criterios de búsqueda?`
}