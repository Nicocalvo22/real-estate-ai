"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, FileText, Trash2, Calendar, Search, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface SavedProperty {
  id: string
  name: string
  properties: Array<{
    number: number
    content: string
  }>
  savedAt: string
  searchQuery: string
}

export default function SavedPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([])
  const [selectedProperty, setSelectedProperty] = useState<SavedProperty | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)
  const [selectedForActions, setSelectedForActions] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load saved properties from localStorage
    const saved = localStorage.getItem('savedProperties')
    if (saved) {
      setSavedProperties(JSON.parse(saved))
    }
  }, [])

  const handleDelete = (id: string) => {
    const updated = savedProperties.filter(prop => prop.id !== id)
    setSavedProperties(updated)
    localStorage.setItem('savedProperties', JSON.stringify(updated))
    setShowDeleteDialog(null)
    setSelectedForActions(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderPropertyContent = (content: string) => {
    // Simple and clean rendering - just title and URL
    const lines = content.split('\n')
    const titleLine = lines[0] || ''
    const urlLine = lines.find(line => line.includes('🔗')) || ''

    // Extract title (remove number prefix if exists)
    const cleanTitle = titleLine.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '$1')

    // Extract URL from the URL line
    const urlMatch = urlLine.match(/(https?:\/\/[^\s]+)/)
    const url = urlMatch ? urlMatch[1] : ''

    return (
      <div className="space-y-4">
        {/* Property Title */}
        <div className="text-gray-900 font-bold text-lg mb-3 pb-2 border-b border-gray-200">
          🏠 {cleanTitle}
        </div>

        {/* URL Button */}
        {url && (
          <div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-findy-electric hover:bg-findy-electric/90 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              🔗 Ver Propiedad en ZonaProp
            </a>
          </div>
        )}

        {/* Fallback if no URL */}
        {!url && (
          <div className="text-gray-500 italic">
            URL no disponible para esta propiedad
          </div>
        )}
      </div>
    )
  }

  const handleGenerateWorkPlan = (property: SavedProperty) => {
    console.log('Generating work plan for:', property.name)

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

    // Convert saved properties to work plan format
    const workPlanProperties = property.properties.map(prop => {
      const lines = prop.content.split('\n')
      const titleLine = lines[0] || ''
      const urlLine = lines.find(line => line.includes('🔗')) || ''

      // Extract URL
      const urlMatch = urlLine.match(/(https?:\/\/[^\s]+)/)
      const url = urlMatch ? urlMatch[1] : ''

      return {
        number: prop.number,
        title: titleLine.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '$1'),
        url: url
      }
    })

    // Start with empty tasks - user can add their own
    const workPlanTasks: any[] = []

    // Create work plan
    const newWorkPlan = {
      id: `workplan-${Date.now()}`,
      name: `Análisis: ${property.name}`,
      description: `Plan de análisis detallado para las propiedades de "${property.name}"`,
      properties: workPlanProperties,
      tasks: workPlanTasks,
      createdAt: new Date().toISOString(),
      status: 'active' as const
    }

    // Save to localStorage
    const updatedPlans = [...existingPlans, newWorkPlan]
    localStorage.setItem('workPlans', JSON.stringify(updatedPlans))

    toast({
      title: "¡Plan de Trabajo Creado!",
      description: `"${newWorkPlan.name}" está listo en la sección Planes de Trabajo. ¡Comienza a trabajar en tus tareas!`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propiedades Guardadas</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus selecciones de propiedades guardadas
          </p>
        </div>
        <div className="text-right">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {savedProperties.length} guardados
          </Badge>
        </div>
      </div>

      {savedProperties.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No tienes propiedades guardadas</h3>
            <p className="text-gray-500 mb-6">
              Usa Findy AI para buscar propiedades y guárdalas con nombres personalizados.
            </p>
            <Link href="/dashboard/chat">
              <Button className="bg-gradient-to-r from-findy-fuchsia to-findy-magenta text-white">
                <Search className="h-4 w-4 mr-2" />
                Buscar Propiedades
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((property) => (
            <Card
              key={property.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedForActions === property.id ? 'ring-2 ring-findy-electric' : ''
              }`}
              onClick={() => setSelectedForActions(property.id === selectedForActions ? null : property.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5 text-findy-electric" />
                  {property.name}
                </CardTitle>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(property.savedAt)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Búsqueda original:</span>
                  <p className="text-gray-600 mt-1 line-clamp-2">{property.searchQuery}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-findy-electric border-findy-electric">
                    {property.properties.length} propiedades
                  </Badge>
                </div>

                {/* Quick preview of first property */}
                {property.properties[0] && (
                  <div className="text-sm text-gray-700 bg-blue-50 border border-blue-100 p-3 rounded-lg">
                    <span className="text-xs text-blue-600 font-medium mb-1 block">Vista previa:</span>
                    {property.properties[0].content
                      .split('\n')[0]
                      .replace(/^\d+\.\s/, '')
                      .replace(/\*\*(.*?)\*\*/g, '$1')
                      .trim()
                      .substring(0, 80)}
                    {property.properties[0].content.length > 80 ? '...' : ''}
                  </div>
                )}

                {/* Action buttons - only show when selected */}
                {selectedForActions === property.id && (
                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProperty(property)
                      }}
                      className="flex-1"
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Ver Detalles
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGenerateWorkPlan(property)
                      }}
                      className="bg-findy-electric text-white hover:bg-findy-electric/80"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Plan
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDeleteDialog(property.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Property Details Dialog */}
      <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-findy-electric" />
              {selectedProperty?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Guardado el:</span> {formatDate(selectedProperty.savedAt)}
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Búsqueda original:</span>
                <p className="text-gray-600 mt-1">{selectedProperty.searchQuery}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-2xl text-gray-800">Propiedades Seleccionadas</h3>
                  <div className="bg-findy-electric/20 text-findy-electric px-3 py-1 rounded-full text-sm font-medium">
                    {selectedProperty.properties.length} propiedades
                  </div>
                </div>

                {selectedProperty.properties.map((property, index) => (
                  <Card key={index} className="bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-findy-electric/30">
                    <CardContent className="p-0">
                      {/* Header with property number */}
                      <div className="bg-gradient-to-r from-findy-electric to-findy-skyblue p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{property.number}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">Propiedad #{property.number}</h4>
                            <p className="text-white/80 text-sm">Información completa de ZonaProp</p>
                          </div>
                        </div>
                      </div>

                      {/* Property content */}
                      <div className="p-6">
                        {renderPropertyContent(property.content)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleGenerateWorkPlan(selectedProperty)}
                  className="bg-gradient-to-r from-findy-fuchsia to-findy-magenta text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generar Plan de Trabajo
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDeleteDialog(selectedProperty.id)
                    setSelectedProperty(null)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Guardado
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Confirmar Eliminación
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              ¿Estás seguro de que quieres eliminar este guardado? Esta acción no se puede deshacer.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-medium text-red-800">
                {savedProperties.find(p => p.id === showDeleteDialog)?.name}
              </p>
              <p className="text-xs text-red-600 mt-1">
                {savedProperties.find(p => p.id === showDeleteDialog)?.properties.length} propiedades se eliminarán
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => showDeleteDialog && handleDelete(showDeleteDialog)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}