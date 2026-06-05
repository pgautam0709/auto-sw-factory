# Automotive Software Factory (ASF)

An AI-powered engineering pipeline that automates the generation of software artifacts for automotive vehicle features — from feature intake through to fleet intelligence. Built for Ford Motor Company's software-defined vehicle programs.

---

## Overview

The Automotive Software Factory transforms a plain-language feature description into a complete set of production-ready engineering artifacts, using large language models (Azure OpenAI / OpenAI GPT-4o) at each pipeline stage. When no API key is configured the system falls back to high-fidelity simulation data so the full pipeline can be demonstrated without credentials.

```
Feature Intake → Requirements → Development → Validation → Quality Gate → Release → Fleet Intelligence
```

---

## Features

- **7-stage automated pipeline** — each stage generates structured artifacts from the previous stage's output
- **AI-backed generation** — Azure OpenAI (primary) or OpenAI (fallback) with JSON-structured responses
- **Mock/simulation fallback** — full pipeline available without any API key
- **Feature Registry** — persisted history of all processed features with full artifact browsing
- **Multi-program & multi-model-year tagging** — features can target CX7272, P550, P702 (or any combination) across MY2026–2028, or be marked Global
- **Missing-tag enforcement** — sidebar warning + inline assign form in the registry for untagged features
- **Ford corporate theme** — UI aligned to Ford brand colors using Tailwind CSS v4 custom tokens
- **LocalStorage persistence** — active feature, all artifacts, stats and full history survive page refresh
- **Executive Dashboard** — live factory metrics (features processed, requirements generated, validation runs, etc.)
- **Architecture Vision page** — interactive layer diagram of the factory's technical design

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + custom Ford theme tokens |
| UI Icons | Lucide React |
| Charts | Recharts |
| AI | Azure OpenAI / OpenAI SDK (`openai` v6) |
| State | React Context (`FactoryContext`) + localStorage |
| Runtime | Node.js 20+ |

---

## Project Structure

```
auto-sw-factory/
├── app/
│   ├── page.tsx                  # Executive Dashboard
│   ├── layout.tsx                # Root layout with Navbar + Providers
│   ├── globals.css               # Tailwind v4 theme (Ford color tokens)
│   ├── api/generate/route.ts     # Server-side AI generation endpoint
│   ├── intake/page.tsx           # Stage 1 — Feature Intake
│   ├── requirements/page.tsx     # Stage 2 — Requirements Generation
│   ├── development/page.tsx      # Stage 3 — Development Artifacts
│   ├── validation/page.tsx       # Stage 4 — Virtual Validation
│   ├── quality/page.tsx          # Stage 5 — Quality Gate
│   ├── release/page.tsx          # Stage 6 — Release Factory
│   ├── fleet/page.tsx            # Stage 7 — Fleet Intelligence
│   ├── features/page.tsx         # Feature Registry
│   └── architecture/page.tsx    # Architecture Vision
├── components/
│   ├── Navbar.tsx                # Sidebar navigation + active feature panel
│   ├── MetricCard.tsx            # Dashboard metric card
│   ├── PipelineBar.tsx           # Pipeline progress indicator
│   └── Providers.tsx             # Context provider wrapper
├── context/
│   └── FactoryContext.tsx        # Global state, localStorage sync, history
├── services/ai/
│   └── openAIService.ts          # Azure OpenAI / OpenAI client + mock fallback
├── prompts/
│   └── index.ts                  # Structured prompts for each pipeline stage
├── data/
│   └── mockData.ts               # High-fidelity simulation data
└── types/
    └── index.ts                  # All TypeScript interfaces and types
```

---

## Pipeline Stages

### Stage 1 — Feature Intake
The entry point. The engineer provides:
- **Feature name** — plain-language description (e.g. "Automatic Emergency Braking")
- **Program Code(s)** — one or more of `CX7272`, `P550`, `P702` (or Global)
- **Model Year(s)** — one or more of `MY2026`, `MY2027`, `MY2028` (or Global)
- **Feature description** — optional context for the AI

### Stage 2 — Requirements Generation
AI generates ISO 26262-aligned engineering artifacts:
- System requirements with category and priority (High / Medium / Low)
- User stories in standard format
- Acceptance criteria

