import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-findy-electric to-findy-skyblue bg-clip-text text-transparent">
            Búsqueda de Propiedades
          </span>
        </h1>
        <p className="text-findy-lightgray">
          Explora propiedades disponibles en Córdoba con nuestro panel interactivo de datos en tiempo real
        </p>
      </div>

      <Card className="border-findy-electric/20 bg-gradient-to-br from-findy-electric/5 to-transparent">
        <CardHeader className="bg-gradient-to-r from-findy-electric/10 to-transparent border-b border-findy-electric/20">
          <CardTitle className="flex items-center gap-2 text-findy-electric">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            🔍 Panel de Búsqueda Interactivo
          </CardTitle>
          <CardDescription className="text-findy-mediumgray">
            Datos actualizados de ZonaProp - Córdoba, Argentina
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full" style={{ height: '800px' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://lookerstudio.google.com/embed/reporting/29d15d3c-82b4-4ce6-8307-f86119dfbfb4/page/cbkhD"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            ></iframe>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-findy-magenta/20 bg-gradient-to-br from-findy-magenta/5 to-findy-magenta/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-findy-lightgray">Filtros Disponibles</CardTitle>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-findy-magenta to-findy-fuchsia flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-white"
              >
                <path d="M22 3H2l8 9.46V19l4 2V12.46L22 3z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-findy-magenta mb-2">Múltiples</div>
            <p className="text-xs text-findy-mediumgray">
              • Precio y tamaño<br/>
              • Barrios y zonas<br/>
              • Tipos de propiedad<br/>
              • Fecha de publicación
            </p>
          </CardContent>
        </Card>

        <Card className="border-findy-orange/20 bg-gradient-to-br from-findy-orange/5 to-findy-orange/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-findy-lightgray">Visualizaciones</CardTitle>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-findy-orange to-yellow-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-white"
              >
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-findy-orange mb-2">Interactivas</div>
            <p className="text-xs text-findy-mediumgray">
              • Mapas de calor<br/>
              • Gráficos de tendencias<br/>
              • Distribución por barrios<br/>
              • Análisis comparativo
            </p>
          </CardContent>
        </Card>

        <Card className="border-findy-skyblue/20 bg-gradient-to-br from-findy-skyblue/5 to-findy-skyblue/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-findy-lightgray">Datos en Tiempo Real</CardTitle>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-findy-skyblue to-findy-electric flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-white"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-findy-skyblue mb-2">4,382</div>
            <p className="text-xs text-findy-mediumgray">
              Propiedades activas<br/>
              Actualizadas desde<br/>
              ZonaProp agosto 2024
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-findy-fuchsia/20 bg-gradient-to-br from-findy-fuchsia/5 to-transparent">
        <CardHeader className="bg-gradient-to-r from-findy-fuchsia/10 to-transparent border-b border-findy-fuchsia/20">
          <CardTitle className="flex items-center gap-2 text-findy-fuchsia">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            💡 Cómo usar el Panel de Búsqueda
          </CardTitle>
          <CardDescription className="text-findy-mediumgray">
            Guía rápida para aprovechar al máximo las herramientas de búsqueda
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-findy-lightgray">🎯 Filtros Principales</h4>
              <ul className="space-y-2 text-sm text-findy-mediumgray">
                <li className="flex items-start gap-2">
                  <span className="text-findy-electric">•</span>
                  <span><strong>Rango de Precio:</strong> Ajusta min/max según tu presupuesto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-findy-orange">•</span>
                  <span><strong>Barrios:</strong> Selecciona zonas específicas de interés</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-findy-skyblue">•</span>
                  <span><strong>Tipo:</strong> Casa o Departamento según tu preferencia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-findy-magenta">•</span>
                  <span><strong>Tamaño:</strong> Metros cuadrados totales y cubiertos</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-findy-lightgray">📊 Visualizaciones</h4>
              <ul className="space-y-2 text-sm text-findy-mediumgray">
                <li className="flex items-start gap-2">
                  <span className="text-findy-fuchsia">•</span>
                  <span><strong>Mapa de Calor:</strong> Densidad de propiedades por zona</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-findy-electric">•</span>
                  <span><strong>Gráficos:</strong> Distribución de precios y tendencias</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-findy-orange">•</span>
                  <span><strong>Tablas:</strong> Listado detallado de propiedades</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-findy-skyblue">•</span>
                  <span><strong>Métricas:</strong> Estadísticas clave del mercado</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}