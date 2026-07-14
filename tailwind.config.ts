import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Bauhaus Primary Colors
        bauhaus: {
          red: '#E63946',
          yellow: '#F1C40F',
          blue: '#2563EB',
          black: '#000000',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-noto-sans)', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'serif'],
        // Individual font families for selector
        inter: ['var(--font-inter)', 'sans-serif'],
        'noto-sans': ['var(--font-noto-sans)', 'sans-serif'],
        lexend: ['var(--font-lexend)', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
        'instrument-serif': ['var(--font-instrument-serif)', 'serif'],
        'eb-garamond': ['var(--font-eb-garamond)', 'serif'],
        'playfair-display': ['var(--font-playfair-display)', 'serif'],
      },
      borderRadius: {
        'bauhaus-sm': '2px',
        'bauhaus-md': '4px',
        'bauhaus-lg': '6px',
      },
      boxShadow: {
        'bauhaus-sm': '2px 2px 0px rgba(0, 0, 0, 0.1)',
        'bauhaus-md': '4px 4px 0px rgba(0, 0, 0, 0.15)',
        'bauhaus-lg': '8px 8px 0px rgba(0, 0, 0, 0.2)',
        'bauhaus-xl': '12px 12px 0px rgba(0, 0, 0, 0.25)',
      },
      spacing: {
        'bauhaus-1': '8px',
        'bauhaus-2': '16px',
        'bauhaus-3': '24px',
        'bauhaus-4': '32px',
        'bauhaus-5': '40px',
        'bauhaus-6': '48px',
        'bauhaus-8': '64px',
      },
    },
  },
  plugins: [],
};
export default config;
