import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, DollarSign, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  // TEMPORALMENTE DESHABILITADO - Para habilitar, descomenta:
  // const supabase = createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // // Get latest deals
  // const { data: latestDeals } = await supabase
  //   .from("real_estate_listings")
  //   .select("*")
  //   .order("deal_score", { ascending: false })
  //   .limit(5)

  // // Get saved properties
  // const { data: savedProperties } = await supabase
  //   .from("user_saved_listings")
  //   .select("*, real_estate_listings(*)")
  //   .eq("user_id", user?.id)
  //   .limit(5)

  // Mock data para desarrollo
  const user = { email: "demo@example.com" }
  const profile = { full_name: "Usuario Demo" }
  const latestDeals = [
    {
      id: "1",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip_code: "94102",
      price: 750000,
      bedrooms: 3,
      bathrooms: 2,
      square_feet: 1200,
      deal_score: 15,
      image_url: null
    },
    {
      id: "2",
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip_code: "90210",
      price: 650000,
      bedrooms: 2,
      bathrooms: 2,
      square_feet: 1000,
      deal_score: 12,
      image_url: null
    }
  ]
  const savedProperties = []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name || user?.email?.split("@")[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/deals">
            <Button>View All Deals</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals Found</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">254</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Deal Discount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Upward</div>
            <p className="text-xs text-muted-foreground">+3.1% in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deals">Latest Deals</TabsTrigger>
          <TabsTrigger value="saved">Saved Properties</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="deals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestDeals?.map((deal) => (
              <Card key={deal.id}>
                <CardHeader className="p-0">
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={deal.image_url || `/placeholder.svg?height=200&width=300`}
                      alt={deal.address}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CardHeader>
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
                  <div className="mt-4">
                    <Link href={`/dashboard/property/${deal.id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/dashboard/deals">
              <Button variant="outline">View All Deals</Button>
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="saved" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedProperties?.map((saved) => {
              const property = saved.real_estate_listings
              return (
                <Card key={saved.id}>
                  <CardHeader className="p-0">
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={property?.image_url || `/placeholder.svg?height=200&width=300`}
                        alt={property?.address}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div>
                      <h3 className="font-semibold">{property?.address}</h3>
                      <p className="text-sm text-muted-foreground">
                        {property?.city}, {property?.state} {property?.zip_code}
                      </p>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="text-lg font-bold">${property?.price.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {property?.bedrooms} bd | {property?.bathrooms} ba | {property?.square_feet.toLocaleString()}{" "}
                        sqft
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link href={`/dashboard/property/${property?.id}`}>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="flex justify-center">
            <Link href="/dashboard/saved">
              <Button variant="outline">View All Saved Properties</Button>
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
              <CardDescription>Real-time analysis of the US real estate market</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Market trend visualization will appear here</p>
                <Link href="/dashboard/analytics">
                  <Button variant="outline" className="mt-4">
                    View Detailed Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
