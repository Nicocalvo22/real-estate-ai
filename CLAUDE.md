# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

**Note:** This project uses standard `npm` commands as defined in package.json.

## ⚠️ IMPORTANT: Supabase Authentication Status

**CURRENTLY DISABLED** - La autenticación de Supabase está temporalmente deshabilitada para desarrollo:

**Server-side (Páginas):**
- `middleware.ts` - Middleware de autenticación comentado (líneas 6-9)
- `app/dashboard/layout.tsx` - Check de usuario comentado (líneas 13-20)
- `app/page.tsx` - Redirect automático comentado (líneas 9-16)
- `app/dashboard/page.tsx` - Queries a Supabase comentadas, datos mock agregados
- `app/dashboard/deals/page.tsx` - Conexión DB comentada, datos demo agregados
- `app/dashboard/property/[id]/page.tsx` - Análisis AI y queries comentadas, datos mock

**Client-side (Componentes):**
- `components/auth/login-form.tsx` - Login simulado sin Supabase
- `components/auth/signup-form.tsx` - Registro simulado sin Supabase
- `components/dashboard/sidebar.tsx` - SignOut simulado sin Supabase
- `components/dashboard/sidebar-spanish.tsx` - SignOut simulado sin Supabase
- `components/property/save-property-button.tsx` - Funcionalidad simulada sin DB
- `components/dashboard/header.tsx` - Usuario mock sin conexión DB

**Auth Routes:**
- `app/login/page.tsx` - Página login sin redirects automáticos
- `app/signup/page.tsx` - Página signup sin redirects automáticos
- `app/auth/confirm/page.tsx` - Confirmación simulada sin verificación
- `app/auth/signout/route.ts` - SignOut simulado sin auth

**AI System:**
- `lib/ai/agent-system.ts` - Import de Supabase comentado
- `lib/ai/tools/index.ts` - Import de Supabase comentado

Todas las rutas del dashboard son accesibles sin autenticación y sin errores de API keys. Para reactivar, descomenta las líneas marcadas con "TEMPORALMENTE DESHABILITADO".

## Architecture Overview

This is an **AI-powered real estate investment platform** built with:
- **Next.js 15** with App Router
- **TypeScript** with strict mode
- **Supabase** for database and authentication
- **shadcn/ui + Tailwind CSS** for UI components
- **Multiple AI APIs** (OpenAI GPT-4o, Anthropic Claude-3-Opus, Mistral)
- **Local CSV data source** for property listings

### Key Architectural Patterns

**App Router Structure:**
- `/app/page.tsx` - Landing with auth check
- `/app/dashboard/` - Protected dashboard area
- `/app/auth/` - Authentication flow
- `/app/api/` - Backend API routes for AI analysis and property data

**Component Architecture:**
- Uses **compound components** with Radix UI primitives
- **shadcn/ui** components in `/components/ui/`
- **Feature-based organization** (auth, dashboard, analytics, property)
- All components use TypeScript interfaces and forwardRef pattern

**Authentication & Security:**
- **Supabase Auth** with middleware-based protection *(CURRENTLY DISABLED)*
- Server-side session management in `middleware.ts` *(COMMENTED OUT)*
- Protected routes redirect authenticated users to `/dashboard` *(DISABLED)*

**Data Layer:**
- **CSV Client** for property data from `/data/properties.csv`
- **Supabase client** for user authentication only
- **Real-time data** from local CSV files
- TypeScript types in `/types/` directory
- **csv-parse** library for CSV processing

## AI Integration Architecture

The platform integrates multiple AI providers for different use cases:
- **Investment Strategy**: `/api/investment/strategy/` - Generates personalized investment strategies
- **Market Analysis**: `/api/market/insights/` - Provides market trend analysis
- **Property Analysis**: `/api/property/analysis/` - Analyzes individual properties
- **CMA Generation**: `/api/property/cma/` - Comparative Market Analysis

