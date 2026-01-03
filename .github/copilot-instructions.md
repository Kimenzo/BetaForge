# BetaForge - AI-Powered Beta Testing Platform

## Project Overview
BetaForge deploys autonomous AI agents (powered by Claude) to test web, mobile, and desktop applications. Each agent has a unique testing persona and generates human-like bug reports.

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Database**: Supabase (Postgres)
- **Icons**: Lucide React

## Development Commands
```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure
```
betaforge/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   ├── dashboard/          # Dashboard pages
│   ├── agents/             # Agent profiles
│   ├── sessions/           # Test session detail
│   └── reports/            # Bug report detail
├── lib/                    # Core libraries
│   ├── agents.ts           # Agent persona definitions
│   ├── orchestrator.ts     # Agent orchestration
│   ├── supabase.ts         # Database client
│   ├── types.ts            # TypeScript definitions
│   └── utils.ts            # Utilities
└── components/             # Reusable UI components
```

## Environment Variables
Copy `.env.local.example` to `.env.local` and configure:
- `ANTHROPIC_API_KEY` (required)
- `NEXT_PUBLIC_SUPABASE_URL` (optional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)

## Agent Personas
1. **Sarah** - Cautious Explorer (accessibility, UX clarity)
2. **Marcus** - Power User (keyboard shortcuts, performance)
3. **Ahmed** - Accessibility Advocate (screen readers, ARIA)
4. **Lin** - Mobile-First User (small viewports, touch)
5. **Diego** - Chaos Tester (error boundaries, security)
6. **Emma** - Average User (happy paths, general UX)

## Key Features
- Dashboard with project management
- Real-time test session monitoring (SSE)
- Detailed bug reports with reproduction steps
- CI/CD webhook integration (GitHub, GitLab, Bitbucket)
