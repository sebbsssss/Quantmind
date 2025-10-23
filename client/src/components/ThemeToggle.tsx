import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      style={{
        backgroundColor: isDark ? 'hsl(0, 0%, 18%)' : 'hsl(0, 0%, 90%)',
      }}
      aria-label="Toggle theme"
    >
      {/* Sliding circle */}
      <span
        className="inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out"
        style={{
          transform: isDark ? 'translateX(2.5rem)' : 'translateX(0.25rem)',
        }}
      >
        {/* Icon inside the circle */}
        <span className="flex h-full w-full items-center justify-center">
          {isDark ? (
            <Moon className="h-4 w-4 text-gray-800 transition-transform duration-300" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-500 transition-transform duration-300" />
          )}
        </span>
      </span>

      {/* Background icons */}
      <span className="absolute left-2 top-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ opacity: isDark ? 0 : 1 }}>
        <Sun className="h-4 w-4 text-gray-400" />
      </span>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ opacity: isDark ? 1 : 0 }}>
        <Moon className="h-4 w-4 text-gray-400" />
      </span>
    </button>
  );
}

