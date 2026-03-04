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
        card: '0 10px 30px hsl(var(--surface-border) / 0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
