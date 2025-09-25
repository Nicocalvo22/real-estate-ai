"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Bot, User, Search, Home, DollarSign, MapPin, FileText, Heart, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  hasPropertyList?: boolean
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
  const [selectedProperties, setSelectedProperties] = useState<number[]>([])
  const [showPropertyActions, setShowPropertyActions] = useState(false)
  const [availableProperties, setAvailableProperties] = useState<number>(0)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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
  }, [messages, selectedProperties]) // Re-render when selection changes

  // Force re-render of messages when selection changes
  const [, setForceUpdate] = useState({})
  useEffect(() => {
    if (showPropertyActions) {
      setForceUpdate({})
    }
  }, [selectedProperties, showPropertyActions])

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
          context: "Usuario buscando propiedades específicas en Córdoba, Argentina usando Property Finder AI",
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const data = await response.json()

      // Check if the response contains a property list and count them
      const propertyCount = countPropertiesInResponse(data.response)
      const hasPropertyList = propertyCount > 0

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(data.timestamp),
        hasPropertyList: hasPropertyList
      }

      setMessages(prev => [...prev, assistantMessage])

      // Show property selection interface if properties were found
      if (hasPropertyList) {
        setAvailableProperties(propertyCount)
        setShowPropertyActions(true)
        setSelectedProperties([]) // Reset selection
        console.log(`🏠 Found ${propertyCount} properties, showing selection interface`)
      } else {
        setShowPropertyActions(false)
      }
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

  const handlePropertySelection = (propertyIndex: number, checked: boolean) => {
    setSelectedProperties(prev => {
      if (checked) {
        return [...prev, propertyIndex]
      } else {
        return prev.filter(index => index !== propertyIndex)
      }
    })
  }

  const handleGenerateReport = async () => {
    const requiredCount = Math.min(4, availableProperties)
    if (selectedProperties.length !== requiredCount) {
      toast({
        title: "Selección Incompleta",
        description: `Debes seleccionar exactamente ${requiredCount} propiedades para generar el Plan de Trabajo`,
        variant: "destructive",
      })
      return
    }

    // Check if there's already an active work plan
    const existingPlans = JSON.parse(localStorage.getItem('workPlans') || '[]')
    const hasActivePlan = existingPlans.some((plan: any) => plan.status === 'active')

    if (hasActivePlan) {
      toast({
        title: "Plan de Trabajo Activo",
        description: "Ya tienes un Plan de Trabajo activo. Completa el actual antes de crear uno nuevo.",
        variant: "destructive",
      })
      return
    }

    const selectedNumbers = selectedProperties.sort((a, b) => a - b)

    // Get selected properties data
    const lastMessage = messages[messages.length - 1]
    const selectedPropertiesData = selectedNumbers.map(num => {
      const lines = lastMessage.content.split('\n')
      let title = `Propiedad ${num}`
      let url = 'URL no disponible'

      // Find the property and extract data
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith(`${num}.`)) {
          title = lines[i].trim()

          // Look for ZonaProp URL
          for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
            const line = lines[j].trim()
            if (line.includes('Ver en ZonaProp')) {
              const urlMatch = line.match(/(https?:\/\/[^\s\)]+)/g)
              if (urlMatch && urlMatch[0]) {
                url = urlMatch[0]
                break
              }
            }
          }
          break
        }
      }

      return {
        number: num,
        title: title.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '$1'),
        url: url
      }
    })

    // Start with empty tasks - user can add their own
    const workPlanTasks: any[] = []

    // Create work plan
    const newWorkPlan = {
      id: `workplan-${Date.now()}`,
      name: `Análisis de ${selectedNumbers.length} Propiedades`,
      description: `Plan de análisis detallado para las propiedades seleccionadas desde Findy AI`,
      properties: selectedPropertiesData,
      tasks: workPlanTasks,
      createdAt: new Date().toISOString(),
      status: 'active' as const
    }

    // Save to localStorage
    const updatedPlans = [...existingPlans, newWorkPlan]
    localStorage.setItem('workPlans', JSON.stringify(updatedPlans))

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `He creado un Plan de Trabajo con las propiedades ${selectedNumbers.join(', ')}`,
      role: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])

    // Add success response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `✅ **¡Excelente!** He creado tu Plan de Trabajo **"${newWorkPlan.name}"** con las ${selectedNumbers.length} propiedades seleccionadas.\n\n**📋 Tu plan incluye:**\n• ${workPlanTasks.length} tareas organizadas\n• Análisis completo de cada propiedad\n• Sistema de seguimiento paso a paso\n• Acceso directo a las URLs de ZonaProp\n\n**🎯 Próximos pasos:**\n1. Ve a **"Planes de Trabajo"** en el menú lateral\n2. Comienza con la primera tarea: "${workPlanTasks[0].title}"\n3. Marca las tareas como completadas según avances\n4. Al completar todas las tareas, el plan se guardará automáticamente\n\n¡Tu Plan de Trabajo está listo y te espera! 🚀`,
      role: "assistant",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setShowPropertyActions(false)
    setSelectedProperties([])
  }

  const handleSavePropertiesClick = () => {
    const requiredCount = Math.min(4, availableProperties)
    if (selectedProperties.length !== requiredCount) {
      toast({
        title: "Selección Incompleta",
        description: `Debes seleccionar exactamente ${requiredCount} propiedades para guardar`,
        variant: "destructive",
      })
      return
    }
    setShowSaveDialog(true)
  }

  const handleSaveProperties = async () => {
    if (!saveName.trim()) {
      toast({
        title: "Nombre Requerido",
        description: "Por favor ingresa un nombre para identificar este guardado",
        variant: "destructive",
      })
      return
    }

    const selectedNumbers = selectedProperties.sort((a, b) => a - b)

    // Get the selected properties from the last assistant message
    const lastMessage = messages[messages.length - 1]
    console.log('🔍 Full message content for parsing:', lastMessage.content)
    console.log('🔍 Selected numbers to extract:', selectedNumbers)

    const selectedPropertiesData = selectedNumbers.map(num => {
      // Extract just the URL for each property - much simpler approach
      const lines = lastMessage.content.split('\n')
      let url = 'URL no disponible'
      let title = `Propiedad ${num}`

      // Find the property section and extract URL and title
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith(`${num}.`)) {
          // Get the title from the first line
          title = lines[i].trim()

          // Look for ZonaProp URL specifically - prioritize it over Google Maps
          for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
            const line = lines[j].trim()
            console.log(`🔍 Checking line ${j}: "${line}"`)

            // First priority: Look specifically for ZonaProp URLs
            if (line.includes('Ver en ZonaProp') || line.includes('🔗 Ver en ZonaProp')) {
              const urlMatch = line.match(/(https?:\/\/[^\s\)]+)/g)
              if (urlMatch && urlMatch[0]) {
                url = urlMatch[0]
                console.log(`✅ Found ZonaProp URL: ${url}`)
                break
              }
            }
          }

          // If no ZonaProp URL found, look for any other URL (but skip Google Maps)
          if (url === 'URL no disponible') {
            for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
              const line = lines[j].trim()

              // Skip Google Maps URLs
              if (line.includes('http') && !line.includes('maps.google') && !line.includes('google.com/maps')) {
                const urlMatch = line.match(/(https?:\/\/[^\s]+)/g)
                if (urlMatch && urlMatch[0]) {
                  url = urlMatch[0]
                  console.log(`✅ Found alternative URL: ${url}`)
                  break
                }
              }
            }
          }
          break
        }
      }

      console.log(`🔍 Property ${num}: ${title} - URL: ${url}`)

      return {
        number: num,
        content: `${title}\n🔗 Ver en ZonaProp: ${url}`
      }
    })

    // Save to localStorage (later we can move this to a proper backend)
    const savedProperty = {
      id: Date.now().toString(),
      name: saveName.trim(),
      properties: selectedPropertiesData,
      savedAt: new Date().toISOString(),
      searchQuery: messages[messages.length - 2]?.content || "Búsqueda personalizada",
    }

    const existingSaved = JSON.parse(localStorage.getItem('savedProperties') || '[]')
    existingSaved.push(savedProperty)
    localStorage.setItem('savedProperties', JSON.stringify(existingSaved))

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `He guardado las propiedades ${selectedNumbers.join(', ')} con el nombre "${saveName}"`,
      role: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])

    // Add success response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `✅ **¡Perfecto!** He guardado tus ${selectedNumbers.length} propiedades seleccionadas con el nombre **"${saveName}"**.\n\nPuedes encontrar este guardado en la sección **"Propiedades Guardadas"** del menú lateral, donde podrás:\n• Ver todos los detalles de las propiedades\n• Generar reportes personalizados\n• Gestionar tus guardados\n\n¿Necesitas buscar más propiedades o quieres hacer algo más?`,
      role: "assistant",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setShowPropertyActions(false)
    setSelectedProperties([])
    setShowSaveDialog(false)
    setSaveName("")
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Function to count properties in the AI response
  const countPropertiesInResponse = (content: string): number => {
    // Count numbered properties like "1. **Departamento..." or "1. **Casa..."
    const propertyMatches = content.match(/^\d+\.\s\*\*[^*]+\*\*/gm)
    return propertyMatches ? propertyMatches.length : 0
  }

  const renderMessageWithLinks = (content: string) => {
    // First, add visual indicators to numbered properties
    let processedContent = content.replace(
      /^(\d+)\.\s(\*\*[^*]+\*\*[^]*?)(?=\n\d+\.|$)/gm,
      (match, number, rest) => {
        const isSelected = selectedProperties.includes(parseInt(number))
        const bgColor = isSelected ? 'bg-findy-electric/10 border-findy-electric/30' : 'bg-gray-50/50 border-gray-200'
        const icon = isSelected ? '✅' : '📍'
        return `<div class="property-item p-3 my-2 border-l-4 ${bgColor}">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-lg">${icon}</span>
            <span class="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-findy-electric rounded-full">${number}</span>
          </div>
          ${number}. ${rest}
        </div>`
      }
    )

    // Then handle URLs
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g
    const parts = processedContent.split(urlRegex)

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // Si es una URL, crear un enlace clickeable
        const href = part.startsWith('http') ? part : `https://${part}`
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-findy-electric hover:text-findy-skyblue underline underline-offset-2 transition-colors duration-200 font-medium"
          >
            {part}
          </a>
        )
      }
      // Handle HTML content from property formatting
      if (part.includes('<div class="property-item')) {
        return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />
      }
      return part
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
                        {renderMessageWithLinks(message.content)}
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

        {/* Property Selection Interface */}
        {showPropertyActions && (
          <div className="border-t border-findy-fuchsia/20 p-4 bg-gradient-to-r from-findy-fuchsia/5 to-findy-electric/5">
            <div className="mb-4">
              {(() => {
                const requiredCount = Math.min(4, availableProperties);
                return (
                  <>
                    <h4 className="text-sm font-semibold text-findy-fuchsia mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Selecciona exactamente {requiredCount} {requiredCount === 1 ? 'propiedad' : 'propiedades'} para continuar
                      <span className="text-xs bg-findy-electric/20 text-findy-electric px-2 py-1 rounded">
                        {availableProperties} {availableProperties === 1 ? 'disponible' : 'disponibles'}
                      </span>
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                      {Array.from({ length: availableProperties }, (_, i) => i + 1).map((propertyNum) => (
                        <div key={propertyNum} className="flex items-center space-x-2 p-2 rounded border border-findy-electric/20 hover:bg-findy-electric/5 transition-colors">
                          <Checkbox
                            id={`property-${propertyNum}`}
                            checked={selectedProperties.includes(propertyNum)}
                            onCheckedChange={(checked) => handlePropertySelection(propertyNum, checked as boolean)}
                            className="data-[state=checked]:bg-findy-electric data-[state=checked]:border-findy-electric"
                          />
                          <label
                            htmlFor={`property-${propertyNum}`}
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            📍 {propertyNum}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-sm text-gray-600 mb-3">
                      {selectedProperties.length === 0 && "No has seleccionado ninguna propiedad"}
                      {selectedProperties.length > 0 && selectedProperties.length < requiredCount &&
                        `Has seleccionado ${selectedProperties.length} propiedades. Necesitas ${requiredCount - selectedProperties.length} más.`}
                      {selectedProperties.length === requiredCount && `¡Perfect! Has seleccionado exactamente ${requiredCount} propiedades.`}
                      {selectedProperties.length > requiredCount && `Has seleccionado ${selectedProperties.length} propiedades. Debes seleccionar solo ${requiredCount}.`}
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={handleGenerateReport}
                        disabled={selectedProperties.length !== requiredCount || isLoading}
                        className="bg-gradient-to-r from-findy-fuchsia to-findy-magenta hover:from-findy-fuchsia/80 hover:to-findy-magenta/80 text-white border-0 flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Generar Plan de Trabajo
                      </Button>

                      <Button
                        onClick={handleSavePropertiesClick}
                        disabled={selectedProperties.length !== requiredCount || isLoading}
                        variant="outline"
                        className="border-findy-electric text-findy-electric hover:bg-findy-electric/10 flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        Guardar Propiedades
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

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

      {/* Save Properties Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-findy-electric" />
              Guardar Propiedades
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Dale un nombre a este guardado para poder identificarlo fácilmente más tarde.
            </p>
            <div className="space-y-2">
              <label htmlFor="saveName" className="text-sm font-medium">
                Nombre del guardado
              </label>
              <Input
                id="saveName"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Ej: Cliente Suárez, Propiedades Nueva Córdoba, etc."
                maxLength={50}
                className="w-full"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && saveName.trim()) {
                    handleSaveProperties()
                  }
                }}
                autoFocus
              />
            </div>
            <div className="text-xs text-gray-500">
              Guardando {selectedProperties.length} propiedades seleccionadas
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSaveDialog(false)
                  setSaveName("")
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveProperties}
                disabled={!saveName.trim()}
                className="bg-gradient-to-r from-findy-electric to-findy-skyblue text-white"
              >
                <Heart className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}