Each API route follows a pattern of:
1. Authentication check *(CURRENTLY DISABLED)*
2. Input validation
3. AI provider selection based on analysis type
4. Response formatting with consistent error handling

## Configuration & Environment

**Required Environment Variables:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI APIs
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
MISTRAL_API_KEY=

# CSV Data Configuration (optional)
CSV_FILE_NAME=properties.csv
CSV_DATA_PATH=./data

# Maps
GOOGLE_API_KEY=
```

**Key Config Files:**
- `/lib/config.ts` - Central configuration for all API keys and services
- `/components.json` - shadcn/ui configuration
- `middleware.ts` - Route protection and authentication

## Development Patterns

**Component Creation:**
- Use shadcn/ui components as base: `npx shadcn-ui@latest add [component]`
- Follow compound component pattern with Radix UI
- Always include TypeScript interfaces
- Use `cn()` utility for conditional classes

**API Route Development:**
- Follow pattern in existing routes (`/app/api/`)
- Include authentication checks for protected endpoints
- Use consistent error response format
- Implement proper TypeScript typing for request/response

**Database Operations:**
- Use typed Supabase client from `/lib/supabase/`
- Server operations use `createClient()` from server utils
- Client operations use `createClient()` from client utils
- Always handle RLS policies

**Styling Guidelines:**
- Use Tailwind CSS with custom design system in `tailwind.config.ts`
- CSS variables for theme colors in `globals.css`
- Dark mode support via `next-themes`
- Mobile-first responsive design

## Special Features

**CSV Data Management:**
- Property data is stored in `/data/ZPAgosto.csv` (ZonaProp data from Córdoba, Argentina)
- CSV structure: Fuente/Origen,Titulo_URL,Precio,Latitud,Longitud,Dirección,Barrio/Zona,Provincia,Tipología/Producto,google_maps,Fecha de publicación,Vendedor,m2 totales,m2 cubiertos,Dormitorios,Baños
- Real-time CSV analysis via `/lib/csv-analyzer.ts` utility functions
- Market statistics API at `/app/api/market/stats/route.ts`

**v0.dev Integration:**
- Project auto-syncs with v0.dev (ID: Xt5V3kIYfuz)
- UI components can be generated and imported directly

**Subscription Tiers:**
- Free, Basic, Premium tiers implemented
- Feature gating based on subscription level
- Check user tier in components and API routes

## Common Tasks

**Adding New AI Analysis:**
1. Create API route in `/app/api/`
2. Add corresponding component in `/components/`
3. Update configuration in `/lib/config.ts`
4. Add TypeScript types in `/types/`

**Creating New Dashboard Feature:**
1. Add route in `/app/dashboard/[feature]/`
2. Create components in `/components/dashboard/`
3. Update navigation in dashboard layout
4. Ensure proper authentication checks

**Market Analytics Features:**
- **Dynamic Market Trends**: `/components/analytics/market-trends-filter.tsx` provides real-time filtering by property type and neighborhood
- **CSV Data Processing**: `/lib/csv-analyzer.ts` contains utilities for:
  - `getMarketStats(propertyType, neighborhood)`: Calculate market statistics for filtered data
  - `getUniqueValues()`: Extract unique neighborhoods and property types from CSV
- **Real-time Statistics**: Market trends tab shows live data from ZPAgosto.csv with filters for:
  - Property Types: Casa, Departamento (based on actual CSV data)
  - Neighborhoods: 50+ actual neighborhoods from Córdoba dataset
  - Price ranges, average sizes, and property counts calculated dynamically
- **Opportunity Zones**: `/components/analytics/opportunity-zones-card-spanish.tsx` shows investment opportunities in Córdoba
  - Two active tabs: "🏆 Mejores Oportunidades" and "📍 Detalles de Zonas"
  - Investment strategy tab has been hidden for streamlined user experience
- **Property Search**: `/app/dashboard/search/page.tsx` includes embedded Looker Studio dashboard for interactive property exploration