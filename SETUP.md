# QuantMind - Setup Instructions

## Overview
QuantMind is an AI Trading Benchmark platform with a Notion-style minimalist design, featuring light/dark mode toggle, real-time crypto ticker, performance charts, and leaderboard.

## Features
✅ Beautiful animated light/dark mode toggle
✅ Notion-style minimalist design
✅ Real-time crypto price ticker
✅ Interactive performance charts (Recharts)
✅ AI model leaderboard
✅ Fully responsive layout
✅ Increased readability (18px base font)
✅ Smooth theme transitions

## Tech Stack
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Routing:** Wouter
- **Language:** TypeScript

## Prerequisites
- Node.js 22.x or higher
- pnpm (recommended) or npm

## Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
alpha-arena/
├── client/
│   ├── public/
│   │   └── logo.svg
│   └── src/
│       ├── components/
│       │   ├── ui/              # shadcn/ui components
│       │   ├── Header.tsx       # Navigation header
│       │   ├── CryptoTicker.tsx # Price ticker
│       │   ├── PerformanceChart.tsx
│       │   ├── TradeFeed.tsx
│       │   ├── ContentPanel.tsx
│       │   └── ThemeToggle.tsx  # Light/dark mode toggle
│       ├── contexts/
│       │   └── ThemeContext.tsx # Theme management
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Leaderboard.tsx
│       │   └── NotFound.tsx
│       ├── lib/
│       │   ├── utils.ts
│       │   └── mockData.ts      # Sample trading data
│       ├── App.tsx              # Main app with routing
│       ├── index.css            # Global styles & theme
│       └── main.tsx             # Entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Theme Toggle

The theme toggle is located in the top-right corner of the header. Click to switch between light and dark modes. Your preference is saved in localStorage.

## Customization

### Colors
Edit `client/src/index.css` to customize the color palette:
- Light mode: `:root` section
- Dark mode: `.dark` section

### Mock Data
Edit `client/src/lib/mockData.ts` to change:
- AI model names and performance
- Trading activity
- Crypto prices

### Content
Edit pages in `client/src/pages/`:
- `Home.tsx` - Main landing page
- `Leaderboard.tsx` - Model rankings

## Build for Production

```bash
pnpm build
# or
npm run build
```

Output will be in `client/dist/`

## Deployment

### Recommended Platforms
- **Vercel:** Connect GitHub repo, auto-deploy
- **Netlify:** Drag & drop `client/dist/` folder
- **Cloudflare Pages:** Connect GitHub, auto-deploy

### Build Settings
- **Build Command:** `pnpm build`
- **Output Directory:** `client/dist`
- **Node Version:** 22.x

## Environment Variables

No environment variables required for the static site.

## Troubleshooting

### Theme not switching?
- Clear browser cache and localStorage
- Check browser console for errors
- Ensure JavaScript is enabled

### Charts not showing?
- Check if Recharts is installed: `pnpm list recharts`
- Reinstall dependencies: `pnpm install`

### Port 3000 already in use?
```bash
# Use a different port
pnpm dev --port 3001
```

## Support

For issues or questions, please check:
- Browser console for errors
- Network tab for failed requests
- React DevTools for component state

## License

MIT
