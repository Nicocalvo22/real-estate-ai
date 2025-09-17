import { NextRequest, NextResponse } from "next/server"
import { chatWithAgent } from "@/lib/ai/agent-system-fixed"

// Fallback responses for when AI is not available
const getFallbackResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("hola") || lowerMessage.includes("hi") || lowerMessage.includes("hello")) {
    return "¡Hola! Soy tu asistente inmobiliario especializado en Córdoba. Actualmente tengo acceso a 4,382 propiedades de ZonaProp en nuestra base de datos local.\n\n¿En qué puedo ayudarte? Puedes preguntarme sobre:\n• Propiedades en barrios específicos de Córdoba\n• Precios promedio por zona\n• Tipos de propiedades disponibles\n• Información general sobre el mercado inmobiliario"
  }

  if (lowerMessage.includes("precio") || lowerMessage.includes("costo")) {
    return "Según nuestros datos de ZonaProp, tenemos propiedades en Córdoba con un rango amplio de precios. Las propiedades van desde departamentos económicos hasta casas de lujo.\n\n¿Te interesa algún barrio específico o rango de precios en particular?"
  }

  if (lowerMessage.includes("barrio") || lowerMessage.includes("zona")) {
    return "En nuestra base de datos tenemos propiedades distribuidas por toda Córdoba, incluyendo zonas populares como Nueva Córdoba, Centro, Güemes, y muchos otros barrios.\n\n¿Hay algún barrio específico que te interese?"
  }

  if (lowerMessage.includes("departamento") || lowerMessage.includes("casa")) {
    return "En nuestra base de datos de ZonaProp tenemos tanto departamentos como casas disponibles en Córdoba. Cada propiedad incluye información detallada como ubicación, precio, características y descripción.\n\n¿Buscas algo específico en cuanto a tipo de propiedad?"
  }

  return "Gracias por tu consulta. Tengo acceso a 4,382 propiedades de ZonaProp en Córdoba. Aunque el servicio de AI temporalmente no está disponible, puedo ayudarte con información general sobre nuestro mercado inmobiliario.\n\n¿Hay algo específico sobre propiedades en Córdoba que te gustaría saber?"
}

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "El mensaje es requerido" },
        { status: 400 }
      )
    }

    try {
      // Try to use AI first
      console.log("Using AI chat system for response")
      const aiResponse = await chatWithAgent(message, context)

      return NextResponse.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
        fallback: false
      })
    } catch (aiError) {
      // If AI fails, use fallback
      console.warn("AI failed, using fallback response:", aiError)
      const fallbackResponse = getFallbackResponse(message)

      return NextResponse.json({
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        fallback: true,
        aiError: aiError instanceof Error ? aiError.message : "Unknown AI error"
      })
    }

  } catch (error) {
    console.error("Error in chat API:", error)

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
    message: "Chat API está funcionando",
    endpoints: {
      POST: "/api/chat - Envía un mensaje al agente de chat"
    }
  })
}