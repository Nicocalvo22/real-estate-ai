# Real Estate AI Platform

AI-powered real estate investment platform built with Next.js 15, TypeScript, and multiple AI providers.

## Features

- **Multi-AI Integration**: OpenAI GPT-4, Anthropic Claude-3-Opus, and Mistral AI
- **Real Estate Analytics**: Property analysis, market insights, and CMA generation
- **CSV Data Processing**: Real-time analysis of property data from Córdoba, Argentina
- **Interactive Dashboard**: Market trends, opportunity zones, and property search
- **Looker Studio Integration**: Embedded analytics dashboard
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (currently disabled for development)
- **AI APIs**: OpenAI, Anthropic, Mistral
- **Data**: CSV processing with real Córdoba property data
- **Authentication**: Supabase Auth (disabled in development)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd real-estate-ai
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
- Supabase credentials
- OpenAI API key
- Anthropic API key
- Mistral API key
- Google Maps API key

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Building for Production

```bash
npm run build
npm run start
```

## Deployment on Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/real-estate-ai)

### Manual Deployment

1. **Fork/Clone this repository to your GitHub account**

2. **Create a new project on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables in Vercel:**
   - In your Vercel project settings, go to "Environment Variables"
   - Add all variables from `.env.example`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
     OPENAI_API_KEY=your_openai_key
     ANTHROPIC_API_KEY=your_anthropic_key
     MISTRAL_API_KEY=your_mistral_key
     GOOGLE_API_KEY=your_google_key
     ```

4. **Deploy:**
   - Vercel will automatically build and deploy your application
   - Your app will be available at `https://your-project-name.vercel.app`

### Build Configuration

The project is configured for Vercel deployment with:
- Next.js 15 support
- Automatic TypeScript compilation
- Optimized production builds
- Environment variable handling

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes for AI analysis
│   ├── dashboard/         # Protected dashboard pages
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   └── analytics/        # Analytics components
├── lib/                  # Utilities and configurations
├── data/                 # CSV data files
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

## Development Status

⚠️ **Authentication is currently disabled** for development purposes. All Supabase authentication checks are commented out. To re-enable:

1. Uncomment authentication code in:
   - `middleware.ts`
   - `app/dashboard/layout.tsx`
   - Auth-related components

2. Configure Supabase properly with valid credentials

## CSV Data

The platform uses real property data from Córdoba, Argentina (`data/ZPAgosto.csv`) with:
- Property types: Casa, Departamento
- 50+ neighborhoods in Córdoba
- Price, size, and location data
- Real-time market analytics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.