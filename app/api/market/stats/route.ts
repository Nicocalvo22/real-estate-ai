import { NextRequest, NextResponse } from 'next/server'
import { getMarketStats } from '@/lib/csv-analyzer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyType = searchParams.get('propertyType') || 'all'
    const neighborhood = searchParams.get('neighborhood') || 'all'

    const stats = await getMarketStats(propertyType, neighborhood)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching market stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market statistics' },
      { status: 500 }
    )
  }
}