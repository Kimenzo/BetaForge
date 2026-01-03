# BetaForge

**AI-Powered Beta Testing Platform** — Deploy diverse AI agents to test your web, mobile, and desktop applications and receive human-like bug reports.

## Overview

BetaForge uses autonomous AI agents powered by Claude to thoroughly test your applications. Each agent has a unique persona and testing style, simulating the diversity of your real user base:

| Agent      | Persona                    | Focus Area                         |
| ---------- | -------------------------- | ---------------------------------- |
| **Sarah**  | The Cautious Explorer      | Accessibility, unclear UX          |
| **Marcus** | The Power User             | Keyboard shortcuts, performance    |
| **Ahmed**  | The Accessibility Advocate | Screen readers, ARIA, keyboard nav |
| **Lin**    | The Mobile-First User      | Small viewports, touch, offline    |
| **Diego**  | The Chaos Tester           | Error boundaries, security         |
| **Emma**   | The Average User           | Happy paths, general UX            |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Anthropic API key
- Supabase project (optional for persistence)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your API keys
# Required: ANTHROPIC_API_KEY
# Optional: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```text
betaforge/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── test-sessions/  # Test session management
│   │   └── webhooks/       # CI/CD webhook receiver
│   ├── dashboard/          # Dashboard pages
│   │   ├── projects/       # Project management
│   │   └── reports/        # Bug reports
│   ├── agents/             # Agent profiles page
│   ├── sessions/           # Test session detail
│   └── reports/            # Bug report detail
├── lib/                    # Core libraries
│   ├── agents.ts           # Agent persona definitions
│   ├── orchestrator.ts     # Agent orchestration logic
│   ├── supabase.ts         # Database client
│   ├── types.ts            # TypeScript definitions
│   └── utils.ts            # Utility functions
└── components/             # Reusable UI components
```

## Features

### Current (Phase 1 MVP)

- ✅ Dashboard with project management
- ✅ Agent personas with distinct testing styles
- ✅ Basic bug report structure
- ✅ Real-time session streaming (SSE)
- ✅ Webhook receiver for CI/CD integration

### Planned (Phase 2)

- Multi-agent parallel testing
- Screenshot and video capture
- Playwright integration for actual browser control
- Mobile testing via simulators
- Enhanced bug reports with console/network logs

### Future (Phase 3)

- Custom agent creation
- Test scenario definition
- Regression testing with memory
- Performance metrics (Core Web Vitals)
- Team collaboration features

## API Endpoints

### Start a Test Session

```bash
POST /api/test-sessions
Content-Type: application/json

{
  "projectId": "uuid",
  "targetUrl": "https://your-app.com"
}
```

### Stream Session Events (SSE)

```bash
GET /api/test-sessions/[id]/stream
```

### Webhook Receiver

```bash
POST /api/webhooks

# Supports: GitHub, GitLab, Bitbucket
```

## Environment Variables

| Variable                        | Required | Description               |
| ------------------------------- | -------- | ------------------------- |
| `ANTHROPIC_API_KEY`             | Yes      | Claude API key            |
| `NEXT_PUBLIC_SUPABASE_URL`      | No       | Supabase project URL      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No       | Supabase anon key         |
| `SUPABASE_SERVICE_ROLE_KEY`     | No       | Supabase service role key |
| `NEXT_PUBLIC_APP_URL`           | No       | Application URL           |

## Development

```bash
# Run development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Database**: Supabase (Postgres)
- **Icons**: Lucide React

## License

MIT
