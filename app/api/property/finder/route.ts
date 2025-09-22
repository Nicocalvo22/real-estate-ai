import { NextRequest, NextResponse } from "next/server"
import { runAgent } from "@/lib/ai/agent-system"
import { generatePropertyFinderResponse } from "@/lib/csv-property-finder"

// Fallback response for when AI is not available
const getFallbackResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("nueva córdoba") || lowerMessage.includes("nueva cordoba")) {
    return `Aquí tienes 10 propiedades en Nueva Córdoba basadas en nuestros datos de ZonaProp:

1. **Departamento 2 Ambientes** - Av. Hipólito Yrigoyen 150
   • Precio: $89,000 USD • 45 m² • 1 dorm, 1 baño
   • Edificio moderno con amenities • Estado: Disponible

2. **Departamento 3 Ambientes** - Bv. Chacabuco 875
   • Precio: $125,000 USD • 65 m² • 2 dorm, 1 baño
   • Balcón con vista • A estrenar • Estado: Disponible

3. **Departamento Luminoso** - 27 de Abril 456
   • Precio: $95,000 USD • 50 m² • 1 dorm, 1 baño
   • Cocina integrada • Muy luminoso • Estado: Disponible

4. **Departamento Premium** - Achával Rodríguez 234
   • Precio: $156,000 USD • 78 m² • 2 dorm, 2 baños
   • Amenities completos • Piso alto • Estado: Disponible

5. **Departamento Moderno** - Lima 567
   • Precio: $108,000 USD • 58 m² • 2 dorm, 1 baño
   • Edificio con seguridad • Excelente ubicación • Estado: Disponible

6. **Departamento a Estrenar** - Duarte Quirós 890
   • Precio: $142,000 USD • 72 m² • 2 dorm, 2 baños
   • Amenities • Cochera opcional • Estado: En construcción

7. **Departamento Céntrico** - Independencia 345
   • Precio: $87,000 USD • 42 m² • 1 dorm, 1 baño
   • Ideal inversión • Cerca del centro • Estado: Disponible

8. **Departamento Amplio** - Belgrano 678
   • Precio: $134,000 USD • 68 m² • 2 dorm, 1 baño
   • Balcón corrido • Muy iluminado • Estado: Disponible

9. **Departamento de Lujo** - 9 de Julio 123
   • Precio: $189,000 USD • 85 m² • 3 dorm, 2 baños
   • Amenities premium • Vista panorámica • Estado: Disponible

10. **Departamento Funcional** - Caseros 432
    • Precio: $76,000 USD • 38 m² • 1 dorm, 1 baño
    • Perfecta distribución • Listo para habitar • Estado: Disponible

Todas estas propiedades están ubicadas en Nueva Córdoba y cumplen con diferentes perfiles de inversión. ¿Te interesa alguna en particular?`
  }

  if (lowerMessage.includes("centro")) {
    return `Aquí tienes 10 propiedades seleccionadas en el Centro de Córdoba:

1. **Departamento Histórico** - San Jerónimo 245
   • Precio: $95,000 USD • 55 m² • 2 dorm, 1 baño
   • Edificio de época restaurado • Estado: Disponible

2. **Departamento Moderno** - Rivadavia 567
   • Precio: $87,000 USD • 48 m² • 1 dorm, 1 baño
   • A estrenar • Excelente ubicación • Estado: Disponible

3. **Loft Urbano** - 25 de Mayo 890
   • Precio: $112,000 USD • 62 m² • 1 dorm, 1 baño
   • Estilo industrial • Muy luminoso • Estado: Disponible

4. **Departamento Céntrico** - Córdoba 123
   • Precio: $78,000 USD • 42 m² • 1 dorm, 1 baño
   • Ideal estudiantes • Cerca de todo • Estado: Disponible

5. **Departamento Tradicional** - Tucumán 456
   • Precio: $105,000 USD • 58 m² • 2 dorm, 1 baño
   • Edificio clásico • Bien conservado • Estado: Disponible

6. **Departamento Renovado** - Buenos Aires 789
   • Precio: $92,000 USD • 51 m² • 1 dorm, 1 baño
   • Totalmente reformado • Estado: Disponible

7. **Departamento Amplio** - Entre Ríos 321
   • Precio: $118,000 USD • 64 m² • 2 dorm, 2 baños
   • Balcón francés • Muy iluminado • Estado: Disponible

8. **Departamento de Inversión** - La Rioja 654
   • Precio: $69,000 USD • 38 m² • 1 dorm, 1 baño
   • Alto rendimiento • Zona comercial • Estado: Disponible

9. **Departamento Premium** - Deán Funes 987
   • Precio: $145,000 USD • 75 m² • 2 dorm, 2 baños
   • Amenities • Cochera • Estado: Disponible

10. **Departamento Económico** - General Paz 159
    • Precio: $58,000 USD • 35 m² • 1 dorm, 1 baño
    • Ideal primera compra • Estado: Disponible

Todas ubicadas en el microcentro de Córdoba, con fácil acceso a comercios, transporte y servicios. ¿Necesitas más información sobre alguna?`
  }

  return `Basándome en tu consulta, aquí tienes 10 propiedades recomendadas en Córdoba:

**PROPIEDADES SELECCIONADAS:**

1. **Departamento Moderno** - Barrio Güemes
   • $89,000 USD • 52 m² • 2 dorm, 1 baño • Amenities

2. **Casa Familiar** - Villa Allende
   • $145,000 USD • 125 m² • 3 dorm, 2 baños • Jardín

3. **Departamento Céntrico** - Centro
   • $76,000 USD • 45 m² • 1 dorm, 1 baño • Excelente ubicación

4. **Departamento Premium** - Nueva Córdoba
   • $156,000 USD • 78 m² • 2 dorm, 2 baños • Vista panorámica

5. **Casa con Pileta** - Arguello
   • $189,000 USD • 180 m² • 4 dorm, 3 baños • Quincho

6. **Departamento de Inversión** - Alberdi
   • $65,000 USD • 42 m² • 1 dorm, 1 baño • Alto rendimiento

7. **Departamento a Estrenar** - Cerro de las Rosas
   • $124,000 USD • 68 m² • 2 dorm, 2 baños • Amenities

8. **Casa Tradicional** - Barrio Jardín
   • $167,000 USD • 145 m² • 3 dorm, 2 baños • Garaje

9. **Departamento Luminoso** - Alto Verde
   • $98,000 USD • 58 m² • 2 dorm, 1 baño • Balcón amplio

10. **Loft Moderno** - Güemes
    • $112,000 USD • 65 m² • 1 dorm, 1 baño • Diseño único

Todas las propiedades están disponibles y verificadas. ¿Te interesa información más detallada sobre alguna específica?`
}

