import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { runAgent, runAgentWithStructuredOutput } from "@/lib/ai/agent-system"
import { MarketInsightsCard } from "@/components/analytics/market-insights-card"
import { OpportunityZonesCard } from "@/components/analytics/opportunity-zones-card"
import { InvestmentStrategyGenerator } from "@/components/analytics/investment-strategy-generator"
import { z } from "zod"

// Schema for structured market analysis
const marketAnalysisSchema = z.object({
  summary: z.string(),
  keyTrends: z.array(
    z.object({
      trend: z.string(),
      impact: z.string(),
      confidence: z.number().min(0).max(100),
    }),
  ),
  hotMarkets: z.array(
    z.object({
      location: z.string(),
      priceChange: z.string(),
      inventory: z.string(),
      outlook: z.string(),
    }),
  ),
  investmentRecommendations: z.array(
    z.object({
      strategy: z.string(),
      propertyType: z.string(),
      locations: z.array(z.string()),
      expectedReturn: z.string(),
      riskLevel: z.enum(["Low", "Medium", "High"]),
    }),
  ),
})

export default async function AnalyticsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get market trends data
  const { data: marketTrends } = await supabase
    .from("market_trends")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  // Get AI analysis of current market conditions
  const marketAnalysis = await runAgent(
    "market-analyzer",
    "Provide a comprehensive analysis of the current US real estate market conditions, focusing on trends in the last 30 days.",
  )

  // Get AI prediction of future trends
  const trendPrediction = await runAgent(
    "trend-predictor",
    "Predict the likely trends in the US real estate market over the next 3, 6, and 12 months.",
  )

  // Get structured market analysis
  const structuredAnalysis = await runAgentWithStructuredOutput(
    "market-analyzer",
    "Analyze the current US real estate market and provide structured insights on trends, hot markets, and investment recommendations.",
    marketAnalysisSchema,
  )

  // Get top markets for analysis
  const topMarkets = structuredAnalysis.hotMarkets.map((market) => market.location).slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Analytics</h1>
        <p className="text-muted-foreground">AI-powered insights into real estate market trends</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunity Zones</TabsTrigger>
          <TabsTrigger value="strategy">Investment Strategy</TabsTrigger>
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Market Analysis</CardTitle>
              <CardDescription>AI-generated analysis of current market conditions</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: marketAnalysis }} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Median Home Prices</CardTitle>
                <CardDescription>National median home prices over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Price trend chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inventory Levels</CardTitle>
                <CardDescription>Available housing inventory over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Inventory chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Market Trends</CardTitle>
              <CardDescription>AI-identified trends and their impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {structuredAnalysis.keyTrends.map((trend, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{trend.trend}</h3>
                      <div className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {trend.confidence}% confidence
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{trend.impact}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {topMarkets.map((market, index) => (
            <MarketInsightsCard key={index} region={market} />
          ))}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          {topMarkets.map((market, index) => (
            <OpportunityZonesCard key={index} region={market} />
          ))}
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <InvestmentStrategyGenerator defaultRegion={topMarkets[0] || ""} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Trends by Property Type</CardTitle>
              <CardDescription>How different property types are performing</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Property type comparison chart will appear here</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Single Family Homes</CardTitle>
                <CardDescription>Price trends for single family homes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+3.2%</div>
                <p className="text-xs text-muted-foreground">Year over year change</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Condos & Townhomes</CardTitle>
                <CardDescription>Price trends for condos and townhomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+1.8%</div>
                <p className="text-xs text-muted-foreground">Year over year change</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Multi-Family</CardTitle>
                <CardDescription>Price trends for multi-family properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+4.5%</div>
                <p className="text-xs text-muted-foreground">Year over year change</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Market Predictions</CardTitle>
              <CardDescription>AI-generated predictions for future market trends</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: trendPrediction }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
