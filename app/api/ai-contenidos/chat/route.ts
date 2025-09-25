import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: Message[]
  systemPrompt: string
  model: string
  csvData?: any[]
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, systemPrompt, model, csvData } = body

    // Get API key from headers or environment
    const apiKey = request.headers.get('x-openai-key') || process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not provided' },
        { status: 400 }
      )
    }

    // Validate API key format
    if (!apiKey.startsWith('sk-')) {
      return NextResponse.json(
        { error: 'Formato de API key inválido. Debe comenzar con "sk-"' },
        { status: 400 }
      )
    }

    // Validate model
    const validModels = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o']
    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: `Modelo no válido. Usa uno de: ${validModels.join(', ')}` },
        { status: 400 }
      )
    }

    console.log('Making request to OpenAI with model:', model)

    // Build full context - optimize for token usage
    let fullContext = systemPrompt

    if (csvData && csvData.length > 0) {
      // Only include first 3 rows to save tokens
      const preview = csvData.slice(0, 3)
      const columns = Object.keys(csvData[0] || {})
      fullContext += `\n\nDatos CSV disponibles:\n- Filas: ${csvData.length}\n- Columnas: ${columns.join(', ')}\n- Muestra:\n${JSON.stringify(preview, null, 1)}`
    }

    fullContext += `\n\nPuedes ayudar con análisis de datos, cálculos y visualizaciones.`

    // Limit conversation history to save tokens
    const limitedMessages = messages.slice(-5) // Only last 5 messages

    // Prepare messages for OpenAI format (system message goes first)
    const openAIMessages = [
      {
        role: 'system',
        content: fullContext
      },
      ...limitedMessages
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: openAIMessages,
        max_tokens: 500, // Reduced to save quota
        temperature: 0.7,
        stream: false
      })
    })

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { error: { message: 'Error parsing response' } }
      }

      console.error('OpenAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })

      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Error de autenticación. Verifica tu API Key de OpenAI.' },
          { status: 401 }
        )
      } else if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after')
        const errorMsg = errorData.error?.message || 'Límite de solicitudes excedido'

        // Check if it's a quota exceeded error
        if (errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('exceeded your current quota')) {
          return NextResponse.json(
            { error: `Cuota de OpenAI excedida. Verifica tu plan y facturación en: https://platform.openai.com/account/billing\n\nError: ${errorMsg}` },
            { status: 429 }
          )
        }

        return NextResponse.json(
          { error: `${errorMsg}. ${retryAfter ? `Intenta de nuevo en ${retryAfter} segundos.` : 'Intenta de nuevo en unos momentos.'}` },
          { status: 429 }
        )
      } else if (response.status === 400) {
        return NextResponse.json(
          { error: `Error en la solicitud: ${errorData.error?.message || 'Solicitud inválida'}` },
          { status: 400 }
        )
      } else if (response.status === 403) {
        return NextResponse.json(
          { error: 'Acceso denegado. Verifica los permisos de tu API Key.' },
          { status: 403 }
        )
      } else {
        return NextResponse.json(
          { error: `API Error (${response.status}): ${errorData.error?.message || 'Error desconocido'}` },
          { status: response.status }
        )
      }
    }

    const data = await response.json()
    return NextResponse.json({
      content: data.choices[0].message.content
    })

  } catch (error) {
    console.error('Error in AI contenidos chat API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}