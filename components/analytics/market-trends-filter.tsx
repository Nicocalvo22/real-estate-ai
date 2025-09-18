"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Datos basados en ZPAgosto.csv de Córdoba, Argentina
const PROPERTY_TYPES = [
  { value: "all", label: "Todas las Tipologías" },
  { value: "Departamento", label: "Departamentos" },
  { value: "Casa", label: "Casas" }
]

// Top 50 barrios más comunes del CSV ZPAgosto.csv
const ZONES = [
  { value: "all", label: "Todas las Zonas" },
  { value: "Córdoba", label: "Córdoba" },
  { value: "Nueva Córdoba", label: "Nueva Córdoba" },
  { value: "Centro", label: "Centro" },
  { value: "General Paz", label: "General Paz" },
  { value: "Alberdi", label: "Alberdi" },
  { value: "Villa Carlos Paz", label: "Villa Carlos Paz" },
  { value: "Alta Córdoba", label: "Alta Córdoba" },
  { value: "Alto Alberdi", label: "Alto Alberdi" },
  { value: "Villa Belgrano", label: "Villa Belgrano" },
  { value: "Cofico", label: "Cofico" },
  { value: "Argüello", label: "Argüello" },
  { value: "URCA", label: "URCA" },
  { value: "Villa Allende", label: "Villa Allende" },
  { value: "Güemes", label: "Güemes" },
  { value: "General Pueyrredón", label: "General Pueyrredón" },
  { value: "La Calera", label: "La Calera" },
  { value: "Río Ceballos", label: "Río Ceballos" },
  { value: "DOCTA", label: "DOCTA" },
  { value: "Cerro de las Rosas", label: "Cerro de las Rosas" },
  { value: "Observatorio", label: "Observatorio" },
  { value: "Jardín", label: "Jardín" },
  { value: "Las Rosas", label: "Las Rosas" },
  { value: "Teodoro Felds", label: "Teodoro Felds" },
  { value: "Villa Warcalde", label: "Villa Warcalde" },
  { value: "Quebrada de las Rosas", label: "Quebrada de las Rosas" },
  { value: "Crisol Norte", label: "Crisol Norte" },
  { value: "San Vicente", label: "San Vicente" },
  { value: "Parque Capital", label: "Parque Capital" },
  { value: "Colinas de Vélez Sársfield", label: "Colinas de Vélez Sársfield" },
  { value: "Marqués de Sobremonte", label: "Marqués de Sobremonte" },
  { value: "José Ignacio Díaz", label: "José Ignacio Díaz" },
  { value: "Housing del Boulevard", label: "Housing del Boulevard" },
  { value: "SEP", label: "SEP" },
  { value: "Residencial San Carlos", label: "Residencial San Carlos" },
  { value: "San Salvador", label: "San Salvador" },
  { value: "Las Tejas del Sur", label: "Las Tejas del Sur" },
  { value: "Balcarce", label: "Balcarce" },
  { value: "Matienzo", label: "Matienzo" },
  { value: "Nuevo Poeta Lugones", label: "Nuevo Poeta Lugones" },
  { value: "Quintas de Argüello", label: "Quintas de Argüello" },
  { value: "Country Las Delicias", label: "Country Las Delicias" },
  { value: "Pueyrredón", label: "Pueyrredón" },
  { value: "Solares de Santa María", label: "Solares de Santa María" },
  { value: "Villa El Libertador", label: "Villa El Libertador" },
  { value: "Ciudad Gama", label: "Ciudad Gama" },
  { value: "Maipú", label: "Maipú" },
  { value: "San Martín", label: "San Martín" },
  { value: "Villa Retiro", label: "Villa Retiro" },
  { value: "Lomas de San Martín", label: "Lomas de San Martín" },
  { value: "Alto Verde", label: "Alto Verde" },
  { value: "Parque Las Américas", label: "Parque Las Américas" }
]

// Interfaz para los datos del mercado
interface MarketData {
  minPrice: number
  maxPrice: number
  avgPrice: number
  avgSize: number
  properties: number
  priceRange: string
  sizeRange: string
}

// Función para obtener datos reales desde la API
const fetchMarketData = async (propertyType: string, neighborhood: string): Promise<MarketData> => {
  try {
    const params = new URLSearchParams({
      propertyType: propertyType === 'all' ? 'all' : propertyType,
      neighborhood: neighborhood === 'all' ? 'all' : neighborhood
    })

    const response = await fetch(`/api/market/stats?${params}`)
    if (!response.ok) throw new Error('Failed to fetch data')

    return await response.json()
  } catch (error) {
    console.error('Error fetching market data:', error)
    // Fallback data
    return {
      minPrice: 47000,
      maxPrice: 675000,
      avgPrice: 127000,
      avgSize: 85,
      properties: 4382,
      priceRange: '$47K - $675K USD',
      sizeRange: '40 - 180 m²'
    }
  }
}