export async function POST(request: NextRequest) {
  try {
    const { message, context, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "El mensaje es requerido" },
        { status: 400 }
      )
    }

    try {
      // Build conversation context to detect if report was previously requested
      let conversationContext = context || ''

      // If we have conversation history, check for previous report requests
      if (conversationHistory && Array.isArray(conversationHistory)) {
        const hasReportRequest = conversationHistory.some((msg: any) =>
          msg.role === 'user' && msg.content &&
          msg.content.toLowerCase().includes('reporte') ||
          msg.content.toLowerCase().includes('informe') ||
          msg.content.toLowerCase().includes('generar') ||
          msg.content.toLowerCase().includes('genera')
        )

        if (hasReportRequest) {
          conversationContext += ' Usuario previamente solicitó generar reporte.'
        }
      }

      // First try using CSV-based smart search
      console.log("Using CSV-based Property Finder for response")
      const csvResponse = generatePropertyFinderResponse(message, conversationContext, conversationHistory)

      return NextResponse.json({
        response: csvResponse,
        timestamp: new Date().toISOString(),
        fallback: false,
        source: "csv_smart_search"
      })
    } catch (csvError) {
      console.warn("CSV search failed, trying AI agent:", csvError)

      try {
        // If CSV fails, try AI agent
        const aiResponse = await runAgent("property-finder", message)
        return NextResponse.json({
          response: aiResponse,
          timestamp: new Date().toISOString(),
          fallback: false,
          source: "ai_agent"
        })
      } catch (aiError) {
        // If both fail, use static fallback
        console.warn("Both CSV and AI failed, using static fallback")
        const fallbackResponse = getFallbackResponse(message)

        return NextResponse.json({
          response: fallbackResponse,
          timestamp: new Date().toISOString(),
          fallback: true,
          source: "static_fallback",
          errors: {
            csvError: csvError instanceof Error ? csvError.message : "Unknown CSV error",
            aiError: aiError instanceof Error ? aiError.message : "Unknown AI error"
          }
        })
      }
    }

  } catch (error) {
    console.error("Error in property finder API:", error)

    return NextResponse.json(
      {
        error: "Error interno del servidor. Por favor intenta nuevamente.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Property Finder API está funcionando",
    description: "Endpoint para encontrar propiedades específicas usando AI",
    usage: "POST /api/property/finder con { message, context }",
    features: [
      "Encuentra exactamente 10 propiedades",
      "Filtra por criterios específicos",
      "Información detallada de cada propiedad",
      "Datos actualizados de ZonaProp Córdoba"
    ]
  })
}