"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Send, Paperclip, User, Bot, X } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface Message {
  sender: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface CSVData {
  [key: string]: any
}

export function ContentCreatorChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      content: '¡Hola! Soy tu asistente de creación de contenidos. Puedo ayudarte a generar ideas, escribir textos, optimizar contenido y mucho más.\n\nPara empezar, puedes:\n• Preguntarme sobre cualquier tipo de contenido\n• Subir un archivo CSV con datos\n• Configurar mi personalidad en el panel de ajustes\n\n¿En qué te puedo ayudar hoy?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [csvData, setCsvData] = useState<CSVData[] | null>(null)
  const [csvFileName, setCsvFileName] = useState<string>("")
  const [apiKey, setApiKey] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo")
  const [systemPrompt, setSystemPrompt] = useState("Eres un asistente experto en creación de contenidos. Tu especialidad incluye copywriting, marketing de contenidos, SEO, y estrategias de comunicación digital.\n\nSiempre respondes de manera creativa, práctica y orientada a resultados. Ofreces ejemplos específicos y sugerencias accionables.")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load saved configuration on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApiKey = localStorage.getItem('openai_api_key')
      const savedModel = localStorage.getItem('openai_model')
      const savedPrompt = localStorage.getItem('system_prompt')

      if (savedApiKey) setApiKey(savedApiKey)
      if (savedModel) setSelectedModel(savedModel)
      if (savedPrompt) setSystemPrompt(savedPrompt)
    }
  }, [])

  // Save configuration changes
  useEffect(() => {
    if (typeof window !== 'undefined' && apiKey) {
      localStorage.setItem('openai_api_key', apiKey)
    }
  }, [apiKey])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai_model', selectedModel)
    }
  }, [selectedModel])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('system_prompt', systemPrompt)
    }
  }, [systemPrompt])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      sender: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await generateResponse(input.trim())
      setIsTyping(false)

      const assistantMessage: Message = {
        sender: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      setIsTyping(false)
      const errorMessage: Message = {
        sender: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, verifica tu configuración de API.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csvText = e.target?.result as string
        const parsedData = parseCSV(csvText)
        setCsvData(parsedData)
        setCsvFileName(file.name)

        const analysis = analyzeCSVData(parsedData)
        const fileMessage: Message = {
          sender: 'user',
          content: `📁 Archivo CSV cargado: ${file.name}`,
          timestamp: new Date()
        }

        const analysisMessage: Message = {
          sender: 'assistant',
          content: `¡Perfecto! He analizado tu archivo CSV:\n\n📊 **Resumen de datos:**\n• **${analysis.rowCount}** filas de datos\n• **${analysis.columnCount}** columnas: ${analysis.columns.join(', ')}\n• **Columnas numéricas:** ${analysis.numericColumns.join(', ') || 'Ninguna detectada'}\n\n${analysis.suggestions}\n\n¿Qué análisis o gráfico te gustaría que genere?`,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, fileMessage, analysisMessage])
      }
      reader.readAsText(file)
    }
  }

  const parseCSV = (csvText: string): CSVData[] => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const data: CSVData[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const row: CSVData = {}

      headers.forEach((header, index) => {
        const value = values[index]
        const numValue = parseFloat(value)
        row[header] = !isNaN(numValue) ? numValue : value
      })

      data.push(row)
    }

    return data
  }

  const analyzeCSVData = (data: CSVData[]) => {
    if (!data || data.length === 0) return {
      rowCount: 0,
      columnCount: 0,
      columns: [],
      numericColumns: [],
      suggestions: ''
    }

    const columns = Object.keys(data[0])
    const numericColumns = columns.filter(col =>
      data.every(row => typeof row[col] === 'number' || !isNaN(parseFloat(row[col])))
    )

    let suggestions = "💡 **Análisis disponibles:**\n"

    if (numericColumns.length > 0) {
      suggestions += `• Promedios, sumas, máximos y mínimos de: ${numericColumns.join(', ')}\n`
      suggestions += `• Gráficos de barras, líneas o pie charts\n`
      suggestions += `• Análisis estadísticos y tendencias`
    } else {
      suggestions += "• Conteo y frecuencia de valores\n• Gráficos de categorías"
    }

    return {
      rowCount: data.length,
      columnCount: columns.length,
      columns,
      numericColumns,
      suggestions
    }
  }

  const generateResponse = async (userMessage: string): Promise<string> => {
    if (!apiKey) {
      return 'Por favor, configura tu API Key de OpenAI en el panel de configuración.'
    }

    // Build messages array with conversation history (reduced to save tokens/quota)
    const conversationMessages = messages.slice(-4).map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }))

    conversationMessages.push({
      role: 'user' as const,
      content: userMessage
    })

    try {
      const response = await fetch('/api/ai-contenidos/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': apiKey
        },
        body: JSON.stringify({
          messages: conversationMessages,
          systemPrompt: systemPrompt,
          model: selectedModel,
          csvData: csvData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error desconocido')
      }

      return data.content

    } catch (error: any) {
      console.error('Error al llamar a la API:', error)
      return error.message || 'Error de conexión. Verifica tu conexión a internet e intenta de nuevo.'
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            🤖 Asistente de Contenidos
          </CardTitle>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Configuración del Asistente</SheetTitle>
              <SheetDescription>
                Configura tu API key y personaliza el comportamiento del asistente
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key de OpenAI:</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Tu API key se guarda solo en tu navegador y no se comparte.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model-select">Modelo de OpenAI:</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Rápido y económico)</SelectItem>
                    <SelectItem value="gpt-4">GPT-4 (Alta calidad)</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Balance calidad/velocidad)</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o (Máxima calidad)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-prompt">Personalidad y Contexto:</Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Define cómo debe comportarse el asistente..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Configuración de Análisis CSV:</Label>
                <Card className="p-4 bg-muted border-border">
                  <div className="text-sm text-muted-foreground">
                    <p className="font-semibold mb-2 text-foreground">Capacidades disponibles:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong className="text-foreground">Cálculos automáticos:</strong> promedios, sumas, conteos</li>
                      <li>• <strong className="text-foreground">Gráficos:</strong> barras, líneas, pie charts</li>
                      <li>• <strong className="text-foreground">Análisis estadísticos:</strong> máximos, mínimos, tendencias</li>
                      <li>• <strong className="text-foreground">Comandos:</strong> "calcula el promedio de...", "muestra un gráfico de...", "cuenta cuántos..."</li>
                    </ul>
                  </div>
                </Card>
              </div>

              {csvFileName && (
                <div className="space-y-2">
                  <Label>Archivo CSV cargado:</Label>
                  <Card className="p-3 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Archivo:</strong> {csvFileName}<br />
                      <strong>Filas:</strong> {csvData?.length || 0}<br />
                      <strong>Columnas:</strong> {csvData ? Object.keys(csvData[0] || {}).length : 0}
                    </p>
                  </Card>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-green-500 text-white'
              }`}>
                {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}>
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <Separator />

        {/* Input area */}
        <div className="p-4">
          <div className="flex items-end gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje aquí..."
                className="min-h-[44px] max-h-[120px] resize-none"
                rows={1}
              />
            </div>
            <Button onClick={handleSend} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}