export function MarketTrendsFilter() {
  const [selectedType, setSelectedType] = useState("all")
  const [selectedZone, setSelectedZone] = useState("all")
  const [data, setData] = useState<MarketData>({
    minPrice: 47000,
    maxPrice: 675000,
    avgPrice: 127000,
    avgSize: 85,
    properties: 4382,
    priceRange: '$47K - $675K USD',
    sizeRange: '40 - 180 m²'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const newData = await fetchMarketData(selectedType, selectedZone)
        setData(newData)
      } catch (error) {
        console.error('Error loading market data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedType, selectedZone])

  const formatPrice = (price: number) => {
    return price >= 1000 ? `$${Math.round(price / 1000)}K` : `$${price}`
  }

  const getTypeLabel = () => {
    const type = PROPERTY_TYPES.find(t => t.value === selectedType)
    return type ? type.label : "Propiedades"
  }

  const getZoneLabel = () => {
    const zone = ZONES.find(z => z.value === selectedZone)
    return zone ? zone.label : "Todas las Zonas"
  }

  return (
    <Card className="border-findy-magenta/20 bg-gradient-to-br from-findy-magenta/5 to-transparent">
      <CardHeader className="bg-gradient-to-r from-findy-magenta/10 to-transparent border-b border-findy-magenta/20">
        <CardTitle className="flex items-center gap-2 text-findy-magenta">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          📈 Tendencias del Mercado
        </CardTitle>
        <CardDescription className="text-findy-mediumgray">
          Filtra por tipología y zona para ver tendencias específicas
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Filtros */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="property-type" className="text-findy-lightgray font-medium">
              Tipología de Propiedad
            </Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="border-findy-mediumgray/30 bg-gray-800 text-findy-lightgray">
                <SelectValue placeholder="Seleccionar tipología" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-findy-mediumgray/30">
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="text-findy-lightgray hover:bg-findy-electric/10 focus:bg-findy-electric/10"
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zone" className="text-findy-lightgray font-medium">
              Zona de Córdoba
            </Label>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="border-findy-mediumgray/30 bg-gray-800 text-findy-lightgray">
                <SelectValue placeholder="Seleccionar zona" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-findy-mediumgray/30 max-h-[200px]">
                {ZONES.map((zone) => (
                  <SelectItem
                    key={zone.value}
                    value={zone.value}
                    className="text-findy-lightgray hover:bg-findy-skyblue/10 focus:bg-findy-skyblue/10"
                  >
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          <div className="text-center p-4 border border-findy-magenta/20 rounded-lg bg-findy-magenta/5">
            <h3 className="text-lg font-semibold text-findy-magenta mb-2">
              {getTypeLabel()} en {getZoneLabel()}
            </h3>
            <p className="text-sm text-findy-lightgray">
              {data.properties} propiedades encontradas
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-findy-electric/20 bg-gradient-to-r from-findy-electric/5 to-transparent">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-findy-lightgray">Rango de Precios:</span>
                  <span className="text-sm font-medium text-findy-electric">
                    {loading ? 'Cargando...' : data.priceRange}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-findy-orange/20 bg-gradient-to-r from-findy-orange/5 to-transparent">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-findy-lightgray">Precio Promedio:</span>
                  <span className="text-sm font-medium text-findy-orange">
                    {loading ? 'Cargando...' : formatPrice(data.avgPrice)} USD
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-findy-skyblue/20 bg-gradient-to-r from-findy-skyblue/5 to-transparent">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-findy-lightgray">Tamaño Promedio:</span>
                  <span className="text-sm font-medium text-findy-skyblue">
                    {loading ? 'Cargando...' : `${data.avgSize} m²`}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-findy-fuchsia/20 bg-gradient-to-r from-findy-fuchsia/5 to-transparent">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-findy-lightgray">Propiedades:</span>
                  <span className="text-sm font-medium text-findy-fuchsia">
                    {loading ? 'Cargando...' : data.properties.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights adicionales */}
        <div className="border-t border-findy-mediumgray/20 pt-4">
          <h4 className="text-sm font-semibold text-findy-lightgray mb-3">
            💡 Insights para esta selección:
          </h4>
          <div className="grid gap-2 text-xs text-findy-mediumgray">
            {selectedType === "departamento" && (
              <div className="flex items-start gap-2">
                <span className="text-findy-electric">•</span>
                <span>Los departamentos son ideales para inversión en alquiler por su alta demanda</span>
              </div>
            )}
            {selectedType === "casa" && (
              <div className="flex items-start gap-2">
                <span className="text-findy-orange">•</span>
                <span>Las casas ofrecen mayor potencial de apreciación a largo plazo</span>
              </div>
            )}
            {selectedZone === "nueva-cordoba" && (
              <div className="flex items-start gap-2">
                <span className="text-findy-skyblue">•</span>
                <span>Nueva Córdoba es una zona premium con alta demanda estudiantil</span>
              </div>
            )}
            {selectedZone === "centro" && (
              <div className="flex items-start gap-2">
                <span className="text-findy-magenta">•</span>
                <span>El Centro ofrece excelente conectividad y servicios urbanos</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="text-findy-fuchsia">•</span>
              <span>Considera la cercanía a universidades para maximizar el retorno de inversión</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}