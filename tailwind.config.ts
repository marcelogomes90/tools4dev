import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          foreground: 'hsl(var(--surface-foreground))',
          muted: 'hsl(var(--surface-muted))',
          border: 'hsl(var(--surface-border))',
          accent: 'hsl(var(--surface-accent))',
        },
      },
      boxShadow: {
        card: '0 22px 48px hsl(var(--surface-border) / 0.2), 0 3px 10px hsl(var(--surface-border) / 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
