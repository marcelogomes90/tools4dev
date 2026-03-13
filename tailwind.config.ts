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
                    'accent-hover': 'hsl(var(--surface-accent-hover))',
                    input: 'hsl(var(--surface-input))',
                    card: 'hsl(var(--surface-card))',
                },
            },
            boxShadow: {
                card: '0 4px 24px hsl(var(--surface-border) / 0.18), 0 1px 6px hsl(var(--surface-border) / 0.12)',
            },
        },
    },
    plugins: [],
};

export default config;