### Stage 3 — Development Artifacts
From requirements, AI generates:
- Microservice design (name, tech stack, responsibilities)
- REST API contract (endpoints, methods, payloads)
- Unit test scaffolding

### Stage 4 — Virtual Validation
Simulates a 1,000-vehicle validation run:
- Pass rate, failure count, total vehicles
- Per-vehicle results with status and metadata
- Anomaly flags

### Stage 5 — Quality Gate
Computes a quality score across four dimensions:
- Functional Safety, Performance, Code Coverage, Integration
- Overall score out of 100
- Pass / Review determination (threshold: 85)
- AI recommendations per dimension

### Stage 6 — Release Factory
Generates the OTA release package:
- Semantic version number
- Phased deployment plan (% rollout per phase, criteria, status)
- Change log
- Target vehicle count

### Stage 7 — Fleet Intelligence
Closes the software lifecycle loop:
- Deployment success rate across the live fleet
- Failure cluster analysis by region, model, severity
- 7-day trend data (success rate + active vehicles)
- AI-generated improvement recommendations

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
git clone git@github-cog:pgautam0709/auto-sw-factory.git
cd auto-sw-factory
npm install
```

### Environment Variables

Create a `.env.local` file in the project root. The app works in simulation mode with no keys set.

#### Option A — Azure OpenAI (recommended for Cognizant/Ford environments)

```env
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4o          # optional, defaults to gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-01     # optional
```

#### Option B — OpenAI

```env
OPENAI_API_KEY=sk-...
```

> If neither is set, all pipeline stages automatically use high-fidelity mock data — no degraded functionality.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run start
```

---

## Feature Registry

Every feature submitted through Feature Intake is automatically saved to the registry and persisted in `localStorage`. The registry (`/features`) provides:

- Full list of all processed features, newest first
- **Active / Complete / Missing Tags** status badges per feature
- Stage pipeline strip — visual indicator of how far each feature has progressed
- **Artifact panel** (expandable) — key metrics from each completed stage
- **Load / Continue** — restore any past feature as the active session and resume from its last stage
- **Inline tag assignment** — assign Program Code(s) and Model Year(s) directly from the registry card without re-running intake

### Missing Tags Enforcement

If a feature is submitted without Program Code and Model Year tags (e.g. features created before tagging was introduced), the sidebar shows a persistent amber warning banner linking to the Feature Registry. Each untagged card in the registry shows an inline assign form.

---

## Data Persistence

All state is persisted to `localStorage` under the `asf_` key prefix:

| Key | Contents |
|---|---|
| `asf_feature` | Active feature object |
| `asf_requirements` | Generated requirements |
| `asf_development` | Development artifacts |
| `asf_validation` | Validation results |
| `asf_quality` | Quality metrics |
| `asf_release` | Release package |
| `asf_fleet` | Fleet intelligence |
| `asf_stage` | Current pipeline stage |
| `asf_stats` | Dashboard counters |
| `asf_history` | Full feature history array |

Resetting the factory (via the dashboard) clears the active session keys but preserves history and stats.

---

## AI Prompt Architecture

Prompts live in `prompts/index.ts` as typed template functions. Each prompt:
- Provides the feature name and any relevant upstream context
- Instructs the model to respond as strict JSON matching the target TypeScript interface
- Is validated by parsing the response with `JSON.parse`

The server-side API route (`app/api/generate/route.ts`) handles all AI calls, keeping API keys server-side only.

---

## Program Codes & Model Years

| Code | Program |
|---|---|
| `CX7272` | — |
| `P550` | — |
| `P702` | — |

| Option | Years |
|---|---|
| Specific | MY2026, MY2027, MY2028 |
| Global | Applies to all programs and model years |

A feature can be tagged to any combination of program codes and model years, or marked **Global** to indicate it applies platform-wide.

---

## Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

---

## Contributing

1. Branch from `main` using `feature/<name>` or `fix/<name>`
2. Keep TypeScript strict — `npx tsc --noEmit` must pass with zero errors
3. Ensure the mock fallback still works (do not require an API key for any UI flow)
4. Open a pull request against `main`

---


