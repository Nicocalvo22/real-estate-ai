import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
// import { runAgent } from "@/lib/ai/agent-system"

export default async function DealsPage() {
  // TEMPORALMENTE DESHABILITADO - Para habilitar, descomenta:
  // const supabase = createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // // Get user profile to check subscription tier
  // const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // // Get deals based on subscription tier
  // const dealLimit = profile?.subscription_tier === "premium" ? 50 : profile?.subscription_tier === "basic" ? 20 : 5

  // const { data: deals } = await supabase
  //   .from("real_estate_listings")
  //   .select("*")
  //   .order("deal_score", { ascending: false })
  //   .limit(dealLimit)

  // // Get AI analysis of top deals
  // const dealAnalysis = await runAgent(
  //   "deal-finder",
  //   "Analyze the current top real estate deals and explain why they represent good investment opportunities.",
  // )

  // Mock data para desarrollo
  const user = { email: "demo@example.com" }
  const profile = { subscription_tier: "basic" }
  const deals = [
    {
      id: "1",
      address: "123 Deal St",
      city: "Córdoba",
      state: "Córdoba",
      zip_code: "5000",
      price: 85000,
      bedrooms: 2,
      bathrooms: 1,
      square_feet: 800,
      deal_score: 20,
      image_url: null,
      property_type: "residential",
      deal_reasons: ["Below market value", "Great location"]
    },
    {
      id: "2",
      address: "456 Investment Ave",
      city: "Córdoba",
      state: "Córdoba",
      zip_code: "5001",
      price: 120000,
      bedrooms: 3,
      bathrooms: 2,
      square_feet: 1200,
      deal_score: 18,
      image_url: null,
      property_type: "residential",
      deal_reasons: ["High ROI potential", "Growing area"]
    }
  ]
  const dealAnalysis = "<h3>Análisis de Inversión</h3><p>Estas propiedades representan excelentes oportunidades debido a su ubicación estratégica en Córdoba y precios por debajo del mercado.</p>"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deal Alerts</h1>
        <p className="text-muted-foreground">Exceptional real estate deals identified by our AI agents</p>
      </div>

      {profile?.subscription_tier === "free" && (
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Upgrade for More Deals</h3>
                <p className="text-muted-foreground">
                  You're currently on the free plan with limited access. Upgrade to see more deals and get real-time
                  alerts.
                </p>
              </div>
              <Link href="/dashboard/subscription">
                <Button>Upgrade Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Deals</TabsTrigger>
          <TabsTrigger value="residential">Residential</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
          <TabsTrigger value="multi-family">Multi-Family</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Top Deals</h2>
                  <p className="text-muted-foreground">Properties with the highest deal scores</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">Filter</Button>
                  <Button variant="outline">Sort</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deals?.map((deal) => (
                  <Card key={deal.id} className="overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={deal.image_url || `/placeholder.svg?height=200&width=300`}
                        alt={deal.address}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{deal.address}</h3>
                          <p className="text-sm text-muted-foreground">
                            {deal.city}, {deal.state} {deal.zip_code}
                          </p>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {deal.deal_score}% Below Market
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="text-lg font-bold">${deal.price.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {deal.bedrooms} bd | {deal.bathrooms} ba | {deal.square_feet.toLocaleString()} sqft
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {deal.deal_reasons?.join(", ") ||
                            "Great investment opportunity with potential for appreciation."}
                        </p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/dashboard/property/${deal.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon">
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
                            className="h-4 w-4"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">AI Deal Analysis</h2>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: dealAnalysis }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="residential" className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Residential Deals</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deals
                  ?.filter((deal) => deal.property_type === "residential")
                  .map((deal) => (
                    <Card key={deal.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={deal.image_url || `/placeholder.svg?height=200&width=300`}
                          alt={deal.address}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{deal.address}</h3>
                            <p className="text-sm text-muted-foreground">
                              {deal.city}, {deal.state} {deal.zip_code}
                            </p>
                          </div>
                          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {deal.deal_score}% Below Market
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="text-lg font-bold">${deal.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {deal.bedrooms} bd | {deal.bathrooms} ba | {deal.square_feet.toLocaleString()} sqft
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/dashboard/property/${deal.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                          </Link>
                          <Button variant="outline" size="icon">
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
                              className="h-4 w-4"
                            >
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Commercial Deals</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deals
                  ?.filter((deal) => deal.property_type === "commercial")
                  .map((deal) => (
                    <Card key={deal.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={deal.image_url || `/placeholder.svg?height=200&width=300`}
                          alt={deal.address}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{deal.address}</h3>
                            <p className="text-sm text-muted-foreground">
                              {deal.city}, {deal.state} {deal.zip_code}
                            </p>
                          </div>
                          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {deal.deal_score}% Below Market
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="text-lg font-bold">${deal.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{deal.square_feet.toLocaleString()} sqft</div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/dashboard/property/${deal.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                          </Link>
                          <Button variant="outline" size="icon">
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
                              className="h-4 w-4"
                            >
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multi-family" className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Multi-Family Deals</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {deals
                  ?.filter((deal) => deal.property_type === "multi-family")
                  .map((deal) => (
                    <Card key={deal.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={deal.image_url || `/placeholder.svg?height=200&width=300`}
                          alt={deal.address}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{deal.address}</h3>
                            <p className="text-sm text-muted-foreground">
                              {deal.city}, {deal.state} {deal.zip_code}
                            </p>
                          </div>
                          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {deal.deal_score}% Below Market
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="text-lg font-bold">${deal.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {deal.bedrooms} units | {deal.square_feet.toLocaleString()} sqft
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/dashboard/property/${deal.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                          </Link>
                          <Button variant="outline" size="icon">
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
                              className="h-4 w-4"
                            >
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
