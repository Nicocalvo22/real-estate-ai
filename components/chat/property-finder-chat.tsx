"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Bot, User, Search, Home, DollarSign, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface PropertyFinderChatProps {
  className?: string
}

export function PropertyFinderChat({ className }: PropertyFinderChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "¡Hola! Soy Findy AI, tu asistente especializado en propiedades de Córdoba. Te ayudo a encontrar exactamente 10 propiedades que coincidan con tus criterios específicos.\n\n¿Qué tipo de propiedad buscas? Puedes especificar:\n• Barrio específico (Nueva Córdoba, Centro, Villa Allende, etc.)\n• Rango de presupuesto\n• Tipo de propiedad (departamento, casa, etc.)\n• Número de dormitorios y baños\n• Metros cuadrados\n• Cualquier otra característica específica",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickFilters = [
    { label: "Departamentos en Nueva Córdoba", icon: Home, query: "Busco departamentos en Nueva Córdoba", color: "findy-electric" },
    { label: "Casas hasta $150K USD", icon: DollarSign, query: "Quiero casas con presupuesto máximo de 150,000 USD", color: "findy-orange" },
    { label: "Propiedades en Centro", icon: MapPin, query: "Muéstrame propiedades en el Centro de Córdoba", color: "findy-skyblue" },
    { label: "2-3 dormitorios", icon: Home, query: "Busco propiedades de 2 a 3 dormitorios", color: "findy-magenta" },
  ]

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (messageText?: string) => {
    const messageToSend = messageText || input.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      role: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/property/finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          context: "Usuario buscando propiedades específicas en Córdoba, Argentina usando Property Finder AI"
        }),
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(data.timestamp),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, hubo un error al procesar tu búsqueda. Por favor intenta nuevamente con criterios específicos como barrio, presupuesto o tipo de propiedad.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleQuickFilter = (query: string) => {
    handleSubmit(query)
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-findy-fuchsia" />
            Búsquedas Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 h-auto p-3 text-xs transition-all duration-200 hover:bg-${filter.color}/10 hover:border-${filter.color}/30 hover:text-${filter.color} border-${filter.color}/20`}
                onClick={() => handleQuickFilter(filter.query)}
                disabled={isLoading}
              >
                <filter.icon className={`h-3 w-3 text-${filter.color}`} />
                <span className="text-left">{filter.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className={className}>
        <CardHeader className="pb-4 bg-gradient-to-r from-findy-fuchsia/10 to-findy-electric/10 border-b border-findy-fuchsia/20">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-findy-fuchsia" />
            <span className="bg-gradient-to-r from-findy-fuchsia to-findy-electric bg-clip-text text-transparent font-bold">
              Findy AI
            </span>
            <Badge variant="secondary" className="ml-auto bg-findy-fuchsia/20 text-findy-fuchsia border-findy-fuchsia/30">
              Encuentra 10 propiedades exactas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] px-4" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-findy-electric to-findy-skyblue text-white"
                      : "bg-gradient-to-br from-findy-fuchsia to-findy-magenta text-white"
                  }`}>
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}>
                    <div className={`inline-block px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-findy-electric/20 to-findy-skyblue/20 text-findy-electric border border-findy-electric/30"
                        : "bg-gradient-to-r from-findy-fuchsia/10 to-findy-magenta/10 border border-findy-fuchsia/20"
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-findy-fuchsia to-findy-magenta text-white flex items-center justify-center">
                    <Search className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-findy-fuchsia/10 to-findy-magenta/10 border border-findy-fuchsia/20">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-findy-fuchsia" />
                        <span className="text-sm text-findy-fuchsia">Buscando las 10 mejores propiedades...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            className="flex gap-2 w-full"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe exactamente qué propiedades buscas (barrio, precio, tipo, etc.)..."
              disabled={isLoading}
              className="flex-1"
              maxLength={500}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-findy-fuchsia to-findy-magenta hover:from-findy-fuchsia/80 hover:to-findy-magenta/80 text-white border-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}