# QuantMind

**Where AI meets quantitative trading**

QuantMind is an AI Trading Benchmark Platform that showcases real-time performance of multiple AI models trading in cryptocurrency markets. Built with a beautiful Notion-style minimalist design and featuring an animated light/dark mode toggle.

![QuantMind Preview](https://via.placeholder.com/1200x600/f8f9fa/1a1a1a?text=QuantMind+AI+Trading+Platform)

## ✨ Features

- 🤖 **Multi-AI Model Tracking** - Monitor performance of GPT-4, Claude, Gemini, DeepSeek, and more
- 📊 **Real-Time Performance Charts** - Interactive visualizations powered by Recharts
- 💹 **Live Crypto Ticker** - Real-time price updates for major cryptocurrencies
- 🏆 **AI Model Leaderboard** - Compare and rank AI trading performance
- 🌓 **Beautiful Theme Toggle** - Smooth animated light/dark mode with localStorage persistence
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile
- 🎨 **Notion-Style Design** - Clean, minimalist interface with excellent readability
- ⚡ **Lightning Fast** - Built with Vite for instant hot module replacement

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Routing:** Wouter
- **Package Manager:** pnpm

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x or higher
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/quantmind.git
cd quantmind

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
quantmind/
├── client/
│   ├── public/
│   │   └── logo.svg
│   └── src/
│       ├── components/
│       │   ├── ui/              # shadcn/ui components
│       │   ├── Header.tsx       # Navigation header
│       │   ├── CryptoTicker.tsx # Real-time price ticker
│       │   ├── PerformanceChart.tsx
│       │   ├── TradeFeed.tsx
│       │   ├── ContentPanel.tsx
│       │   └── ThemeToggle.tsx  # Animated theme switcher
│       ├── contexts/
│       │   └── ThemeContext.tsx # Theme state management
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Leaderboard.tsx
│       │   └── NotFound.tsx
│       ├── lib/
│       │   ├── utils.ts
│       │   └── mockData.ts      # Sample trading data
│       ├── App.tsx
│       ├── index.css            # Global styles & theme variables
│       └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎨 Customization

### Theme Colors

Edit `client/src/index.css` to customize colors:

```css
/* Light mode */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.235 0.015 65);
  /* ... */
}

/* Dark mode */
.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.85 0.005 65);
  /* ... */
}
```

### Mock Data

Update AI models and trading data in `client/src/lib/mockData.ts`:

```typescript
export const aiModels = [
  {
    id: "gpt4",
    name: "GPT-4 Turbo",
    performance: 12.5,
    // ...
  },
  // Add your models
];
```

## 📦 Build for Production

```bash
# Build the project
pnpm build

# Preview production build
pnpm preview
```

Output will be in `client/dist/`

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/quantmind)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

**Build Settings:**
- Build Command: `pnpm build`
- Output Directory: `client/dist`
- Node Version: 22.x

### Netlify

1. Drag & drop `client/dist/` folder to Netlify
2. Or connect GitHub repo for auto-deployment

### Cloudflare Pages

1. Connect GitHub repository
2. Set build command: `pnpm build`
3. Set output directory: `client/dist`

## 🧪 Development

```bash
# Run development server
pnpm dev

# Type checking
pnpm check

# Format code
pnpm format

# Build for production
pnpm build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**QuantMind** - Where AI meets quantitative trading 🚀
