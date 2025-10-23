# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

QuantMind is an AI Trading Benchmark Platform showcasing real-time performance of multiple AI models trading in cryptocurrency markets. Built with React 19, TypeScript, and Vite, featuring a Notion-style minimalist design with light/dark mode.

## Tech Stack

- **Frontend:** React 19 + TypeScript, Vite 7, Tailwind CSS 4
- **UI:** shadcn/ui components (New York style)
- **Charts:** Recharts
- **Routing:** Wouter
- **Server:** Express (production static file serving)
- **Package Manager:** pnpm (required)

## Commands

### Development
```bash
pnpm dev              # Start dev server on http://localhost:3000
pnpm check            # TypeScript type checking (no emit)
pnpm format           # Format code with Prettier
```

### Build & Production
```bash
pnpm build            # Build client to dist/public + bundle server to dist/
pnpm start            # Run production server (NODE_ENV=production)
pnpm preview          # Preview production build locally
```

### Testing
No test scripts are configured. To add tests, use vitest (already in devDependencies).

## Architecture

### Directory Structure
```
quantmind/
├── client/src/           # Frontend React application
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui component library
│   │   └── *.tsx        # Custom components (Header, CryptoTicker, etc.)
│   ├── contexts/        # React contexts (ThemeContext)
│   ├── pages/           # Route pages (Home, Leaderboard, NotFound)
│   ├── lib/             # Utilities and mock data
│   ├── hooks/           # Custom React hooks
│   └── App.tsx          # Root app with routing
├── server/              # Express production server
├── shared/              # Shared constants between client/server
└── patches/             # pnpm patches (wouter@3.7.1)
```

### Import Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

### Key Architectural Patterns

**Theme System:**
- Managed via `ThemeContext.tsx` with localStorage persistence
- Switchable light/dark mode controlled by `ThemeProvider` prop `switchable`
- Theme classes applied to `<html>` element
- CSS variables defined in `client/src/index.css` for both `:root` (light) and `.dark` (dark mode)

**Routing:**
- Uses Wouter (lightweight alternative to React Router)
- Routes defined in `App.tsx`: `/` (Home), `/leaderboard`, `/404`
- Client-side routing with fallback to NotFound component

**Data Layer:**
- Currently uses mock data from `client/src/lib/mockData.ts`
- Data structures: `AIModel`, `CryptoPrice`, `PerformanceDataPoint`, `Trade`
- Performance data generated dynamically via `generatePerformanceData()`

**Component Architecture:**
- shadcn/ui components in `components/ui/` (styled with Tailwind + CSS variables)
- Custom business components at `components/` level
- Pages consume components and manage layout
- Error boundaries implemented via `ErrorBoundary.tsx`

### Build Configuration

**Vite (vite.config.ts):**
- Dev server port: 3000 (non-strict, finds next available)
- Root: `client/`
- Build output: `dist/public/`
- Plugins: React, Tailwind CSS 4, jsx-loc, manus-runtime

**TypeScript (tsconfig.json):**
- ESM modules with bundler resolution
- Strict mode enabled
- JSX preserve (handled by Vite)
- Includes: `client/src`, `shared`, `server`
- No emit (build handled by Vite/esbuild)

**Production Server:**
- Express serves static files from `dist/public/`
- Handles client-side routing (all routes → index.html)
- Server bundled via esbuild to `dist/index.js`

## Code Style

**Prettier Configuration:**
- 2 spaces, semicolons, double quotes
- 80 char line width
- Arrow function parens: avoid
- Trailing commas: ES5

**Component Conventions:**
- Functional components with TypeScript
- Props interfaces defined inline or exported
- Use `useTheme()` hook for theme access
- Consistent file naming: PascalCase for components

## Development Notes

### Adding New AI Models
Edit `client/src/lib/mockData.ts` → `aiModels` array with model metadata (name, color, performance metrics).

### Adding shadcn/ui Components
Configuration in `components.json` (New York style, neutral base color). Components install to `@/components/ui`.

### Theme Customization
Modify CSS variables in `client/src/index.css` under `:root` (light) and `.dark` (dark mode) sections. Use OKLCH color format.

### Port Conflicts
Vite automatically finds next available port if 3000 is busy. Check terminal output for actual port.

## Dependencies

**Critical:**
- `pnpm@10.4.1+` (exact version specified in packageManager)
- Node.js 22.x (specified in README)

**Patches:**
- `wouter@3.7.1` has custom patch in `patches/` directory

**Overrides:**
- `tailwindcss>nanoid` pinned to `3.3.7`
