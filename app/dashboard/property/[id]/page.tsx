import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"
// import { runAgent } from "@/lib/ai/agent-system"
import { SavePropertyButton } from "@/components/property/save-property-button"
import { InvestmentCalculator } from "@/components/property/investment-calculator"
import { NeighborhoodAnalysis } from "@/components/property/neighborhood-analysis"
import { ValuationHistory } from "@/components/property/valuation-history"
import { CMAAnalysis } from "@/components/property/cma-analysis"
import { InvestmentAnalysisCard } from "@/components/property/investment-analysis-card"

export default async function PropertyPage({ params }: { params: { id: string } }) {
  // TEMPORALMENTE DESHABILITADO - Para habilitar, descomenta:
  // const supabase = createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // // Get property details
  // const { data: property } = await supabase.from("real_estate_listings").select("*").eq("id", params.id).single()

  // if (!property) {
  //   notFound()
  // }

  // // Check if property is saved by user
  // const { data: savedProperty } = await supabase
  //   .from("user_saved_listings")
  //   .select("*")
  //   .eq("user_id", user?.id)
  //   .eq("listing_id", property.id)
  //   .single()

  // // Get AI analysis of the property
  // const propertyAnalysis = await runAgent(
  //   "deal-finder",
  //   `Analyze this property in detail:
  //   Address: ${property.address}, ${property.city}, ${property.state} ${property.zip_code}
  //   Price: ${property.price}
  //   Details: ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, ${property.square_feet} sqft
  //   Year Built: ${property.year_built}
  //   Property Type: ${property.property_type}
  //
  //   Provide a detailed analysis of why this is a good deal, potential ROI, and any risks to consider.`,
  // )

  // // Get investment analysis
  // const investmentAnalysis = await runAgent(
  //   "investment-advisor",
  //   `Provide investment analysis for this property:
  //   Address: ${property.address}, ${property.city}, ${property.state} ${property.zip_code}
  //   Price: ${property.price}
  //   Details: ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, ${property.square_feet} sqft
  //   Year Built: ${property.year_built}
  //   Property Type: ${property.property_type}
  //
  //   Calculate potential ROI, cash flow, and appreciation. Consider both short-term rental and long-term rental scenarios.`,
  // )

  // // Get neighborhood analysis
  // const neighborhoodAnalysis = await runAgent(
  //   "neighborhood-analyst",
  //   `Analyze the neighborhood for this property:
  //   City: ${property.city}
  //   State: ${property.state}
  //   Zip Code: ${property.zip_code}
  //
  //   Provide insights on schools, crime rates, amenities, and future growth potential.`,
  // )

  // Mock data para desarrollo
  const user = { email: "demo@example.com" }
  const property = {
    id: params.id,
    address: "Av. Colón 1234",
    city: "Córdoba",
    state: "Córdoba",
    zip_code: "5000",
    price: 95000,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 850,
    year_built: 2018,
    property_type: "department",
    listing_status: "active",
    deal_score: 18,
    deal_reasons: ["Precio por debajo del mercado", "Excelente ubicación", "Construcción reciente"],
    image_url: null
  }
  const savedProperty = null
  const propertyAnalysis = "<h3>Análisis de la Propiedad</h3><p>Esta propiedad representa una excelente oportunidad de inversión debido a su ubicación estratégica en el centro de Córdoba y su precio competitivo.</p>"
  const investmentAnalysis = "<h3>Análisis de Inversión</h3><p>Con un ROI estimado del 8.5% anual, esta propiedad ofrece un flujo de caja positivo desde el primer mes.</p>"
  const neighborhoodAnalysis = "<h3>Análisis del Barrio</h3><p>El área cuenta con excelente conectividad, centros comerciales cercanos y alta demanda de alquiler.</p>"

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{property.address}</h1>
          <p className="text-muted-foreground">
            {property.city}, {property.state} {property.zip_code}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SavePropertyButton propertyId={property.id} isSaved={!!savedProperty} />
          <Button variant="outline">Share</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={property.image_url || `/placeholder.svg?height=400&width=800`}
                alt={property.address}
                className="h-full w-full object-cover"
              />
            </div>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="investment">Investment</TabsTrigger>
              <TabsTrigger value="neighborhood">Neighborhood</TabsTrigger>
              <TabsTrigger value="cma">CMA</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Property Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-lg font-semibold">${property.price.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="text-lg font-semibold">{property.bedrooms}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="text-lg font-semibold">{property.bathrooms}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Square Feet</p>
                      <p className="text-lg font-semibold">{property.square_feet.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Deal Score</h3>
                        <p className="text-sm text-muted-foreground">How good of a deal is this property</p>
                      </div>
                      <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        {property.deal_score}% Below Market
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Why This Is a Deal</h3>
                    <ul className="space-y-2">
                      {property.deal_reasons?.map((reason, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 mr-2 text-green-500 flex-shrink-0"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{reason}</span>
                        </li>
                      ))}
                      {!property.deal_reasons?.length && (
                        <li className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 mr-2 text-green-500 flex-shrink-0"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>Priced below comparable properties in the area</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <ValuationHistory propertyId={property.id} listingPrice={property.price} />
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Property Type</p>
                      <p className="font-semibold capitalize">{property.property_type}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Year Built</p>
                      <p className="font-semibold">{property.year_built}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Listing Status</p>
                      <p className="font-semibold capitalize">{property.listing_status}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Price per Sq Ft</p>
                      <p className="font-semibold">
                        ${Math.round(property.price / property.square_feet).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 mr-2 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Central Air</span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 mr-2 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Garage</span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 mr-2 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Fireplace</span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 mr-2 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Basement</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Property Analysis</CardTitle>
                  <CardDescription>In-depth analysis of this property's investment potential</CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: propertyAnalysis }} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="investment" className="space-y-4">
              <InvestmentAnalysisCard propertyId={property.id} />

              <InvestmentCalculator
                propertyPrice={property.price}
                propertyType={property.property_type}
                location={`${property.city}, ${property.state}`}
              />

              <Card>
                <CardHeader>
                  <CardTitle>AI Investment Analysis</CardTitle>
                  <CardDescription>Expert insights on this property as an investment</CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: investmentAnalysis }} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="neighborhood" className="space-y-4">
              <NeighborhoodAnalysis city={property.city} state={property.state} zipCode={property.zip_code} />

              <Card>
                <CardHeader>
                  <CardTitle>AI Neighborhood Analysis</CardTitle>
                  <CardDescription>Insights about the neighborhood and surrounding area</CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: neighborhoodAnalysis }} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cma" className="space-y-4">
              <CMAAnalysis propertyId={property.id} />
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>Detailed investment metrics and predictive analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="metrics">
                    <TabsList>
                      <TabsTrigger value="metrics">Financial Metrics</TabsTrigger>
                      <TabsTrigger value="scenarios">Investment Scenarios</TabsTrigger>
                      <TabsTrigger value="forecast">Value Forecast</TabsTrigger>
                    </TabsList>
                    <TabsContent value="metrics" className="mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Cap Rate</p>
                          <p className="text-lg font-semibold">5.8%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Cash on Cash Return</p>
                          <p className="text-lg font-semibold">8.2%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Gross Rent Multiplier</p>
                          <p className="text-lg font-semibold">16.5</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Debt Service Coverage Ratio</p>
                          <p className="text-lg font-semibold">1.5</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Break-Even Ratio</p>
                          <p className="text-lg font-semibold">85%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Operating Expense Ratio</p>
                          <p className="text-lg font-semibold">30%</p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="scenarios" className="mt-4">
                      <div className="space-y-4">
                        <div className="rounded-lg border p-3">
                          <h3 className="font-medium">Long-Term Rental</h3>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Monthly Rent</p>
                              <p className="font-medium">${Math.round(property.price * 0.005).toLocaleString()}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Monthly Cash Flow</p>
                              <p className="font-medium">${Math.round(property.price * 0.003).toLocaleString()}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Annual ROI</p>
                              <p className="font-medium">8.2%</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Vacancy Rate</p>
                              <p className="font-medium">5%</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <h3 className="font-medium">Short-Term Rental</h3>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                              <p className="font-medium">${Math.round(property.price * 0.008).toLocaleString()}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Monthly Cash Flow</p>
                              <p className="font-medium">${Math.round(property.price * 0.004).toLocaleString()}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Annual ROI</p>
                              <p className="font-medium">10.5%</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                              <p className="font-medium">75%</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <h3 className="font-medium">Fix and Flip</h3>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Renovation Cost</p>
                              <p className="font-medium">${Math.round(property.price * 0.15).toLocaleString()}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">After Repair Value</p>
                              <p className="font-medium">${Math.round(property.price * 1.3).toLocaleString()}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">Potential Profit</p>
                              <p className="font-medium">
                                ${Math.round(property.price * 1.3 - property.price * 1.15).toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">ROI</p>
                              <p className="font-medium">15%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="forecast" className="mt-4">
                      <div className="space-y-4">
                        <div className="rounded-lg border p-3">
                          <h3 className="font-medium">Value Forecast</h3>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">1 Year</p>
                              <p className="font-medium">${Math.round(property.price * 1.04).toLocaleString()}</p>
                              <p className="text-xs text-green-600">+4.0%</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">3 Years</p>
                              <p className="font-medium">${Math.round(property.price * 1.12).toLocaleString()}</p>
                              <p className="text-xs text-green-600">+12.0%</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">5 Years</p>
                              <p className="font-medium">${Math.round(property.price * 1.22).toLocaleString()}</p>
                              <p className="text-xs text-green-600">+22.0%</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <h3 className="font-medium">Rental Forecast</h3>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">1 Year</p>
                              <p className="font-medium">
                                ${Math.round(property.price * 0.005 * 1.03).toLocaleString()}/mo
                              </p>
                              <p className="text-xs text-green-600">+3.0%</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">3 Years</p>
                              <p className="font-medium">
                                ${Math.round(property.price * 0.005 * 1.09).toLocaleString()}/mo
                              </p>
                              <p className="text-xs text-green-600">+9.0%</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs text-muted-foreground">5 Years</p>
                              <p className="font-medium">
                                ${Math.round(property.price * 0.005 * 1.16).toLocaleString()}/mo
                              </p>
                              <p className="text-xs text-green-600">+16.0%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Purchase Price</span>
                  <span className="font-semibold">${property.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Market Value</span>
                  <span className="font-semibold">
                    ${Math.round(property.price * (1 + property.deal_score / 100)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Potential Equity</span>
                  <span className="font-semibold text-green-600">
                    ${Math.round(property.price * (property.deal_score / 100)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Monthly Rent</span>
                  <span className="font-semibold">${Math.round(property.price * 0.005).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Monthly Expenses</span>
                  <span className="font-semibold">${Math.round(property.price * 0.002).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Cash Flow</span>
                  <span className="font-semibold text-green-600">
                    ${Math.round(property.price * 0.003).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cap Rate</span>
                  <span className="font-semibold">
                    {(Math.round(((property.price * 0.003 * 12) / property.price) * 1000) / 10).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cash on Cash Return</span>
                  <span className="font-semibold">
                    {(Math.round(((property.price * 0.003 * 12) / (property.price * 0.2)) * 1000) / 10).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Premier Real Estate</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Button>Call Agent</Button>
                <Button variant="outline">Email Agent</Button>
                <Button variant="outline">Schedule Viewing</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
